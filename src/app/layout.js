import './globals.css'
import { Lexend } from 'next/font/google'
import Providers from './providers'

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata = {
  title: 'CeriaEdu',
  description: 'Platform belajar Matematika dan Bahasa Inggris untuk siswa SD kelas 4–6',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={lexend.variable}>
      <body>
        <Providers session={null}>{children}</Providers>
      </body>
    </html>
  )
}
