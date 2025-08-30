import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import requireAuth from '../middleware/requireAuth.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/', async (req,res)=>{
  const items = await prisma.galleryImage.findMany({ orderBy: { id: 'desc' } })
  res.json({ items })
})

router.post('/', requireAuth, async (req,res)=>{
  const data = req.body
  const item = await prisma.galleryImage.create({ data })
  res.json(item)
})

router.delete('/:id', requireAuth, async (req,res)=>{
  const id = Number(req.params.id)
  await prisma.galleryImage.delete({ where: { id } })
  res.json({ ok:true })
})

export default router
