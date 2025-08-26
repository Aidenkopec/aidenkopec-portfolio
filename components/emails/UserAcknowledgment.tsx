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

interface UserAcknowledgmentEmailProps {
  userName: string;
}

export const UserAcknowledgmentEmail = ({
  userName,
}: UserAcknowledgmentEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank you for reaching out - I&apos;ll be in touch soon!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={h1}>Thank you for reaching out!</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            I received your message and I&apos;ll get back in touch with you as
            soon as possible. I appreciate you taking the time to reach out and
            look forward to connecting with you.
          </Text>
          <Text style={text}>
            Best regards,
            <br />
            Aiden Kopec
          </Text>
          <Text style={footer}>
            This is an automated response to confirm receipt of your message.
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

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '32px',
};

export default UserAcknowledgmentEmail;
