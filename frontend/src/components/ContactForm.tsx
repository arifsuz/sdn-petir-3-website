import { useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../lib/api'

type ContactForm = {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [responseMessage, setResponseMessage] = useState('')

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true)
    setSubmitStatus(null)
    setResponseMessage('')
    
    try {
      const response = await api.post('/contact', data)
      console.log('Email sent successfully:', response.data)
      
      setSubmitStatus('success')
      setResponseMessage(response.data.message || 'Pesan berhasil dikirim!')
      reset()
      
      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
        setResponseMessage('')
      }, 5000)
      
    } catch (error: any) {
      console.error('Contact form error:', error)
      
      setSubmitStatus('error')
      
      if (error.response?.data?.error) {
        setResponseMessage(error.response.data.error)
      } else if (error.code === 'ERR_NETWORK') {
        setResponseMessage('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
      } else {
        setResponseMessage('Gagal mengirim pesan. Silakan coba lagi.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold mb-4">Kirim Pesan</h3>
      
      {submitStatus === 'success' && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <div>
              <p className="font-medium">Berhasil!</p>
              <p className="text-sm">{responseMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-red-600">❌</span>
            <div>
              <p className="font-medium">Gagal mengirim</p>
              <p className="text-sm">{responseMessage}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            className={`input ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
            placeholder="Nama Lengkap *"
            {...register('name', { 
              required: 'Nama harus diisi',
              minLength: { value: 2, message: 'Nama minimal 2 karakter' }
            })}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <input
            className={`input ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
            type="email"
            placeholder="Email *"
            {...register('email', { 
              required: 'Email harus diisi',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Format email tidak valid'
              }
            })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
          <input
            className={`input ${errors.subject ? 'border-red-300 focus:border-red-500' : ''}`}
            placeholder="Subject *"
            {...register('subject', { 
              required: 'Subject harus diisi',
              minLength: { value: 5, message: 'Subject minimal 5 karakter' }
            })}
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
        </div>
        
        <div>
          <textarea
            className={`input min-h-32 ${errors.message ? 'border-red-300 focus:border-red-500' : ''}`}
            placeholder="Isi Pesan *"
            {...register('message', { 
              required: 'Pesan harus diisi',
              minLength: { value: 10, message: 'Pesan minimal 10 karakter' }
            })}
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>
        
        <button
          type="submit"
          className={`btn w-full ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'btn-primary hover:bg-blue-700'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Mengirim...
            </div>
          ) : (
            'Kirim Pesan'
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center">
          * Field wajib diisi. Pesan akan dikirim ke email administrator sekolah.
        </p>
      </form>
    </div>
  )
}