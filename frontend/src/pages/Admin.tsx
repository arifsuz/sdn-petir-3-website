import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useForm } from 'react-hook-form'

function useAuth(){
  const [token,setToken]=useState<string|undefined>(()=>localStorage.getItem('token')||undefined)
  const nav = useNavigate()
  function logout(){ localStorage.removeItem('token'); setToken(undefined); nav('/admin') }
  return { token, setToken, logout }
}

function Login({setToken}:{setToken:(t:string)=>void}){
  const {register,handleSubmit} = useForm()
  const onSubmit = async (v:any)=>{
    const {data}=await api.post('/auth/login',v)
    localStorage.setItem('token',data.token)
    setToken(data.token)
  }
  return (
    <div className="section max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login Admin</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 space-y-3">
        <input className="input" placeholder="username" {...register('username')}/>
        <input className="input" placeholder="password" type="password" {...register('password')}/>
        <button className="btn btn-primary w-full">Masuk</button>
      </form>
    </div>
  )
}

function LayoutAdmin({logout}:{logout:()=>void}){
  return (
    <div className="container section">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <button className="btn" onClick={logout}>Logout</button>
      </div>
      <nav className="flex gap-3 mb-6">
        <Link className="btn" to="posts">Kelola Berita</Link>
        <Link className="btn" to="activities">Kelola Kegiatan</Link>
        <Link className="btn" to="org">Struktur Organisasi</Link>
        <Link className="btn" to="gallery">Kelola Galery</Link>
      </nav>
      <Routes>
        <Route path="posts" element={<CRUD resource="posts"/>}/>
        <Route path="activities" element={<CRUD resource="activities"/>}/>
        <Route path="org" element={<CRUD resource="organization"/>}/>
        <Route path="gallery" element={<CRUD resource="gallery"/>}/>
      </Routes>
    </div>
  )
}

function CRUD({resource}:{resource:'posts'|'activities'|'gallery'|'organization'}){
  const [items,setItems]=useState<any[]>([])
  const [editingItem, setEditingItem] = useState<any>(null)
  const {register,handleSubmit,reset,setValue} = useForm()
  const token = localStorage.getItem('token')
  const location = useLocation()
  
  async function load(){
    const {data}=await api.get(`/${resource}`)
    setItems(data.items)
  }
  
  useEffect(()=>{ 
    load()
    setEditingItem(null)
    reset()
  },[location.pathname])

  const onSubmit = async (v:any)=>{
    // Format date untuk activities agar menjadi ISO DateTime
    if(resource === 'activities' && v.date) {
      v.date = new Date(v.date).toISOString();
    }
    
    if(editingItem) {
      await api.put(`/${resource}/${editingItem.id}`, v, { headers: { Authorization: `Bearer ${token}` }})
      setEditingItem(null)
    } else {
      await api.post(`/${resource}`, v, { headers: { Authorization: `Bearer ${token}` }})
    }
    reset(); load()
  }
  
  async function del(id:number){
    await api.delete(`/${resource}/${id}`, { headers: { Authorization: `Bearer ${token}` }})
    load()
  }
  
  function startEdit(item:any){
    setEditingItem(item)
    if(resource==='posts') {
      setValue('title', item.title)
      setValue('excerpt', item.excerpt)
      setValue('content', item.content)
      setValue('coverUrl', item.coverUrl)
    } else if(resource==='activities') {
      setValue('title', item.title)
      setValue('description', item.description)
      setValue('date', item.date?.split('T')[0])
      setValue('imageUrl', item.imageUrl)
    } else if(resource==='organization') {
      setValue('name', item.name)
      setValue('position', item.position)
      setValue('photoUrl', item.photoUrl)
    } else if(resource==='gallery') {
      setValue('title', item.title)
      setValue('imageUrl', item.imageUrl)
    }
  }
  
  function cancelEdit(){
    setEditingItem(null)
    reset()
  }
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 space-y-3">
        <h3 className="font-semibold">{editingItem ? 'Edit' : 'Tambah'} Data</h3>
        
        {resource==='posts' && (<>
          <input className="input" placeholder="Judul" {...register('title')}/>
          <input className="input" placeholder="Excerpt" {...register('excerpt')}/>
          <textarea className="input min-h-28" placeholder="Konten" {...register('content')}></textarea>
          <input className="input" placeholder="Cover URL (opsional)" {...register('coverUrl')}/>
        </>)}
        
        {resource==='activities' && (<>
          <input className="input" placeholder="Judul Kegiatan" {...register('title')}/>
          <textarea className="input min-h-20" placeholder="Deskripsi" {...register('description')}></textarea>
          <input className="input" type="date" placeholder="Tanggal" {...register('date')}/>
          <input className="input" placeholder="Image URL (opsional)" {...register('imageUrl')}/>
        </>)}
        
        {resource==='organization' && (<>
          <input className="input" placeholder="Nama" {...register('name')}/>
          <input className="input" placeholder="Jabatan" {...register('position')}/>
          <input className="input" placeholder="Photo URL (opsional)" {...register('photoUrl')}/>
        </>)}
        
        {resource==='gallery' && (<>
          <input className="input" placeholder="Judul Foto" {...register('title')}/>
          <input className="input" placeholder="Image URL" {...register('imageUrl')}/>
        </>)}
        
        <div className="flex gap-2">
          <button className="btn btn-primary flex-1">{editingItem ? 'Update' : 'Tambah'}</button>
          {editingItem && (
            <button type="button" className="btn" onClick={cancelEdit}>Batal</button>
          )}
        </div>
      </form>
      
      <div className="md:col-span-2 grid gap-4">
        {items.map(it=>(
          <div key={it.id} className="card p-4 flex items-start gap-4">
            <div className="font-semibold flex-1">
              {resource==='posts' && (<>
                <div>{it.title}</div>
                <div className="text-sm text-gray-600">{it.excerpt}</div>
              </>)}
              {resource==='activities' && (<>
                <div>{it.title}</div>
                <div className="text-sm text-gray-600">{it.description}</div>
                <div className="text-xs text-gray-500">{new Date(it.date).toLocaleDateString('id-ID')}</div>
              </>)}
              {resource==='organization' && (<>
                <div>{it.name}</div>
                <div className="text-sm text-gray-600">{it.position}</div>
              </>)}
              {resource==='gallery' && (<>
                <div>{it.title}</div>
                <img className="w-40 h-24 object-cover rounded border" src={it.imageUrl}/>
              </>)}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-sm" onClick={()=>startEdit(it)}>Edit</button>
              <button className="btn btn-sm" onClick={()=>del(it.id)}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Admin(){
  const {token,setToken,logout} = useAuth()
  return token ? <LayoutAdmin logout={logout}/> : <Login setToken={setToken}/>
}