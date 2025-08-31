import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Home from './Home'
import About from './About'
import Blog from './Blog'
import PostDetail from './PostDetail'
import Kegiatan from './Kegiatan'
import Galery from './Galery'
import Admin from './Admin'

// Layout untuk halaman publik dengan navbar dan footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}

// Layout untuk admin tanpa navbar dan footer
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes dengan Navbar & Footer */}
      <Route path="/" element={
        <PublicLayout>
          <Home />
        </PublicLayout>
      } />
      <Route path="/about" element={
        <PublicLayout>
          <About />
        </PublicLayout>
      } />
      <Route path="/blog" element={
        <PublicLayout>
          <Blog />
        </PublicLayout>
      } />
      <Route path="/post/:id" element={
        <PublicLayout>
          <PostDetail />
        </PublicLayout>
      } />
      <Route path="/kegiatan" element={
        <PublicLayout>
          <Kegiatan />
        </PublicLayout>
      } />
      <Route path="/galery" element={
        <PublicLayout>
          <Galery />
        </PublicLayout>
      } />
      
      {/* Admin Routes tanpa Navbar & Footer */}
      <Route path="/admin/*" element={
        <AdminLayout>
          <Admin />
        </AdminLayout>
      } />
    </Routes>
  )
}