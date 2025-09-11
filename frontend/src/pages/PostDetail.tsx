import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import dayjs from 'dayjs'
import { HiCalendar, HiArrowLeft, HiExclamationCircle } from 'react-icons/hi'

type Post = { 
  id: number
  title: string
  excerpt: string
  content: string
  coverUrl?: string
  createdAt: string 
}

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setLoading(true)
          setError(null)
          
          console.log('Fetching post with ID:', id) // Debug log
          
          const { data } = await api.get(`/posts/${id}`)
          console.log('Post data received:', data) // Debug log
          
          setPost(data)
        } catch (error: any) {
          console.error('Error fetching post:', error)
          
          // Check different types of errors
          if (error.response?.status === 404) {
            setError('Berita tidak ditemukan')
          } else if (error.response?.status >= 500) {
            setError('Terjadi kesalahan server. Silakan coba lagi nanti.')
          } else {
            setError('Terjadi kesalahan saat memuat berita')
          }
        } finally {
          setLoading(false)
        }
      })()
    } else {
      setLoading(false)
      setError('ID berita tidak valid')
    }
  }, [id])

  const getImageUrl = (url: string) => {
    if (!url) return ''
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    if (url.startsWith('/uploads/')) {
      return `http://localhost:4000${url}`
    }
    
    return url
  }

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat berita...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="section">
        <div className="container">
          <div className="text-center py-16">
            <HiExclamationCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-gray-900">
              {error || 'Berita tidak ditemukan'}
            </h1>
            <p className="text-gray-600 mb-6">
              {error ? 'Silakan coba lagi atau kembali ke halaman blog.' : 'Berita yang Anda cari mungkin telah dihapus atau tidak tersedia.'}
            </p>
            <Link to="/blog" className="btn btn-primary flex items-center mx-auto w-fit">
              <HiArrowLeft className="mr-2 w-4 h-4" />
              Kembali ke Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <nav className="mb-6">
          <Link 
            to="/blog" 
            className="text-blue-600 hover:text-blue-800 flex items-center w-fit hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <HiArrowLeft className="mr-2 w-4 h-4" />
            Kembali ke Blog
          </Link>
        </nav>
        
        <article className="card overflow-hidden">
          {post.coverUrl && (
            <div className="relative">
              <img
                src={getImageUrl(post.coverUrl)}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('Cover image failed to load:', post.coverUrl)
                  e.currentTarget.src = `https://picsum.photos/seed/post${post.id}/800/400`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <HiCalendar className="w-4 h-4 mr-2" />
              {dayjs(post.createdAt).format('DD MMMM YYYY')}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
              {post.title}
            </h1>
            
            <div className="text-lg text-gray-600 mb-6 leading-relaxed border-l-4 border-blue-200 pl-4 bg-blue-50 p-4 rounded-r-lg">
              {post.excerpt}
            </div>
            
            <div className="prose max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed text-base">
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>
            
            {/* Sharing Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Artikel ini dipublikasikan pada {dayjs(post.createdAt).format('DD MMMM YYYY')}
                </div>
                <Link to="/blog" className="btn btn-primary btn-sm flex items-center">
                  <HiArrowLeft className="mr-2 w-4 h-4" />
                  Kembali ke Blog
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}