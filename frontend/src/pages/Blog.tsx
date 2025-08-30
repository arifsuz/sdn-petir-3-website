import { useEffect, useState } from 'react'
import api from '../lib/api'
import dayjs from 'dayjs'

type Post = { id:number; title:string; excerpt:string; content:string; coverUrl?:string; createdAt:string }

export default function Blog(){
  const [posts,setPosts]=useState<Post[]>([])
  useEffect(()=>{ (async()=>{
    const {data}=await api.get('/posts')
    setPosts(data.items)
  })() },[])
  return (
    <div className="section">
      <h1 className="text-3xl font-bold mb-6">Blog & Berita</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map(p=>(
          <article key={p.id} className="card overflow-hidden">
            <img src={p.coverUrl || `https://picsum.photos/seed/post${p.id}/600/400`} alt={p.title} className="w-full h-44 object-cover"/>
            <div className="p-5">
              <div className="text-xs text-gray-500">{dayjs(p.createdAt).format('DD MMM YYYY')}</div>
              <h2 className="text-xl font-semibold mt-1">{p.title}</h2>
              <p className="text-gray-600 mt-2">{p.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
