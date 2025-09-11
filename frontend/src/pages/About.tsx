import { useEffect, useState } from 'react'
import api from '../lib/api'
import { HiUserGroup, HiAcademicCap, HiLocationMarker, HiPhone, HiMail, HiClock } from 'react-icons/hi'

type Member = { id:number; name:string; position:string; photoUrl?:string }

export default function About(){
  const [members,setMembers]=useState<Member[]>([])
  
  useEffect(()=>{ (async()=>{
    const {data}=await api.get('/organization')
    setMembers(data.items)
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

  // Function untuk mengurutkan member berdasarkan hierarki jabatan yang baru
  const getOrderedMembers = () => {
    const hierarchy = [
      'Kepala Sekolah',
      'Staff',
      'Operator',
      'Guru',
      'Tenaga Sekolah'
    ]

    return members.sort((a, b) => {
      const aIndex = hierarchy.findIndex(pos => a.position.toLowerCase().includes(pos.toLowerCase()))
      const bIndex = hierarchy.findIndex(pos => b.position.toLowerCase().includes(pos.toLowerCase()))
      
      if (aIndex === -1 && bIndex === -1) return 0
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      
      return aIndex - bIndex
    })
  }

  // Function untuk mendapatkan warna berdasarkan jabatan yang baru
  const getPositionColor = (position: string) => {
    const pos = position.toLowerCase()
    if (pos.includes('kepala sekolah')) return 'bg-red-100 text-red-800 border-red-200'
    if (pos.includes('staff')) return 'bg-orange-100 text-orange-800 border-orange-200'
    if (pos.includes('operator')) return 'bg-purple-100 text-purple-800 border-purple-200'
    if (pos.includes('guru')) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (pos.includes('tenaga sekolah')) return 'bg-green-100 text-green-800 border-green-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Function untuk render diagram hierarki sesuai struktur baru
  const renderHierarchy = () => {
    const orderedMembers = getOrderedMembers()
    const kepalaSekolah = orderedMembers.filter(m => m.position.toLowerCase().includes('kepala sekolah'))
    const staff = orderedMembers.filter(m => m.position.toLowerCase().includes('staff') && !m.position.toLowerCase().includes('kepala'))
    const operator = orderedMembers.filter(m => m.position.toLowerCase().includes('operator'))
    const guru = orderedMembers.filter(m => m.position.toLowerCase().includes('guru') && !m.position.toLowerCase().includes('kepala'))
    const tenagaSekolah = orderedMembers.filter(m => 
      m.position.toLowerCase().includes('tenaga sekolah') || 
      m.position.toLowerCase().includes('administrasi') ||
      m.position.toLowerCase().includes('administratif') ||
      m.position.toLowerCase().includes('pustakawan') ||
      m.position.toLowerCase().includes('penjaga') ||
      m.position.toLowerCase().includes('cleaning service') ||
      m.position.toLowerCase().includes('security')
    )

    return (
      <div className="space-y-8">
        {/* Kepala Sekolah */}
        {kepalaSekolah.length > 0 && (
          <div className="text-center">
            <div className="inline-block">
              {kepalaSekolah.map(member => (
                <div key={member.id} className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-500">
                  <img 
                    src={member.photoUrl ? getImageUrl(member.photoUrl) : `https://picsum.photos/seed/teacher${member.id}/150/150`} 
                    className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-red-200" 
                    alt={member.name}
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/teacher${member.id}/150/150`
                    }}
                  />
                  <h3 className="font-bold text-lg mt-3">{member.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getPositionColor(member.position)}`}>
                    {member.position}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Garis Vertikal */}
        {kepalaSekolah.length > 0 && (staff.length > 0 || operator.length > 0 || guru.length > 0 || tenagaSekolah.length > 0) && (
          <div className="flex justify-center">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>
        )}

        {/* Staff */}
        {staff.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-center mb-4 text-orange-700">Staff</h3>
            <div className="flex justify-center">
              <div className={`grid gap-4 ${
                staff.length === 1 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {staff.map(member => (
                  <div key={member.id} className="bg-white rounded-lg shadow-sm p-3 border-t-4 border-orange-400 hover:shadow-md transition-shadow">
                    <img 
                      src={member.photoUrl ? getImageUrl(member.photoUrl) : `https://picsum.photos/seed/teacher${member.id}/100/100`} 
                      className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-orange-200" 
                      alt={member.name}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/teacher${member.id}/100/100`
                      }}
                    />
                    <h5 className="font-medium text-center mt-2 text-sm">{member.name}</h5>
                    <span className={`block text-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getPositionColor(member.position)}`}>
                      {member.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Operator */}
        {operator.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-center mb-4 text-purple-700">Operator</h3>
            <div className="flex justify-center">
              <div className={`grid gap-4 ${
                operator.length === 1 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {operator.map(member => (
                  <div key={member.id} className="bg-white rounded-lg shadow-sm p-3 border-t-4 border-purple-400 hover:shadow-md transition-shadow">
                    <img 
                      src={member.photoUrl ? getImageUrl(member.photoUrl) : `https://picsum.photos/seed/teacher${member.id}/100/100`} 
                      className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-purple-200" 
                      alt={member.name}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/teacher${member.id}/100/100`
                      }}
                    />
                    <h5 className="font-medium text-center mt-2 text-sm">{member.name}</h5>
                    <span className={`block text-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getPositionColor(member.position)}`}>
                      {member.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Guru */}
        {guru.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-center mb-4 text-blue-700">Guru</h3>
            <div className="flex justify-center">
              <div className={`grid gap-4 ${
                guru.length === 1 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {guru.map(member => (
                  <div key={member.id} className="bg-white rounded-lg shadow-sm p-3 border-t-4 border-blue-400 hover:shadow-md transition-shadow">
                    <img 
                      src={member.photoUrl ? getImageUrl(member.photoUrl) : `https://picsum.photos/seed/teacher${member.id}/100/100`} 
                      className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-blue-200" 
                      alt={member.name}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/teacher${member.id}/100/100`
                      }}
                    />
                    <h5 className="font-medium text-center mt-2 text-sm">{member.name}</h5>
                    <span className={`block text-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getPositionColor(member.position)}`}>
                      {member.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tenaga Sekolah */}
        {tenagaSekolah.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-center mb-4 text-green-700">Tenaga Sekolah</h3>
            <div className="flex justify-center">
              <div className={`grid gap-4 ${
                tenagaSekolah.length === 1 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {tenagaSekolah.map(member => (
                  <div key={member.id} className="bg-white rounded-lg shadow-sm p-3 border-t-4 border-green-400 hover:shadow-md transition-shadow">
                    <img 
                      src={member.photoUrl ? getImageUrl(member.photoUrl) : `https://picsum.photos/seed/teacher${member.id}/100/100`} 
                      className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-green-200" 
                      alt={member.name}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/teacher${member.id}/100/100`
                      }}
                    />
                    <h5 className="font-medium text-center mt-2 text-sm">{member.name}</h5>
                    <span className={`block text-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getPositionColor(member.position)}`}>
                      {member.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <HiAcademicCap className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">SDN Petir 3</h1>
            <p className="text-xl opacity-90 mb-6">
              Membangun Generasi Cerdas, Berkarakter, dan Berprestasi
            </p>
            <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-6 py-2">
              <HiLocationMarker className="w-5 h-5 mr-2" />
              <span>Tangerang, Banten</span>
            </div>
          </div>
        </section>

        {/* Profil Sekolah */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <HiAcademicCap className="w-8 h-8 text-blue-600 mr-3" />
              Profil Sekolah
            </h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                SDN Petir 3 adalah Sekolah Dasar Negeri yang berlokasi strategis di Jl. KH. Ahmad Dahlan No.59, 
                Petir, Kec. Cipondoh, Kota Tangerang, Banten 15147.
              </p>
              <p className="leading-relaxed">
                Kami berkomitmen memberikan pendidikan berkualitas tinggi dengan pendekatan holistik yang 
                mengembangkan aspek akademik, karakter, dan kreativitas siswa.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informasi Kontak</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <HiLocationMarker className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Alamat</p>
                  <p className="text-gray-600">Jl. KH. Ahmad Dahlan No.59, Petir<br />Kec. Cipondoh, Kota Tangerang<br />Banten 15147</p>
                </div>
              </div>
              <div className="flex items-center">
                <HiPhone className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Telepon</p>
                  <p className="text-gray-600">(021) 5555-5555</p>
                </div>
              </div>
              <div className="flex items-center">
                <HiMail className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Email</p>
                  <p className="text-gray-600">info@sdnpetir3.sch.id</p>
                </div>
              </div>
              <div className="flex items-start">
                <HiClock className="w-6 h-6 text-blue-600 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Jam Operasional</p>
                  <p className="text-gray-600">Senin - Jumat: 07.00 - 15.00 WIB<br />Sabtu: 07.00 - 12.00 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visi Misi */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Visi</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              "Menjadi sekolah dasar yang unggul dalam prestasi, berkarakter mulia, dan berwawasan lingkungan."
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Misi</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Menyelenggarakan pendidikan yang berkualitas dan berkarakter
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Mengembangkan potensi akademik dan non-akademik siswa
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Menciptakan lingkungan sekolah yang aman dan nyaman
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Membangun kemitraan dengan orang tua dan masyarakat
              </li>
            </ul>
          </div>
        </section>

        {/* Struktur Organisasi */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HiUserGroup className="w-10 h-10 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-800">Struktur Organisasi</h2>
            </div>
            <p className="text-gray-600">Struktur kepemimpinan dan tim pengajar SDN Petir 3</p>
          </div>
          
          {members.length > 0 ? (
            renderHierarchy()
          ) : (
            <div className="text-center py-12">
              <HiUserGroup className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Data struktur organisasi sedang dimuat...</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}