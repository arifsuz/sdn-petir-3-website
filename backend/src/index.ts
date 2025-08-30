import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.js'
import postsRoutes from './routes/posts.js'
import activitiesRoutes from './routes/activities.js'
import galleryRoutes from './routes/gallery.js'
import organizationRoutes from './routes/organization.js'

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors())
app.use(express.json({limit:'2mb'}))
app.use(morgan('dev'))

app.get('/api/health', (_req,res)=> res.json({ ok:true }))

app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/activities', activitiesRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/organization', organizationRoutes)

app.listen(PORT, ()=> console.log(`API listening on http://localhost:${PORT}`))
