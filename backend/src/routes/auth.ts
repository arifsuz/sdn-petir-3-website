import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = Router()

router.post('/login', async (req,res)=>{
  const {username,password} = req.body
  if(!username || !password) return res.status(400).json({error:'username & password required'})
  const user = await prisma.adminUser.findUnique({ where: { username } })
  if(!user) return res.status(401).json({error:'invalid credentials'})
  const ok = await bcrypt.compare(password, user.password)
  if(!ok) return res.status(401).json({error:'invalid credentials'})
  const token = jwt.sign({sub:user.id, username:user.username}, process.env.JWT_SECRET as string, {expiresIn:'1d'})
  res.json({token})
})

export default router
