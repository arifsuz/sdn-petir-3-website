import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import requireAuth from '../middleware/requireAuth.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/', async (req,res)=>{
  const items = await prisma.post.findMany({ orderBy: { id: 'desc' } })
  res.json({ items })
})

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    
    // Validasi ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid post ID' })
    }
    
    const post = await prisma.post.findUnique({
      where: { id }
    })
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }
    
    res.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const data = req.body
    
    // Validasi data
    if (!data.title || !data.excerpt || !data.content) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, excerpt, content' 
      })
    }
    
    const item = await prisma.post.create({ data })
    res.json({ item })
  } catch (error) {
    console.error('Error creating post:', error)
    
    if (error.code === 'P2000') {
      return res.status(400).json({ 
        error: 'Content too long for database column' 
      })
    }
    
    res.status(500).json({ error: 'Internal server error' })
  }
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
