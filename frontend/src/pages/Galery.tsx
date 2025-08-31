import { useEffect, useState } from 'react'
import api from '../lib/api'

type Photo = { id:number; title:string; imageUrl:string }

export default function Galery(){
  const [photos,setPhotos]=useState<Photo[]>([])
  
  useEffect(()=>{ (async()=>{
    const {data}=await api.get('/gallery')
    setPhotos(data.items)
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
      <h1 className="text-3xl font-bold mb-6">Galery Foto</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map(ph=>(
          <figure key={ph.id} className="card overflow-hidden">
            <img 
              src={getImageUrl(ph.imageUrl)} 
              alt={ph.title} 
              className="w-full h-48 object-cover"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Gallery image failed to load:', ph.imageUrl)
                e.currentTarget.src = `https://picsum.photos/seed/gallery${ph.id}/400/300`
              }}
            />
            <figcaption className="p-3 text-sm text-gray-700">{ph.title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
