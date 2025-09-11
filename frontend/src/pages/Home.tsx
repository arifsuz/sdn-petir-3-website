import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import dayjs from 'dayjs'
import BannerCarousel from '../components/BannerCarousel'
import ContactForm from '../components/ContactForm'
// Import React Icons
import { 
  HiAcademicCap,
  HiUserGroup, 
  HiOfficeBuilding,
  HiCalendar,
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiClock,
  HiArrowUp,
  HiArrowRight,
  HiPlay,
  HiPause,
  HiVolumeUp,
  HiVolumeOff
} from 'react-icons/hi'

type Post = { id: number; title: string; excerpt: string; coverUrl?: string; createdAt: string }
type Activity = { id: number; title: string; date: string; description: string; imageUrl?: string }
type Member = { id: number; name: string; position: string; photoUrl?: string }

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [headmaster, setHeadmaster] = useState<Member | null>(null)
  const [teachers, setTeachers] = useState<Member[]>([])
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Video states
  const [selectedVideo, setSelectedVideo] = useState<'profil' | 'pengenalan'>('profil')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)

  // Video data
  const videos = {
    profil: {
      src: '/SEKOLAH/Profil Sekolah.mp4',
      title: 'Profil Sekolah',
      description: 'Video pengenalan mengenai profil lengkap SDN Petir 3'
    },
    pengenalan: {
      src: '/SEKOLAH/Pekenalan Guru dan SPMB 2025.mp4',
      title: 'Pengenalan Guru dan SPMB 2025',
      description: 'Video pengenalan guru-guru dan informasi SPMB 2025'
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const [postsRes, activitiesRes, orgRes] = await Promise.all([
          api.get('/posts'),
          api.get('/activities'),
          api.get('/organization')
        ])
        
        setPosts(postsRes.data.items.slice(0, 3))
        setActivities(activitiesRes.data.items.slice(0, 3))
        
        const members = orgRes.data.items
        const headmasterData = members.find((m: Member) => 
          m.position.toLowerCase().includes('kepala sekolah') ||
          m.position.toLowerCase().includes('principal')
        )
        
        setHeadmaster(headmasterData)
        
        // Filter untuk Tenaga Pengajar: Guru Kelas, Guru Agama Islam, dan Guru PJOK
        const teachingStaff = members.filter((m: Member) => {
          const position = m.position.toLowerCase()
          return (
            position.includes('guru kelas') ||
            position.includes('guru agama islam') ||
            position.includes('guru pjok')
          ) && m.id !== headmasterData?.id
        })
        
        setTeachers(teachingStaff.slice(0, 6))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    })()
  }, [])

  // Scroll to top button logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Show scroll to top button when near bottom (within 20% of bottom)
      const nearBottom = scrollTop + windowHeight >= documentHeight * 0.8
      setShowScrollTop(nearBottom)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Video control functions
  const togglePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause()
      } else {
        videoRef.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVideoSelect = (videoType: 'profil' | 'pengenalan') => {
    if (videoRef && isPlaying) {
      videoRef.pause()
      setIsPlaying(false)
    }
    setSelectedVideo(videoType)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

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
    <div className="space-y-16 relative">
      {/* Banner Carousel */}
      <section className="container">
        <BannerCarousel />
      </section>

      {/* Video Section */}
      <section className="container section">
        <h2 className="text-3xl font-bold text-center mb-12">Video Sekolah</h2>
        <div className="max-w-4xl mx-auto">
          <div className="card overflow-hidden">
            {/* Video Selection Buttons */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => handleVideoSelect('profil')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedVideo === 'profil'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  Profil Sekolah
                </button>
                <button
                  onClick={() => handleVideoSelect('pengenalan')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedVideo === 'pengenalan'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  Pengenalan Guru & SPMB 2025
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative">
              <video
                ref={setVideoRef}
                src={videos[selectedVideo].src}
                className="w-full h-64 md:h-96 object-cover bg-black"
                poster="Foto-Sekolah.jpeg"
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={(e) => {
                  console.error('Video failed to load:', videos[selectedVideo].src)
                }}
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlayPause}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    {isPlaying ? (
                      <HiPause className="w-8 h-8" />
                    ) : (
                      <HiPlay className="w-8 h-8 ml-1" />
                    )}
                  </button>
                  
                  <button
                    onClick={toggleMute}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    {isMuted ? (
                      <HiVolumeOff className="w-6 h-6" />
                    ) : (
                      <HiVolumeUp className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{videos[selectedVideo].title}</h3>
              <p className="text-gray-600">{videos[selectedVideo].description}</p>
              
              {/* Video Status */}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span className={`flex items-center gap-1 ${isPlaying ? 'text-green-600' : 'text-gray-500'}`}>
                  {isPlaying ? <HiPlay className="w-4 h-4" /> : <HiPause className="w-4 h-4" />}
                  {isPlaying ? 'Sedang Diputar' : 'Dijeda'}
                </span>
                <span className={`flex items-center gap-1 ${isMuted ? 'text-red-600' : 'text-blue-600'}`}>
                  {isMuted ? <HiVolumeOff className="w-4 h-4" /> : <HiVolumeUp className="w-4 h-4" />}
                  {isMuted ? 'Dibisu' : 'Audio Aktif'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi & Stats */}
      <section className="container section">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Visi Misi Cards */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-8 text-center lg:text-left">Visi & Misi</h2>
            
            {/* Visi Card */}
            <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 text-white p-3 rounded-full flex-shrink-0">
                  <HiAcademicCap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-blue-700">Visi</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Menjadi sekolah dasar yang unggul dalam prestasi, berkarakter mulia, dan berwawasan lingkungan.
                  </p>
                </div>
              </div>
            </div>

            {/* Misi Card */}
            <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 text-white p-3 rounded-full flex-shrink-0">
                  <HiUserGroup className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-green-700">Misi</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold text-lg flex-shrink-0">•</span>
                      <span>Menyelenggarakan pendidikan yang berkualitas dan berkarakter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold text-lg flex-shrink-0">•</span>
                      <span>Mengembangkan potensi akademik dan non-akademik siswa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold text-lg flex-shrink-0">•</span>
                      <span>Menciptakan lingkungan sekolah yang aman dan nyaman</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold text-lg flex-shrink-0">•</span>
                      <span>Membangun kemitraan dengan orang tua dan masyarakat</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="lg:mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center lg:text-left">Statistik Sekolah</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Siswa Aktif', value: '450+', icon: HiAcademicCap, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', gradientFrom: 'from-blue-50', gradientTo: 'to-blue-100' },
                { label: 'Tenaga Pendidik', value: '25+', icon: HiUserGroup, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', gradientFrom: 'from-green-50', gradientTo: 'to-green-100' },
                { label: 'Ruang Kelas', value: '18', icon: HiOfficeBuilding, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', gradientFrom: 'from-purple-50', gradientTo: 'to-purple-100' },
                { label: 'Tahun Berdiri', value: '1985', icon: HiCalendar, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', gradientFrom: 'from-orange-50', gradientTo: 'to-orange-100' }
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className={`card p-6 text-center bg-gradient-to-br ${stat.gradientFrom} ${stat.gradientTo} ${stat.borderColor} border-2 hover:scale-105 transform transition-all duration-300 hover:shadow-lg group`}>
                    <div className={`${stat.color} bg-white p-3 rounded-full w-fit mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className={`text-2xl lg:text-3xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs lg:text-sm font-medium text-gray-700">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Kepala Sekolah */}
      {headmaster && (
        <section className="bg-gray-50 py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Kepala Sekolah</h2>
            <div className="max-w-4xl mx-auto">
              <div className="card p-8">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="text-center">
                    <img
                      src={headmaster.photoUrl ? getImageUrl(headmaster.photoUrl) : `https://picsum.photos/seed/headmaster/300/300`}
                      alt={headmaster.name}
                      className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-blue-100"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/headmaster/300/300`
                      }}
                    />
                    <h3 className="text-xl font-bold mt-4">{headmaster.name}</h3>
                    <p className="text-blue-600">{headmaster.position}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold mb-4">Kata Sambutan</h4>
                    <div className="space-y-4 text-gray-700">
                      <p>
                        Selamat datang di SDN Petir 3. Kami berkomitmen untuk memberikan pendidikan terbaik 
                        bagi putra-putri Anda dengan mengembangkan potensi akademik dan karakter yang mulia.
                      </p>
                      <p>
                        Dengan dukungan tenaga pendidik yang profesional dan fasilitas yang memadai, 
                        kami yakin dapat mencetak generasi penerus bangsa yang cerdas, berkarakter, 
                        dan siap menghadapi tantangan masa depan.
                      </p>
                      <p className="italic">
                        "Pendidikan adalah investasi terbaik untuk masa depan anak-anak kita."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Berita Terbaru */}
      <section className="container section">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Berita Terbaru</h2>
          <Link to="/blog" className="btn btn-primary flex items-center">
            Lihat Semua <HiArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(post => (
            <article key={post.id} className="card overflow-hidden">
              <img
                src={post.coverUrl ? getImageUrl(post.coverUrl) : `https://picsum.photos/seed/post${post.id}/600/400`}
                alt={post.title}
                className="w-full h-44 object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/post${post.id}/600/400`
                }}
              />
              <div className="p-5">
                <div className="text-xs text-gray-500 flex items-center">
                  <HiCalendar className="w-3 h-3 mr-1" />
                  {dayjs(post.createdAt).format('DD MMM YYYY')}
                </div>
                <h3 className="text-lg font-semibold mt-1 mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                <Link to={`/post/${post.id}`} className="btn btn-primary btn-sm">
                  Baca Selengkapnya
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Kegiatan Terbaru */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Kegiatan Terbaru</h2>
            <Link to="/kegiatan" className="btn btn-primary flex items-center">
              Lihat Semua <HiArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {activities.map(activity => (
              <div key={activity.id} className="card overflow-hidden">
                <img
                  src={activity.imageUrl ? getImageUrl(activity.imageUrl) : `https://picsum.photos/seed/act${activity.id}/600/400`}
                  alt={activity.title}
                  className="w-full h-44 object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/act${activity.id}/600/400`
                  }}
                />
                <div className="p-5">
                  <div className="text-xs text-gray-500 flex items-center">
                    <HiCalendar className="w-3 h-3 mr-1" />
                    {dayjs(activity.date).format('DD MMM YYYY')}
                  </div>
                  <h3 className="text-lg font-semibold mt-1 mb-2">{activity.title}</h3>
                  <p className="text-gray-600 text-sm">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tenaga Pengajar */}
      <section className="container section">
        <h2 className="text-3xl font-bold text-center mb-12">Tenaga Pengajar</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {teachers.map(teacher => (
            <div key={teacher.id} className="text-center">
              <img
                src={teacher.photoUrl ? getImageUrl(teacher.photoUrl) : `https://picsum.photos/seed/teacher${teacher.id}/200/200`}
                alt={teacher.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gray-200"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/teacher${teacher.id}/200/200`
                }}
              />
              <h4 className="font-semibold mt-2 text-sm">{teacher.name}</h4>
              <p className="text-xs text-gray-500">{teacher.position}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link to="/about" className="btn btn-primary">Lihat Struktur Lengkap</Link>
        </div>
      </section>

      {/* Kontak */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Hubungi Kami</h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Informasi Kontak</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <HiLocationMarker className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold">Alamat</div>
                      <div className="text-gray-600">Jl. KH. Ahmad Dahlan No.59, Petir, Kec. Cipondoh, Kota Tangerang, Banten 15147</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <HiPhone className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold">Telepon</div>
                      <div className="text-gray-600">0878-0864-2015</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <HiMail className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-gray-600">info@sdnpetir3.sch.id</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <HiClock className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold">Jam Operasional</div>
                      <div className="text-gray-600">Senin - Jumat: 07:00 - 15:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-bounce"
          aria-label="Scroll to top"
        >
          <HiArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}