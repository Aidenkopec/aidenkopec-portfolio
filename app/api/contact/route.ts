import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

import UserAcknowledgmentEmail from '@/components/emails/UserAcknowledgment';
import ContactNotificationEmail from '@/components/emails/ContactNotification';
import { contactSchema, firstIssue } from '@/lib/contact-schema';

const NOTIFICATION_RECIPIENT = 'aidenkopec@icloud.com';

// Per request, not at module scope: new Resend(undefined) throws during module
// evaluation, outside the handler's try/catch.
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function isHoneypotFilled(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) return false;
  const value = (body as Record<string, unknown>).website;
  return typeof value === 'string' && value.trim().length > 0;
}

// Rate limiting is deliberately absent from this handler. It lives in the Vercel
// Firewall as a WAF rate limit rule on POST /api/contact, which runs at the edge
// on the real client IP and holds across function instances. The in-process
// limiter this replaced was per instance and keyed on a spoofable header.
export async function POST(request: NextRequest) {
  const correlationId = crypto.randomUUID();

  try {
    const resend = getResend();
    if (!resend) {
      console.error(`[contact:${correlationId}] RESEND_API_KEY is not set`);
      return NextResponse.json(
        { error: 'The contact form is unavailable right now.' },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: firstIssue(parsed.error).message },
        { status: 400 },
      );
    }
    const { name, email, message } = parsed.data;

    // Read from the raw body: the schema strips unknown keys rather than
    // rejecting them. Returns 200 so an automated submitter cannot detect the
    // check, which makes the log line the only signal if it misfires.
    if (isHoneypotFilled(body)) {
      console.warn(
        `[contact:${correlationId}] honeypot filled, dropping submission from ${email}`,
      );
      return NextResponse.json({ message: 'Message sent successfully' });
    }

    // Serial, notification first, so a failed notification never ships an
    // acknowledgment. send() resolves { data, error } on API and network
    // failure but rejects if the React template throws, so check both.
    const notification = await resend.emails.send({
      from: 'Portfolio Contact <noreply@aidenkopec.com>',
      to: [NOTIFICATION_RECIPIENT],
      subject: `New contact form submission from ${name}`,
      react: ContactNotificationEmail({
        userName: name,
        userEmail: email,
        message,
      }),
    });

    if (notification.error) {
      console.error(
        `[contact:${correlationId}] notification send failed:`,
        notification.error,
      );
      return NextResponse.json(
        { error: 'Failed to send your message. Please try again.' },
        { status: 502 },
      );
    }

    // Best effort: the message is already delivered, so a failure here must not
    // tell the visitor it was lost.
    const acknowledgment = await resend.emails
      .send({
        from: 'Aiden Kopec <noreply@aidenkopec.com>',
        to: [email],
        subject: 'Thank you for reaching out!',
        react: UserAcknowledgmentEmail({ userName: name }),
      })
      .catch((error: unknown) => ({ data: null, error }));

    if (acknowledgment.error) {
      console.warn(
        `[contact:${correlationId}] acknowledgment send failed (non fatal):`,
        acknowledgment.error,
      );
    }

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(`[contact:${correlationId}] unhandled error:`, error);
    return NextResponse.json(
      {
        error: 'Something went wrong. Please try again.',
        correlationId,
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 },
    );
  }
}
