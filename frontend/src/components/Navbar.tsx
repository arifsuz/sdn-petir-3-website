import { Link, NavLink } from 'react-router-dom'
import { School, Newspaper, CalendarDays, Users, Image as ImageIcon } from 'lucide-react'

export default function Navbar() {
  const nav = [
    { to: '/', label: 'Home', icon: <School size={16}/> },
    { to: '/blog', label: 'Blog', icon: <Newspaper size={16}/> },
    { to: '/kegiatan', label: 'Kegiatan', icon: <CalendarDays size={16}/> },
    { to: '/about', label: 'About Us', icon: <Users size={16}/> },
    { to: '/galery', label: 'Galery', icon: <ImageIcon size={16}/> },
  ]
  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
            <img src="/Logo-Sekolah.png" alt="Logo Sekolah" className="w-10 h-10 rounded-xl object-cover" />
          <div className="leading-tight">
            <div className="font-semibold">SDN Petir 3</div>
            <div className="text-xs text-gray-500">Kota Tangerang</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} className={({isActive}) => 
              'navlink flex items-center gap-1 ' + (isActive ? 'text-blue-700' : '')}>
              {n.icon}{n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
