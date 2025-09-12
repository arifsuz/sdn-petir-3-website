
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { School, Newspaper, CalendarDays, Users, Image as ImageIcon, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
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
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} className={({isActive}) => 
              'navlink flex items-center gap-1 ' + (isActive ? 'text-blue-700' : '')}>
              {n.icon}{n.label}
            </NavLink>
          ))}
        </nav>
        {/* Hamburger button for mobile */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>
      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col gap-4 animate-slide-in"
            onClick={e => e.stopPropagation()}
          >
            <button className="self-end mb-4" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={28}/>
            </button>
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({isActive}) =>
                  'navlink flex items-center gap-2 py-2 px-3 rounded ' + (isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100')
                }
                onClick={() => setOpen(false)}
              >
                {n.icon}{n.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
