import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useForm, Controller } from 'react-hook-form'
import ImageInput from '../components/ImageInput'
// Import React Icons
import { 
  HiHome, 
  HiNewspaper, 
  HiCalendar, 
  HiUsers, 
  HiPhotograph,
  HiGlobeAlt,
  HiLogout,
  HiX,
  HiMenu,
  HiArrowRight,
  HiPencilAlt,
  HiTrash,
  HiLightBulb,
  HiDocumentText
} from 'react-icons/hi'

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
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: HiHome },
    { path: '/admin/posts', label: 'Kelola Berita', icon: HiNewspaper },
    { path: '/admin/activities', label: 'Kelola Kegiatan', icon: HiCalendar },
    { path: '/admin/org', label: 'Struktur Organisasi', icon: HiUsers },
    { path: '/admin/gallery', label: 'Kelola Galery', icon: HiPhotograph },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-200 ease-in-out`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">SDN Petir 3</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className="mr-3 w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="space-y-2">
            <Link 
              to="/" 
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            >
              <HiGlobeAlt className="mr-3 w-5 h-5" />
              Lihat Website
            </Link>
            <button 
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50"
            >
              <HiLogout className="mr-3 w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
            >
              <HiMenu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              Dashboard Admin
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<AdminDashboard />}/>
              <Route path="posts" element={<CRUD resource="posts"/>}/>
              <Route path="activities" element={<CRUD resource="activities"/>}/>
              <Route path="org" element={<CRUD resource="organization"/>}/>
              <Route path="gallery" element={<CRUD resource="gallery"/>}/>
            </Routes>
          </div>
        </main>
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
  const [recentData, setRecentData] = useState({
    posts: [],
    activities: [],
    gallery: [],
    organization: []
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

        setRecentData({
          posts: postsRes.data.items.slice(0, 3),
          activities: activitiesRes.data.items.slice(0, 3),
          gallery: galleryRes.data.items.slice(0, 3),
          organization: orgRes.data.items.slice(0, 3)
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    })()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Selamat Datang di Dashboard Admin</h1>
        <p className="text-blue-100">Kelola konten website SDN Petir 3 dengan mudah dari dashboard ini.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Berita</p>
              <p className="text-3xl font-bold text-blue-600">{stats.posts}</p>
              <p className="text-xs text-gray-500 mt-1">Artikel yang dipublikasi</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <HiNewspaper className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Kegiatan</p>
              <p className="text-3xl font-bold text-green-600">{stats.activities}</p>
              <p className="text-xs text-gray-500 mt-1">Kegiatan sekolah</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <HiCalendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Galery</p>
              <p className="text-3xl font-bold text-purple-600">{stats.gallery}</p>
              <p className="text-xs text-gray-500 mt-1">Foto dokumentasi</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <HiPhotograph className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Anggota Organisasi</p>
              <p className="text-3xl font-bold text-orange-600">{stats.organization}</p>
              <p className="text-xs text-gray-500 mt-1">Struktur organisasi</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <HiUsers className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Berita Terbaru</h3>
            <Link to="/admin/posts" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              Lihat Semua <HiArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentData.posts.length > 0 ? recentData.posts.map((post: any) => (
              <div key={post.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded">
                <div className="p-2 bg-blue-50 rounded">
                  <HiNewspaper className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-500 truncate">{post.excerpt}</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">Belum ada berita</p>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Kegiatan Terbaru</h3>
            <Link to="/admin/activities" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
              Lihat Semua <HiArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentData.activities.length > 0 ? recentData.activities.map((activity: any) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded">
                <div className="p-2 bg-green-50 rounded">
                  <HiCalendar className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">Belum ada kegiatan</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/posts" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors group">
            <HiNewspaper className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Kelola Berita</span>
          </Link>
          <Link to="/admin/activities" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors group">
            <HiCalendar className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Kelola Kegiatan</span>
          </Link>
          <Link to="/admin/gallery" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors group">
            <HiPhotograph className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Kelola Galery</span>
          </Link>
          <Link to="/admin/org" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors group">
            <HiUsers className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Kelola Organisasi</span>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{titleMap[resource]}</h1>
          <p className="text-gray-600 mt-1">Kelola dan atur {titleMap[resource].toLowerCase()}</p>
        </div>
      </div>

      {/* Form Section - Full Width */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            {editingItem ? 'Edit Data' : 'Tambah Data Baru'}
          </h3>
          {editingItem && (
            <button 
              type="button" 
              className="btn bg-gray-50 text-gray-600 hover:bg-gray-100" 
              onClick={cancelEdit}
            >
              Batalkan Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {resource==='posts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul Berita</label>
                  <input 
                    className="input w-full" 
                    placeholder="Masukkan judul berita" 
                    {...register('title', { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt/Ringkasan</label>
                  <textarea 
                    className="input w-full min-h-24" 
                    placeholder="Ringkasan singkat berita" 
                    {...register('excerpt', { required: true })}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                  <Controller
                    name="coverUrl"
                    control={control}
                    render={({ field }) => (
                      <ImageInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="URL gambar cover"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konten Berita</label>
                  <textarea 
                    className="input w-full min-h-48" 
                    placeholder="Tulis konten berita lengkap di sini..." 
                    {...register('content', { required: true })}
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          
          {resource==='activities' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul Kegiatan</label>
                  <input 
                    className="input w-full" 
                    placeholder="Nama kegiatan" 
                    {...register('title', { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kegiatan</label>
                  <input 
                    className="input w-full" 
                    type="date" 
                    {...register('date', { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Kegiatan</label>
                  <Controller
                    name="imageUrl"
                    control={control}
                    render={({ field }) => (
                      <ImageInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="URL gambar kegiatan"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Kegiatan</label>
                  <textarea 
                    className="input w-full min-h-32" 
                    placeholder="Deskripsi detail kegiatan..." 
                    {...register('description', { required: true })}
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          
          {resource==='organization' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input 
                  className="input w-full" 
                  placeholder="Nama lengkap" 
                  {...register('name', { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan/Posisi</label>
                <input 
                  className="input w-full" 
                  placeholder="Jabatan atau posisi" 
                  {...register('position', { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
                <Controller
                  name="photoUrl"
                  control={control}
                  render={({ field }) => (
                    <ImageInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="URL foto profil"
                    />
                  )}
                />
              </div>
            </div>
          )}
          
          {resource==='gallery' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Judul/Deskripsi Foto</label>
                <input 
                  className="input w-full" 
                  placeholder="Judul atau deskripsi foto" 
                  {...register('title', { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Gambar</label>
                <Controller
                  name="imageUrl"
                  control={control}
                  render={({ field }) => (
                    <ImageInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="URL gambar"
                    />
                  )}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {editingItem && (
              <button type="button" className="btn bg-gray-50 text-gray-600 hover:bg-gray-100" onClick={cancelEdit}>
                Batal
              </button>
            )}
            <button className="btn btn-primary px-8">
              {editingItem ? 'Update Data' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Data List Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Daftar Data {titleMap[resource]} ({items.length})
            </h3>
            <div className="text-sm text-gray-500">
              {items.length > 0 ? `Menampilkan ${items.length} data` : 'Belum ada data'}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <HiDocumentText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-gray-900 mb-2">Belum ada data</h4>
              <p className="text-gray-500 mb-6">Tambahkan data pertama menggunakan form di atas.</p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <HiLightBulb className="mr-2 w-4 h-4" />
                Gunakan form di atas untuk menambah data baru
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map(it=>(
                <div key={it.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                  <div className="flex items-start gap-6">
                    <div className="flex-1">
                      {resource==='posts' && (
                        <div className="grid lg:grid-cols-4 gap-4">
                          <div className="lg:col-span-3">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{it.title}</h4>
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{it.excerpt}</p>
                            <div className="text-xs text-gray-500">
                              Konten: {it.content?.substring(0, 100)}...
                            </div>
                          </div>
                          <div className="flex justify-center">
                            {it.coverUrl && (
                              <img 
                                className="w-full max-w-32 h-20 object-cover rounded-lg border" 
                                src={getImageUrl(it.coverUrl)} 
                                alt="Cover"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  console.error('Cover image failed to load:', getImageUrl(it.coverUrl))
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                      {resource==='activities' && (
                        <div className="grid lg:grid-cols-4 gap-4">
                          <div className="lg:col-span-3">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{it.title}</h4>
                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">{it.description}</p>
                            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              <HiCalendar className="w-3 h-3 mr-1" />
                              {new Date(it.date).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            {it.imageUrl && (
                              <img 
                                className="w-full max-w-32 h-20 object-cover rounded-lg border" 
                                src={getImageUrl(it.imageUrl)} 
                                alt="Activity"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  console.error('Activity image failed to load:', getImageUrl(it.imageUrl))
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                      {resource==='organization' && (
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {it.photoUrl && (
                              <img 
                                className="w-16 h-16 object-cover rounded-full border-2 border-gray-200" 
                                src={getImageUrl(it.photoUrl)} 
                                alt="Photo"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  console.error('Photo failed to load:', getImageUrl(it.photoUrl))
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">{it.name}</h4>
                            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              {it.position}
                            </div>
                          </div>
                        </div>
                      )}
                      {resource==='gallery' && (
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <img 
                              className="w-20 h-16 object-cover rounded-lg border" 
                              src={getImageUrl(it.imageUrl)} 
                              alt="Gallery"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                console.error('Gallery image failed to load:', getImageUrl(it.imageUrl))
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{it.title}</h4>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        className="btn btn-sm bg-blue-50 text-blue-600 hover:bg-blue-100 min-w-20 flex items-center justify-center" 
                        onClick={()=>startEdit(it)}
                      >
                        <HiPencilAlt className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100 min-w-20 flex items-center justify-center" 
                        onClick={()=>del(it.id)}
                      >
                        <HiTrash className="w-4 h-4 mr-1" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Admin(){
  const {token,setToken,logout} = useAuth()
  return token ? <LayoutAdmin logout={logout}/> : <Login setToken={setToken}/>
}