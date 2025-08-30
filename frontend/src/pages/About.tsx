import { useEffect, useState } from 'react'
import api from '../lib/api'

type Member = { id:number; name:string; position:string; photoUrl?:string }

export default function About(){
  const [members,setMembers]=useState<Member[]>([])
  useEffect(()=>{ (async()=>{
    const {data}=await api.get('/organization')
    setMembers(data.items)
  })() },[])
  return (
    <div className="section space-y-8">
      <section className="card p-6">
        <h1 className="text-3xl font-bold">Tentang Kami</h1>
        <p className="text-gray-600 mt-3">
          SDN Petir 3 adalah Sekolah Dasar Negeri yang berlokasi di Jl. KH. Ahmad Dahlan No.59, Petir, Kec. Cipondoh, Kota Tangerang, Banten 15147.
          Kami berkomitmen memberikan pendidikan berkualitas dan berkarakter.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Struktur Organisasi</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {members.map(m=>(
            <div key={m.id} className="card p-5 text-center">
              <img src={m.photoUrl || `https://picsum.photos/seed/teacher${m.id}/240/240`} className="w-32 h-32 rounded-full object-cover mx-auto border" />
              <div className="mt-3 font-semibold">{m.name}</div>
              <div className="text-sm text-gray-500">{m.position}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
