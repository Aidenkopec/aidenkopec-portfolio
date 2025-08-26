import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactNotificationEmailProps {
  userName: string;
  userEmail: string;
  message: string;
}

export const ContactNotificationEmail = ({
  userName,
  userEmail,
  message,
}: ContactNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>New contact form submission from {userName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={h1}>New Contact Form Submission</Heading>

          <Section style={infoSection}>
            <Text style={label}>From:</Text>
            <Text style={value}>{userName}</Text>
          </Section>

          <Section style={infoSection}>
            <Text style={label}>Email:</Text>
            <Text style={value}>{userEmail}</Text>
          </Section>

          <Section style={infoSection}>
            <Text style={label}>Message:</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Text style={footer}>
            This message was sent through your portfolio contact form.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const infoSection = {
  marginBottom: '24px',
};

const label = {
  color: '#555',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const value = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 8px 0',
};

const messageText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0',
  padding: '16px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  border: '1px solid #e9ecef',
  whiteSpace: 'pre-wrap' as const,
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '32px',
  borderTop: '1px solid #eee',
  paddingTop: '16px',
};

export default ContactNotificationEmail;
