import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main(){
  const passwordHash = await bcrypt.hash('admin123', 10)
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: passwordHash }
  })

  await prisma.post.createMany({
    data: [
      { title:'Penerimaan Peserta Didik Baru', excerpt:'Informasi PPDB tahun ajaran baru.', content:'Konten lengkap PPDB...', coverUrl:'' },
      { title:'Kegiatan Literasi', excerpt:'Program literasi sekolah berjalan.', content:'Konten literasi...', coverUrl:'' },
      { title:'Lomba Kebersihan Kelas', excerpt:'Meningkatkan kedisiplinan dan kebersihan.', content:'Konten lomba...', coverUrl:'' },
    ]
  })

  await prisma.activity.createMany({
    data: [
      { title:'Upacara Bendera', description:'Kegiatan rutin setiap hari Senin.', date:new Date().toISOString() },
      { title:'Kunjungan Perpustakaan', description:'Meningkatkan minat baca siswa.', date:new Date().toISOString() },
    ]
  })

  await prisma.galleryImage.createMany({
    data: [
      { title:'Halaman Sekolah', imageUrl:'https://picsum.photos/seed/gal1/800/600' },
      { title:'Kegiatan Kelas', imageUrl:'https://picsum.photos/seed/gal2/800/600' },
      { title:'Perpustakaan', imageUrl:'https://picsum.photos/seed/gal3/800/600' },
    ]
  })

  await prisma.organizationMember.createMany({
    data: [
      { name:'Ibu Siti', position:'Kepala Sekolah' },
      { name:'Bapak Andi', position:'Wakil Kepala Sekolah' },
      { name:'Ibu Rina', position:'Guru Kelas 6' },
      { name:'Ibu Dewi', position:'Guru Kelas 5' },
    ]
  })

  console.log('Seed selesai. Login admin: admin/admin123')
}

main().finally(()=>prisma.$disconnect())
