import { useEffect, useState } from 'react'
import api from '../lib/api'
import dayjs from 'dayjs'

type Activity = { id:number; title:string; date:string; description:string; coverUrl?:string }

export default function Kegiatan(){
  const [items,setItems]=useState<Activity[]>([])
  useEffect(()=>{ (async()=>{
    const {data}=await api.get('/activities')
    setItems(data.items)
  })() },[])
  return (
    <div className="section">
      <h1 className="text-3xl font-bold mb-6">Kegiatan</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map(a=>(
          <div key={a.id} className="card overflow-hidden">
            <img src={a.coverUrl || `https://picsum.photos/seed/act${a.id}/800/400`} alt={a.title} className="w-full h-56 object-cover"/>
            <div className="p-5">
              <div className="text-xs text-gray-500">{dayjs(a.date).format('DD MMM YYYY')}</div>
              <div className="text-xl font-semibold">{a.title}</div>
              <p className="text-gray-600 mt-2">{a.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
