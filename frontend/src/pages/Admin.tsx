import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useForm, Controller } from 'react-hook-form'
import ImageInput from '../components/ImageInput'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SDN Petir 3</h1>
          <p className="text-gray-600 mt-2">Dashboard Admin</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center mb-4">Login Admin</h2>
          <input className="input" placeholder="Username" {...register('username')}/>
          <input className="input" placeholder="Password" type="password" {...register('password')}/>
          <button className="btn btn-primary w-full">Masuk</button>
        </form>
        
        <div className="text-center mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Kembali ke Website
          </Link>
        </div>
      </div>
    </div>
  )
}

function LayoutAdmin({logout}:{logout:()=>void}){
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">SDN Petir 3</h1>
              <span className="text-sm text-gray-500">Dashboard Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
                Lihat Website
              </Link>
              <button className="btn" onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        <nav className="flex gap-3 mb-8">
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
          <Route path="/" element={<AdminDashboard />}/>
        </Routes>
      </div>
    </div>
  )
}

// Komponen Dashboard Admin Home
function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    activities: 0,
    gallery: 0,
    organization: 0
  })

  useEffect(() => {
    (async () => {
      try {
        const [postsRes, activitiesRes, galleryRes, orgRes] = await Promise.all([
          api.get('/posts'),
          api.get('/activities'),
          api.get('/gallery'),
          api.get('/organization')
        ])
        
        setStats({
          posts: postsRes.data.items.length,
          activities: activitiesRes.data.items.length,
          gallery: galleryRes.data.items.length,
          organization: orgRes.data.items.length
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    })()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Selamat Datang di Dashboard Admin</h2>
        <p className="text-gray-600">Kelola konten website SDN Petir 3 dari dashboard ini.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Berita</p>
              <p className="text-2xl font-bold text-blue-600">{stats.posts}</p>
            </div>
            <div className="text-3xl">📰</div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Kegiatan</p>
              <p className="text-2xl font-bold text-green-600">{stats.activities}</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Galery</p>
              <p className="text-2xl font-bold text-purple-600">{stats.gallery}</p>
            </div>
            <div className="text-3xl">🖼️</div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Anggota Organisasi</p>
              <p className="text-2xl font-bold text-orange-600">{stats.organization}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Aksi Cepat</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="posts" className="btn btn-primary">
            Tambah Berita
          </Link>
          <Link to="activities" className="btn btn-primary">
            Tambah Kegiatan
          </Link>
          <Link to="gallery" className="btn btn-primary">
            Tambah Foto
          </Link>
          <Link to="org" className="btn btn-primary">
            Kelola Organisasi
          </Link>
        </div>
      </div>
    </div>
  )
}

function CRUD({resource}:{resource:'posts'|'activities'|'gallery'|'organization'}){
  const [items,setItems]=useState<any[]>([])
  const [editingItem, setEditingItem] = useState<any>(null)
  const {register,handleSubmit,reset,setValue,control} = useForm()
  const token = localStorage.getItem('token')
  const location = useLocation()
  
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

  // Title mapping untuk header
  const titleMap = {
    posts: 'Kelola Berita',
    activities: 'Kelola Kegiatan', 
    gallery: 'Kelola Galery',
    organization: 'Struktur Organisasi'
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{titleMap[resource]}</h2>
        <Link to="/admin" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Kembali ke Dashboard
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="card p-4 space-y-3">
          <h3 className="font-semibold">{editingItem ? 'Edit' : 'Tambah'} Data</h3>
          
          {resource==='posts' && (<>
            <input className="input" placeholder="Judul" {...register('title')}/>
            <input className="input" placeholder="Excerpt" {...register('excerpt')}/>
            <textarea className="input min-h-28" placeholder="Konten" {...register('content')}></textarea>
            <div>
              <label className="block text-sm font-medium mb-1">Cover Image</label>
              <Controller
                name="coverUrl"
                control={control}
                render={({ field }) => (
                  <ImageInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Cover URL"
                  />
                )}
              />
            </div>
          </>)}
          
          {resource==='activities' && (<>
            <input className="input" placeholder="Judul Kegiatan" {...register('title')}/>
            <textarea className="input min-h-20" placeholder="Deskripsi" {...register('description')}></textarea>
            <input className="input" type="date" placeholder="Tanggal" {...register('date')}/>
            <div>
              <label className="block text-sm font-medium mb-1">Gambar Kegiatan</label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Image URL"
                  />
                )}
              />
            </div>
          </>)}
          
          {resource==='organization' && (<>
            <input className="input" placeholder="Nama" {...register('name')}/>
            <input className="input" placeholder="Jabatan" {...register('position')}/>
            <div>
              <label className="block text-sm font-medium mb-1">Foto</label>
              <Controller
                name="photoUrl"
                control={control}
                render={({ field }) => (
                  <ImageInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Photo URL"
                  />
                )}
              />
            </div>
          </>)}
          
          {resource==='gallery' && (<>
            <input className="input" placeholder="Judul Foto" {...register('title')}/>
            <div>
              <label className="block text-sm font-medium mb-1">Gambar</label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Image URL"
                  />
                )}
              />
            </div>
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
                  {it.coverUrl && (
                    <img 
                      className="w-40 h-24 object-cover rounded border mt-2" 
                      src={getImageUrl(it.coverUrl)} 
                      alt="Cover"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error('Cover image failed to load:', getImageUrl(it.coverUrl))
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                </>)}
                {resource==='activities' && (<>
                  <div>{it.title}</div>
                  <div className="text-sm text-gray-600">{it.description}</div>
                  <div className="text-xs text-gray-500">{new Date(it.date).toLocaleDateString('id-ID')}</div>
                  {it.imageUrl && (
                    <img 
                      className="w-40 h-24 object-cover rounded border mt-2" 
                      src={getImageUrl(it.imageUrl)} 
                      alt="Activity"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error('Activity image failed to load:', getImageUrl(it.imageUrl))
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                </>)}
                {resource==='organization' && (<>
                  <div>{it.name}</div>
                  <div className="text-sm text-gray-600">{it.position}</div>
                  {it.photoUrl && (
                    <img 
                      className="w-40 h-24 object-cover rounded border mt-2" 
                      src={getImageUrl(it.photoUrl)} 
                      alt="Photo"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error('Photo failed to load:', getImageUrl(it.photoUrl))
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                </>)}
                {resource==='gallery' && (<>
                  <div>{it.title}</div>
                  <img 
                    className="w-40 h-24 object-cover rounded border" 
                    src={getImageUrl(it.imageUrl)} 
                    alt="Gallery"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error('Gallery image failed to load:', getImageUrl(it.imageUrl))
                      e.currentTarget.style.display = 'none'
                    }}
                  />
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
    </div>
  )
}

export default function Admin(){
  const {token,setToken,logout} = useAuth()
  return token ? <LayoutAdmin logout={logout}/> : <Login setToken={setToken}/>
}