'use client'

import { useRef, useState } from 'react'
import Button from '@/components/ui/Button'

/**
 * Extract Cloudinary public_id from a secure URL.
 * e.g. https://res.cloudinary.com/demo/image/upload/v123/ceriaedu/subjects/file.jpg
 * → ceriaedu/subjects/file
 */
function extractPublicId(url) {
  if (!url) return null
  try {
    const parts = url.split('/upload/')
    if (parts.length < 2) return null
    // Remove version segment (v12345/) if present, then strip extension
    const withoutVersion = parts[1].replace(/^v\d+\//, '')
    return withoutVersion.replace(/\.[^/.]+$/, '')
  } catch {
    return null
  }
}

async function deleteFromCloudinary(url) {
  const public_id = extractPublicId(url)
  if (!public_id) return
  try {
    await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id }),
    })
  } catch {
    // Non-critical — log silently, don't block upload
    console.warn('Failed to delete old image from Cloudinary:', public_id)
  }
}

export default function ImageUpload({ onUpload, currentUrl, folder = 'ceriaedu' }) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(currentUrl ?? null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setIsLoading(true)

    // Delete old image from Cloudinary before uploading new one
    if (preview) {
      await deleteFromCloudinary(preview)
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Gagal mengunggah gambar')
        return
      }

      const url = json.data.public_url
      setPreview(url)
      onUpload?.(url)
    } catch {
      setError('Gagal mengunggah gambar')
    } finally {
      setIsLoading(false)
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
