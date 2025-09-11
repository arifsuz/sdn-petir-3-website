import { useEffect, useState } from 'react'
import api from '../lib/api'
import dayjs from 'dayjs'
import { HiCalendar, HiPhotograph } from 'react-icons/hi'

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
        <div className="flex items-center gap-3 mb-8">
          <HiCalendar className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold">Kegiatan</h1>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-16">
            <HiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Belum ada kegiatan</h3>
            <p className="text-gray-500">Kegiatan sekolah akan muncul di sini.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map(a=>(
              <div key={a.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
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
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center text-sm font-medium">
                    <HiCalendar className="w-4 h-4 mr-1 text-green-600" />
                    {dayjs(a.date).format('DD MMM YYYY')}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xl font-semibold mt-1 mb-2">{a.title}</div>
                  <p className="text-gray-600">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}