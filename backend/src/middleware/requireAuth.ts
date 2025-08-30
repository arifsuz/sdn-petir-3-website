import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export default function requireAuth(req:Request,res:Response,next:NextFunction){
  const auth = req.headers.authorization
  if(!auth) return res.status(401).json({error:'unauthorized'})
  const token = auth.replace('Bearer ','')
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    ;(req as any).user = decoded
    next()
  }catch(e){
    return res.status(401).json({error:'invalid token'})
  }
}
