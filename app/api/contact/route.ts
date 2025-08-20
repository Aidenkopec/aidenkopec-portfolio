import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import UserAcknowledgmentEmail from '../../../components/emails/UserAcknowledgment';
import ContactNotificationEmail from '../../../components/emails/ContactNotification';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('API Key loaded:', !!process.env.RESEND_API_KEY);
    
    const { name, email, message } = await request.json();
    console.log('Received form data:', { name, email, message: message.length + ' chars' });

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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
      error
    });
    return NextResponse.json(
      { error: 'Failed to send emails', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}