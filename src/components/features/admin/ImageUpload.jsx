'use client'

import { useRef, useState } from 'react'
import { useUploadImageMutation } from '@/lib/redux/api/uploadApi'
import Button from '@/components/ui/Button'

export default function ImageUpload({ onUpload, currentUrl }) {
  const fileInputRef = useRef(null)
  const [uploadImage, { isLoading }] = useUploadImageMutation()
  const [preview, setPreview] = useState(currentUrl ?? null)
  const [error, setError] = useState('')

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadImage(formData)
    if (res.data) {
      const url = res.data.data.public_url
      setPreview(url)
      onUpload?.(url)
    } else {
      setError('Gagal mengunggah gambar')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full max-h-48 object-cover rounded-xl border border-outline-variant"
        />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="ghost"
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        {isLoading ? 'Mengunggah...' : preview ? 'Ganti Gambar' : 'Pilih Gambar'}
      </Button>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}
