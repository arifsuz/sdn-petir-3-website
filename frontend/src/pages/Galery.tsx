import { useEffect, useState } from 'react'
import api from '../lib/api'

type Photo = { id:number; title:string; imageUrl:string }

export default function Galery(){
  const [photos,setPhotos]=useState<Photo[]>([])
  useEffect(()=>{ (async()=>{
    const {data}=await api.get('/gallery')
    setPhotos(data.items)
  })() },[])
  return (
    <div className="section">
      <h1 className="text-3xl font-bold mb-6">Galery Foto</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map(ph=>(
          <figure key={ph.id} className="card overflow-hidden">
            <img src={ph.imageUrl} alt={ph.title} className="w-full h-48 object-cover"/>
            <figcaption className="p-3 text-sm text-gray-700">{ph.title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
