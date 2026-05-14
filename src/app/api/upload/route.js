import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadToCloudinary(buffer, filename, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      },
    )
    stream.end(buffer)
  })
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') ?? 'ceriaedu'

    if (!file) {
      return NextResponse.json({ error: 'File wajib disertakan' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const result = await uploadToCloudinary(buffer, filename, folder)

    return NextResponse.json({
      data: { public_url: result.secure_url, public_id: result.public_id },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengunggah gambar, coba lagi' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { public_id } = await request.json()
    if (!public_id) {
      return NextResponse.json({ error: 'public_id wajib disertakan' }, { status: 400 })
    }

    await cloudinary.uploader.destroy(public_id)
    return NextResponse.json({ data: { message: 'Gambar berhasil dihapus' } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus gambar' }, { status: 500 })
  }
}
