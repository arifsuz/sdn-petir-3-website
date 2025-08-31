import { useState, useRef } from 'react'
import api from '../lib/api'

interface ImageInputProps {
  value?: string
  onChange: (url: string) => void
  placeholder?: string
}

export default function ImageInput({ value, onChange, placeholder = "Image URL" }: ImageInputProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [inputType, setInputType] = useState<'url' | 'upload'>('url')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const token = localStorage.getItem('token')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      // Gunakan URL lengkap dengan domain backend
      const fullUrl = `http://localhost:4000${response.data.imageUrl}`
      onChange(fullUrl)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload gagal!')
    } finally {
      setIsUploading(false)
    }
  }

  // Function untuk memastikan URL gambar valid
  const getImageUrl = (url: string) => {
    if (!url) return ''
    
    // Jika URL sudah lengkap (http/https), gunakan langsung
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    // Jika URL relatif yang dimulai dengan /uploads, tambahkan domain backend
    if (url.startsWith('/uploads/')) {
      return `http://localhost:4000${url}`
    }
    
    // Jika URL lainnya, gunakan langsung
    return url
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          className={`px-3 py-1 text-sm rounded ${inputType === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setInputType('url')}
        >
          URL
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-sm rounded ${inputType === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setInputType('upload')}
        >
          Upload
        </button>
      </div>

      {inputType === 'url' ? (
        <input
          type="url"
          className="input w-full"
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="input w-full"
            disabled={isUploading}
          />
          {isUploading && (
            <div className="text-sm text-blue-500">Uploading...</div>
          )}
        </div>
      )}

      {value && (
        <div className="mt-2">
          <img 
            src={getImageUrl(value)} 
            alt="Preview" 
            className="w-32 h-20 object-cover rounded border"
            crossOrigin="anonymous"
            onLoad={() => console.log('Image loaded successfully:', getImageUrl(value))}
            onError={(e) => {
              console.error('Image failed to load:', getImageUrl(value))
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTI4IDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iODAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI2NCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjEyIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+'
            }}
          />
          <p className="text-xs text-gray-500 mt-1 break-all">URL: {getImageUrl(value)}</p>
        </div>
      )}
    </div>
  )
}