import { useEffect, useState } from 'react'
import api from '../lib/api'
import dayjs from 'dayjs'

type Activity = { id:number; title:string; date:string; description:string; imageUrl?:string }

export default function Kegiatan(){
  const [items,setItems]=useState<Activity[]>([])
  
  useEffect(()=>{ (async()=>{
    const {data}=await api.get('/activities')
    setItems(data.items)
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
        <h1 className="text-3xl font-bold mb-6">Kegiatan</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map(a=>(

            <div key={a.id} className="card overflow-hidden">
              <img 
                src={a.imageUrl ? getImageUrl(a.imageUrl) : `https://picsum.photos/seed/act${a.id}/800/400`} 
                alt={a.title} 
                className="w-full h-56 object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('Activity image failed to load:', a.imageUrl)
                  e.currentTarget.src = `https://picsum.photos/seed/act${a.id}/800/400`
                }}
              />
              <div className="p-5">
                <div className="text-xs text-gray-500">{dayjs(a.date).format('DD MMM YYYY')}</div>
                <div className="text-xl font-semibold mt-1 mb-2">{a.title}</div>
                <p className="text-gray-600">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
