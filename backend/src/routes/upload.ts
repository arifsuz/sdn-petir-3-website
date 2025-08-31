import { Router } from 'express'
import { upload } from '../middleware/upload.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.post('/image', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  
  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ imageUrl })
})

export default router