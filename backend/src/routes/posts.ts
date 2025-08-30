import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import requireAuth from '../middleware/requireAuth.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/', async (req,res)=>{
  const items = await prisma.post.findMany({ orderBy: { id: 'desc' } })
  res.json({ items })
})

router.post('/', requireAuth, async (req,res)=>{
  const data = req.body
  const item = await prisma.post.create({ data })
  res.json({ item })
})

router.put('/:id', requireAuth, async (req,res)=>{
  const id = Number(req.params.id)
  const data = req.body
  const item = await prisma.post.update({
    where: { id },
    data
  })
  res.json({ item })
})

router.delete('/:id', requireAuth, async (req,res)=>{
  const id = Number(req.params.id)
  await prisma.post.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
