import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
// import { ApprovalEmail } from '@/emails/ApprovalEmail'
import ApprovalEmail from 'emails/ApprovalEmail'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendApprovalEmail({ email, name, password }) {
  try {
    const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3012'}/login`
    
    const htmlContent = await render(
      ApprovalEmail({ name, email, password, loginUrl })
    )

    await transporter.sendMail({
      from: `"CeriaEdu Admin" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Selamat! Akun CeriaEdu Anda Telah Disetujui',
      html: htmlContent,
    })
    
    return { success: true }
  } catch (error) {
    console.error('Gagal mengirim email:', error)
    return { success: false, error }
  }
}
