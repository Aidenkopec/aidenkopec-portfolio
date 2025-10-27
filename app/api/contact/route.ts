import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import disposableDomains from 'disposable-email-domains';

import UserAcknowledgmentEmail from '../../../components/emails/UserAcknowledgment';
import ContactNotificationEmail from '../../../components/emails/ContactNotification';

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting map: IP -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3;

// Verify Turnstile token with Cloudflare
async function verifyTurnstileToken(token: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    },
  );

  const data = await response.json();
  return data.success === true;
}

// Check if email is from a disposable domain
function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return disposableDomains.includes(domain);
}

// Validate email format and domain
function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (isDisposableEmail(email)) {
    return { valid: false, error: 'Disposable email addresses are not allowed' };
  }

  return { valid: true };
}

// Validate content for spam patterns
function validateContent(name: string, message: string): { valid: boolean; error?: string } {
  // Check name length
  if (name.length < 2 || name.length > 100) {
    return { valid: false, error: 'Name must be between 2 and 100 characters' };
  }

  // Check message length
  if (message.length < 10 || message.length > 2000) {
    return { valid: false, error: 'Message must be between 10 and 2000 characters' };
  }

  // Check for excessive special characters (potential spam)
  const specialCharRatio = (name.match(/[^a-zA-Z0-9\s]/g) || []).length / name.length;
  if (specialCharRatio > 0.5) {
    return { valid: false, error: 'Name contains too many special characters' };
  }

  // Check for random character patterns (like "azljxQrEiBwanyHOpjFjjhfm")
  const hasConsecutiveRandomChars = /[a-z]{8,}/.test(message.toLowerCase()) &&
    !/\b(the|and|for|are|but|not|you|all|can|her|was|one|our|out|day|get)\b/.test(message.toLowerCase());

  if (hasConsecutiveRandomChars && message.length < 50) {
    return { valid: false, error: 'Message appears to contain random characters' };
  }

  return { valid: true };
}

// Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new entry
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return { allowed: false, error: 'Too many requests. Please try again later.' };
  }

  userLimit.count++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, turnstileToken } = await request.json();

    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // 1. Check rate limiting first
    const rateLimitCheck = checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: rateLimitCheck.error },
        { status: 429 },
      );
    }

    // 2. Validate required fields
    if (!name || !email || !message || !turnstileToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // 3. Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 403 },
      );
    }

    // 4. Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 },
      );
    }

    // 5. Validate content for spam patterns
    const contentValidation = validateContent(name, message);
    if (!contentValidation.valid) {
      return NextResponse.json(
        { error: contentValidation.error },
        { status: 400 },
      );
    }

    // All validations passed, send emails
    // Send acknowledgment email to user
    const userEmailResponse = await resend.emails.send({
      from: 'Aiden Kopec <noreply@aidenkopec.com>',
      to: [email],
      subject: 'Thank you for reaching out!',
      react: UserAcknowledgmentEmail({ userName: name }),
    });

    // Send notification email to you
    const notificationEmailResponse = await resend.emails.send({
      from: 'Portfolio Contact <noreply@aidenkopec.com>',
      to: ['aidenkopec@icloud.com'],
      subject: `New contact form submission from ${name}`,
      react: ContactNotificationEmail({
        userName: name,
        userEmail: email,
        message: message,
      }),
    });

    return NextResponse.json({
      message: 'Emails sent successfully',
      userEmailId: userEmailResponse.data?.id,
      notificationEmailId: notificationEmailResponse.data?.id,
    });
  } catch (error) {
    console.error('Detailed error sending emails:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error,
    });
    return NextResponse.json(
      {
        error: 'Failed to send emails',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
