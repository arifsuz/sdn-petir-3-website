import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import dayjs from 'dayjs'
import { HiNewspaper, HiCalendar, HiArrowRight } from 'react-icons/hi'

type Post = { id:number; title:string; excerpt:string; content:string; coverUrl?:string; createdAt:string }

export default function Blog(){
  const [posts,setPosts]=useState<Post[]>([])
  
  useEffect(()=>{ (async()=>{
    const {data}=await api.get('/posts')
    setPosts(data.items)
  })() },[])

  // Function untuk memastikan URL gambar valid
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

  return (
    <div className="section">
      <div className="container">
        <div className="flex items-center gap-3 mb-8">
          <HiNewspaper className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Blog & Berita</h1>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <HiNewspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Belum ada berita</h3>
            <p className="text-gray-500">Berita terbaru akan muncul di sini.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map(p=>(
              <article key={p.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={p.coverUrl ? getImageUrl(p.coverUrl) : `https://picsum.photos/seed/post${p.id}/600/400`} 
                  alt={p.title} 
                  className="w-full h-44 object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error('Blog image failed to load:', p.coverUrl)
                    e.currentTarget.src = `https://picsum.photos/seed/post${p.id}/600/400`
                  }}
                />
                <div className="p-5">
                  <div className="text-xs text-gray-500 flex items-center mb-2">
                    <HiCalendar className="w-3 h-3 mr-1" />
                    {dayjs(p.createdAt).format('DD MMM YYYY')}
                  </div>
                  <h2 className="text-xl font-semibold mt-1 mb-2">{p.title}</h2>
                  <p className="text-gray-600 mb-3">{p.excerpt}</p>
                  <Link to={`/post/${p.id}`} className="btn btn-primary flex items-center w-fit">
                    Baca Selengkapnya <HiArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}