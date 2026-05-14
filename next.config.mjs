import { createRequire } from 'module'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs', '@auth/prisma-adapter'],
}

export default nextConfig
