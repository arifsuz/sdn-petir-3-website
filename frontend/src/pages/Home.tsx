import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import dayjs from 'dayjs'
import BannerCarousel from '../components/BannerCarousel'
import ContactForm from '../components/ContactForm'

type Post = { id: number; title: string; excerpt: string; coverUrl?: string; createdAt: string }
type Activity = { id: number; title: string; date: string; description: string; imageUrl?: string }
type Member = { id: number; name: string; position: string; photoUrl?: string }

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [headmaster, setHeadmaster] = useState<Member | null>(null)
  const [teachers, setTeachers] = useState<Member[]>([])
  const [showScrollTop, setShowScrollTop] = useState(false)

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
        setTeachers(members.filter((m: Member) => m.id !== headmasterData?.id).slice(0, 6))
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

      {/* Visi Misi & Stats */}
      <section className="container section">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Visi & Misi</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">Visi</h3>
                <p className="text-gray-700">
                  Menjadi sekolah dasar yang unggul dalam prestasi, berkarakter mulia, dan berwawasan lingkungan.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">Misi</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Menyelenggarakan pendidikan yang berkualitas dan berkarakter</li>
                  <li>• Mengembangkan potensi akademik dan non-akademik siswa</li>
                  <li>• Menciptakan lingkungan sekolah yang aman dan nyaman</li>
                  <li>• Membangun kemitraan dengan orang tua dan masyarakat</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Siswa Aktif', value: '450+', icon: '👨‍🎓' },
              { label: 'Tenaga Pendidik', value: '25+', icon: '👩‍🏫' },
              { label: 'Ruang Kelas', value: '18', icon: '🏫' },
              { label: 'Tahun Berdiri', value: '1985', icon: '📅' }
            ].map((stat, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
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
          <Link to="/blog" className="btn btn-primary">Lihat Semua</Link>
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
                <div className="text-xs text-gray-500">{dayjs(post.createdAt).format('DD MMM YYYY')}</div>
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
            <Link to="/kegiatan" className="btn btn-primary">Lihat Semua</Link>
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
                  <div className="text-xs text-gray-500">{dayjs(activity.date).format('DD MMM YYYY')}</div>
                  <h3 className="text-lg font-semibold mt-1 mb-2">{activity.title}</h3>
                  <p className="text-gray-600 text-sm">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="container section">
        <h2 className="text-3xl font-bold text-center mb-12">Tim Pendidik</h2>
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
                    <span className="text-blue-600">📍</span>
                    <div>
                      <div className="font-semibold">Alamat</div>
                      <div className="text-gray-600">Jl. KH. Ahmad Dahlan No.59, Petir, Kec. Cipondoh, Kota Tangerang, Banten 15147</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600">📞</span>
                    <div>
                      <div className="font-semibold">Telepon</div>
                      <div className="text-gray-600">(021) 5555-1234</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600">✉️</span>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-gray-600">info@sdnpetir3.sch.id</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600">⏰</span>
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
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      )}
    </div>
  )
}