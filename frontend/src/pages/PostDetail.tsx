import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import dayjs from 'dayjs'

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

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const { data } = await api.get(`/posts/${id}`)
          setPost(data)
        } catch (error) {
          console.error('Error fetching post:', error)
        } finally {
          setLoading(false)
        }
      })()
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
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="section">
        <div className="container">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h1>
            <Link to="/blog" className="btn btn-primary">Kembali ke Blog</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <nav className="mb-6">
          <Link to="/blog" className="text-blue-600 hover:text-blue-800">
            ← Kembali ke Blog
          </Link>
        </nav>
        
        <article className="card overflow-hidden">
          {post.coverUrl && (
            <img
              src={getImageUrl(post.coverUrl)}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
              crossOrigin="anonymous"
              onError={(e) => {
                e.currentTarget.src = `https://picsum.photos/seed/post${post.id}/800/400`
              }}
            />
          )}
          
          <div className="p-6 md:p-8">
            <div className="text-sm text-gray-500 mb-2">
              {dayjs(post.createdAt).format('DD MMMM YYYY')}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="text-lg text-gray-600 mb-6">{post.excerpt}</div>
            
            <div className="prose max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}