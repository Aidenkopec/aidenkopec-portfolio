/**
 * Spam protection utilities for contact form validation
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory rate limiting store (IP address -> submission count)
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX = 5; // max submissions per hour per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Detects gibberish/random letter sequences
 * Checks for patterns that indicate bot-generated spam
 */
function isGibberish(text: string): boolean {
  if (!text || text.length < 2) {
    return false;
  }

  const lowerText = text.toLowerCase();

  // Check for excessive consonant clusters (4+ consonants in a row)
  // Normal English rarely has more than 3 consonants together
  const consonantClusterPattern = /[bcdfghjklmnpqrstvwxyz]{4,}/g;
  if (consonantClusterPattern.test(lowerText)) {
    return true;
  }

  // Check for low vowel percentage (normal English: 35-45% vowels)
  const vowels = (text.match(/[aeiouAEIOU]/g) || []).length;
  const vowelPercentage = vowels / text.length;
  if (vowelPercentage < 0.2) {
    // Less than 20% vowels is suspicious
    return true;
  }

  // Check for repetitive consonant patterns like "jaj" or "mvmv"
  // Split text into groups of consonant-vowel patterns and check for repetition
  const patternMatches =
    text.match(/[bcdfghjklmnpqrstvwxyz]?[aeiouAEIOU]/gi) || [];
  if (patternMatches.length > 2) {
    // Look for the same pattern appearing multiple times
    const firstPattern = patternMatches[0]?.toLowerCase();
    const repetitionCount = patternMatches.filter(
      (p) => p.toLowerCase() === firstPattern,
    ).length;

    // If a pattern repeats 50% or more of the time, likely gibberish
    if (repetitionCount / patternMatches.length > 0.5) {
      return true;
    }
  }

  return false;
}

/**
 * Validates form submission content
 * Rejects obvious spam patterns and invalid input
 */
export function validateContactFormContent(
  name: string,
  email: string,
  message: string,
): { valid: boolean; error?: string } {
  // Validate name
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (trimmedName.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    return {
      valid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  // Check if name is gibberish/random characters
  if (isGibberish(trimmedName)) {
    return {
      valid: false,
      error: 'Name appears to contain random characters',
    };
  }

  // Validate email
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim().toLowerCase();
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Please provide a valid email address' };
  }

  // Validate message
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message is required' };
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters' };
  }

  if (trimmedMessage.length > 5000) {
    return { valid: false, error: 'Message must be less than 5000 characters' };
  }

  // Check for spam patterns: excessive random characters
  // Count non-alphabetic, non-space characters as a rough heuristic
  const randomCharPattern = /[^a-zA-Z0-9\s\.\,\!\?\-\'\"\:\;\(\)]/g;
  const randomCharCount = (trimmedMessage.match(randomCharPattern) || [])
    .length;
  const randomCharRatio =
    trimmedMessage.length > 0 ? randomCharCount / trimmedMessage.length : 0;

  // If >30% of characters are unusual symbols, likely spam
  if (randomCharRatio > 0.3) {
    return {
      valid: false,
      error: 'Message contains too many special characters',
    };
  }

  // Check if message is mostly uppercase (spam pattern)
  const uppercaseCount = (trimmedMessage.match(/[A-Z]/g) || []).length;
  const uppercaseRatio =
    trimmedMessage.length > 0 ? uppercaseCount / trimmedMessage.length : 0;

  if (uppercaseRatio > 0.8) {
    return {
      valid: false,
      error: 'Message appears to contain mostly uppercase characters',
    };
  }

  // Check if message is gibberish/random characters
  if (isGibberish(trimmedMessage)) {
    return {
      valid: false,
      error: 'Message appears to contain random characters',
    };
  }

  return { valid: true };
}

/**
 * Checks and enforces rate limiting per IP address
 * Returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(ipAddress: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(ipAddress);

  // Clean up expired entries
  if (entry && now >= entry.resetTime) {
    rateLimitStore.delete(ipAddress);
    return { allowed: true };
  }

  // Check if at limit
  if (entry && entry.count >= RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter: retryAfterSeconds };
  }

  // Increment counter
  if (entry) {
    entry.count += 1;
  } else {
    rateLimitStore.set(ipAddress, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
  }

  return { allowed: true };
}

/**
 * Extracts the real IP address from request
 * Handles X-Forwarded-For header for proxy/load balancer scenarios
 */
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const ip = request.headers.get('x-real-ip');
  if (ip) {
    return ip;
  }

  // Fallback - this won't work in all environments but is a fallback
  return 'unknown';
}
