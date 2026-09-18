import { z } from 'zod';

/**
 * Shared by the form and the route. Not 'server-only'.
 *
 * Every constraint needs an explicit message: these strings are rendered to the
 * visitor verbatim, and zod's defaults are not user facing prose.
 */
export const contactSchema = z.object(
  {
    name: z
      .string({ error: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      // Unicode letters. [a-zA-Z] rejects José, Müller, Nguyễn, 李.
      .regex(
        /^[\p{L}\p{M}\s'-]+$/u,
        'Name can only contain letters, spaces, hyphens, and apostrophes',
      ),
    // Matches what the browser enforces on <input type='email'>. Zod's default
    // is stricter and rejects legal local parts.
    //
    // Piped rather than `z.email().trim()`: appending trim to a format schema
    // runs the transform after the check, so a pasted address with a trailing
    // space would still fail. html5Email rejects surrounding whitespace.
    email: z
      .string({ error: 'Please provide a valid email address' })
      .trim()
      .pipe(
        z.email({
          pattern: z.regexes.html5Email,
          error: 'Please provide a valid email address',
        }),
      ),
    message: z
      .string({ error: 'Message is required' })
      .trim()
      .min(10, 'Message must be at least 10 characters')
      .max(5000, 'Message must be less than 5000 characters'),
  },
  // Body is not an object at all, e.g. unparseable JSON.
  { error: 'Invalid request' },
);

export type ContactInput = z.infer<typeof contactSchema>;

/** First message, for the form's single-error display. */
export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Please check the form and try again';
}
