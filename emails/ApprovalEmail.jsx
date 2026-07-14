import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const ApprovalEmail = ({ name, email, password, loginUrl }) => {
  return (
    <Html>
      <Head />
      <Preview>Akun CeriaEdu Anda Telah Disetujui</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Halo, {name}!</Heading>
          <Text style={text}>
            Pendaftaran akun Anda di <strong>CeriaEdu</strong> telah{" "}
            <strong>disetujui</strong> oleh Admin.
          </Text>
          <Text style={text}>
            Anda sekarang dapat masuk dan menikmati semua fitur belajar yang
            tersedia.
          </Text>

          {password && (
            <Section style={credentialsBox}>
              <Text style={credentialTitle}>
                <strong>Informasi Login Anda:</strong>
              </Text>
              <Text style={credentialItem}>
                Email: <strong>{email}</strong>
              </Text>
              <Text style={credentialItem}>
                Password: <strong>{password}</strong>
              </Text>
              <Text style={italicText}>
                Demi keamanan, segera ubah password Anda setelah berhasil masuk.
              </Text>
            </Section>
          )}

          <Section style={btnContainer}>
            <Button style={button} href={loginUrl}>
              Masuk ke CeriaEdu
            </Button>
          </Section>

          <Text style={footer}>
            Jika tombol di atas tidak berfungsi, salin URL ini ke browser Anda:{" "}
            {loginUrl}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 20px 48px", // Added 20px side padding for mobile
  width: "100%", // Use 100% instead of fixed 580px
  maxWidth: "580px", // Put 580px as max width
};

const h1 = {
  color: "#005DA7",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0",
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const credentialsBox = {
  backgroundColor: "#f4f4f5",
  padding: "20px",
  borderRadius: "8px",
  margin: "24px 0",
};

const credentialTitle = {
  margin: "0 0 12px 0",
  color: "#333",
  fontSize: "16px",
};

const credentialItem = {
  margin: "0 0 8px 0",
  color: "#333",
  fontSize: "16px",
};

const italicText = {
  margin: "16px 0 0 0",
  color: "#666",
  fontSize: "14px",
  fontStyle: "italic",
};

const btnContainer = {
  textAlign: "center",
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#005DA7",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 24px",
};

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "20px",
};

export default ApprovalEmail;
