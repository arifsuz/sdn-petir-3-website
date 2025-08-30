import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import requireAuth from '../middleware/requireAuth.js'

const prisma = new PrismaClient()
const router = Router()

// GET - ambil semua activities
router.get('/', async (req,res)=>{
  const items = await prisma.activity.findMany({ orderBy: { id: 'desc' } })
  res.json({ items })
})

// POST - create activity baru
router.post('/', requireAuth, async (req,res)=>{
  const data = req.body
  
  // Convert date string to DateTime if needed
  if(data.date && typeof data.date === 'string') {
    data.date = new Date(data.date).toISOString();
  }
  
  const item = await prisma.activity.create({ data })
  res.json({ item })
})

// PUT - update activity yang sudah ada
router.put('/:id', requireAuth, async (req,res)=>{
  const id = Number(req.params.id)
  const data = req.body
  
  // Convert date string to DateTime if needed
  if(data.date && typeof data.date === 'string') {
    data.date = new Date(data.date).toISOString();
  }
  
  const item = await prisma.activity.update({
    where: { id },
    data
  })
  res.json({ item })
})

// DELETE - hapus activity
router.delete('/:id', requireAuth, async (req,res)=>{
  const id = Number(req.params.id)
  await prisma.activity.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
