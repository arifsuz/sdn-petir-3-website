import { useEffect, useState } from 'react'
import api from '../lib/api'
import { HiPhotograph, HiEye, HiX } from 'react-icons/hi'

type Photo = { id:number; title:string; imageUrl:string }

export default function Galery(){
  const [photos,setPhotos]=useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(()=>{ (async()=>{
    try {
      setIsLoading(true)
      const {data}=await api.get('/gallery')
      setPhotos(data.items)
    } catch (error) {
      console.error('Failed to fetch gallery:', error)
    } finally {
      setIsLoading(false)
    }
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

  // Function untuk membuka modal foto
  const openPhotoModal = (photo: Photo) => {
    setSelectedPhoto(photo)
  }

  // Function untuk menutup modal foto
  const closePhotoModal = () => {
    setSelectedPhoto(null)
  }

  // Handle escape key untuk menutup modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePhotoModal()
      }
    }

    if (selectedPhoto) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedPhoto])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-8 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <HiPhotograph className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Galeri Foto</h1>
            <p className="text-xl opacity-90 mb-6">
              Dokumentasi kegiatan dan momen berharga di SDN Petir 3
            </p>
            <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-6 py-2">
              <HiPhotograph className="w-5 h-5 mr-2" />
              <span>{photos.length} Foto Tersedia</span>
            </div>
          </div>
        </section>

        {/* Gallery Content */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          {isLoading ? (
            <div className="text-center py-12">
              <HiPhotograph className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500">Memuat galeri foto...</p>
            </div>
          ) : photos.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Koleksi Foto Kegiatan</h2>
                <p className="text-gray-600">Klik pada foto untuk melihat dalam ukuran penuh</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map(photo => (
                  <div 
                    key={photo.id} 
                    className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => openPhotoModal(photo)}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={getImageUrl(photo.imageUrl)} 
                        alt={photo.title} 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('Gallery image failed to load:', photo.imageUrl)
                          e.currentTarget.src = `https://picsum.photos/seed/gallery${photo.id}/400/300`
                        }}
                      />
                      
                      {/* Overlay dengan ikon */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <HiEye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                        {photo.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <HiPhotograph className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada foto dalam galeri</p>
            </div>
          )}
        </section>

        {/* Modal untuk foto */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
            onClick={closePhotoModal}
          >
            <div 
              className="relative max-w-4xl max-h-full bg-white rounded-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tombol close */}
              <button
                onClick={closePhotoModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
              >
                <HiX className="w-6 h-6" />
              </button>
              
              {/* Gambar */}
              <img
                src={getImageUrl(selectedPhoto.imageUrl)}
                alt={selectedPhoto.title}
                className="w-full max-h-[80vh] object-contain"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/gallery${selectedPhoto.id}/800/600`
                }}
              />
              
              {/* Caption */}
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold text-gray-800">{selectedPhoto.title}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
