import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './pages/App'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Kegiatan from './pages/Kegiatan'
import About from './pages/About'
import Galery from './pages/Galery'
import Admin from './pages/Admin'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'blog', element: <Blog /> },
      { path: 'kegiatan', element: <Kegiatan /> },
      { path: 'about', element: <About /> },
      { path: 'galery', element: <Galery /> },
    ]
  },
  { path: '/admin/*', element: <Admin /> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
