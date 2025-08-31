import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.js'
import postsRoutes from './routes/posts.js'
import activitiesRoutes from './routes/activities.js'
import galleryRoutes from './routes/gallery.js'
import organizationRoutes from './routes/organization.js'
import uploadRoutes from './routes/upload.js'
import contactRoutes from './routes/contact.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 4000

// Update helmet dengan konfigurasi yang lebih permisif untuk development
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      imgSrc: ["'self'", "data:", "http:", "https:"],
    },
  },
}))

// Update CORS dengan konfigurasi yang lebih spesifik
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(express.json({limit:'2mb'}))
app.use(morgan('dev'))

// Serve static files dengan header yang tepat
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
}, express.static(path.join(__dirname, '../uploads')))

app.get('/api/health', (_req,res)=> res.json({ ok:true }))

app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/activities', activitiesRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/organization', organizationRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/contact', contactRoutes)

app.listen(PORT, ()=> console.log(`API listening on http://localhost:${PORT}`))
