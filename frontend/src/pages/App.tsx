import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function App(){
  return (
    <div>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
