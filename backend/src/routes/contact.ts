import { Router } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Validasi input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Semua field harus diisi' })
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format email tidak valid' })
    }

    console.log('Processing contact form submission from:', email)

    // Konfigurasi transporter email untuk production
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // Verify transporter connection
    try {
      await transporter.verify()
      console.log('SMTP connection verified successfully')
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError)
      throw new Error('Email service tidak tersedia saat ini')
    }

    // Email content untuk admin
    const mailOptions = {
      from: `"Website SDN Petir 3" <${process.env.EMAIL_USER}>`,
      replyTo: `"${name}" <${email}>`,
      to: 'muh8920104@gmail.com',
      subject: `[SDN Petir 3] Pesan Baru: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pesan Baru dari Website SDN Petir 3</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">SDN Petir 3</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Pesan Baru dari Website</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #2563eb; margin-top: 0; font-size: 20px;">Detail Pesan</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <p style="margin: 0 0 10px 0;"><strong style="color: #374151;">Nama:</strong> ${name}</p>
              <p style="margin: 0 0 10px 0;"><strong style="color: #374151;">Email:</strong> 
                <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
              </p>
              <p style="margin: 0 0 10px 0;"><strong style="color: #374151;">Subject:</strong> ${subject}</p>
              <p style="margin: 0;"><strong style="color: #374151;">Waktu:</strong> ${new Date().toLocaleString('id-ID', { 
                timeZone: 'Asia/Jakarta',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h3 style="color: #374151; margin-top: 0; font-size: 16px;">Isi Pesan:</h3>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.8;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>💡 Tips:</strong> Anda dapat membalas pesan ini langsung dengan menekan tombol reply. 
                Email akan terkirim langsung ke pengirim (${email}).
              </p>
            </div>
          </div>
          
          <div style="background-color: #374151; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              Pesan ini dikirim otomatis dari website SDN Petir 3<br>
              <a href="http://localhost:5173" style="color: #60a5fa; text-decoration: none;">Kunjungi Website</a>
            </p>
          </div>
        </body>
        </html>
      `,
      // Fallback text version
      text: `
PESAN BARU DARI WEBSITE SDN PETIR 3

Nama: ${name}
Email: ${email}
Subject: ${subject}
Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

Pesan:
${message}

---
Pesan ini dikirim otomatis dari website SDN Petir 3
      `
    }

    // Kirim email
    const result = await transporter.sendMail(mailOptions)
    console.log('Email berhasil dikirim:', {
      messageId: result.messageId,
      to: 'muh8920104@gmail.com',
      from: email,
      subject: subject
    })
    
    // Response sukses
    res.json({ 
      message: 'Pesan Anda berhasil dikirim! Kami akan segera membalasnya.',
      messageId: result.messageId
    })

  } catch (error: any) {
    console.error('Email error:', error)
    
    // Handle specific errors
    if (error.code === 'EAUTH') {
      res.status(500).json({ 
        error: 'Konfigurasi email bermasalah. Silakan hubungi administrator.',
        code: 'EMAIL_AUTH_ERROR'
      })
    } else if (error.code === 'ECONNECTION') {
      res.status(500).json({ 
        error: 'Tidak dapat terhubung ke server email. Coba lagi nanti.',
        code: 'EMAIL_CONNECTION_ERROR'
      })
    } else {
      res.status(500).json({ 
        error: 'Gagal mengirim pesan. Silakan coba lagi atau hubungi kami langsung.',
        details: error.message
      })
    }
  }
})

export default router