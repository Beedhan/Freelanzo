import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InvitationConfirmEmailProps {
  invitationUrl: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const InvitationConfirmEmail = ({
  invitationUrl = "#",
}: InvitationConfirmEmailProps) => (
  <Html>
    <Head />
    <Preview>
      A fine-grained personal access token has been added to your account
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={"https://res.cloudinary.com/birajstore/image/upload/v1686753241/Freelanzo_trans_fcv4ip.png"}
          width="150"
          alt="Freelanzo"
        />
        <Section style={section}>
          <Text style={text}>
            {"You've been invited to join"} workspace.
          </Text>

          <Button href={invitationUrl} style={button}>
            Accept Invitation
          </Button>
        </Section>
        <Text style={links}>
          <Link style={link} href="#">
            Contact support
          </Link>
        </Text>

        <Text style={footer}> ・ Pokhara,17</Text>
      </Container>
    </Body>
  </Html>
);

export default InvitationConfirmEmail;

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  width: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const title = {
  fontSize: "24px",
  lineHeight: 1.25,
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};

const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
};

const button = {
  backgroundColor: "#004aad",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "150px",
  paddingTop: "10px",
  paddingBottom: "10px",
};

const links = {
  textAlign: "center" as const,
};

const link = {
  color: "#004aad",
  fontSize: "12px",
};

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "60px",
};
