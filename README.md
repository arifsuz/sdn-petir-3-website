# SDN Petir 3 Website

Website SDN Petir 3 adalah aplikasi web yang membantu sekolah mengelola informasi, galeri foto, blog, dan aktivitas secara online. Proyek ini terdiri dari dua bagian utama: backend (server) dan frontend (tampilan website).

---

## Apa itu Backend dan Frontend?

- **Backend** adalah bagian "belakang layar" yang mengatur data, keamanan, dan logika aplikasi. Di sini, data disimpan dan diproses.
- **Frontend** adalah bagian yang dilihat dan digunakan oleh pengunjung website, seperti halaman, tombol, dan gambar.

---

## Struktur Folder & Penjelasan

```
backend/      # Server, database, autentikasi (login), API
frontend/     # Tampilan website, halaman, komponen
```

- **backend/.env**: Tempat menyimpan data rahasia seperti password database (tidak dibagikan ke publik)
- **backend/prisma/**: Mengatur database, migrasi, dan struktur data
- **backend/src/routes/**: Kumpulan fitur seperti login, galeri, blog, organisasi, aktivitas
- **frontend/src/pages/**: Halaman-halaman website (Beranda, Blog, Galeri, dsb)
- **frontend/src/components/**: Bagian-bagian kecil tampilan seperti menu dan footer

---

## Cara Instalasi & Menjalankan Proyek

1. **Unduh kode proyek**
	- Klik tombol "Code" di GitHub, lalu pilih "Download ZIP" atau gunakan perintah:
	```bash
		git clone https://github.com/arifsuz/sdn-petir-3-website.git
		cd sdn-petir-3-website
	```
2. **Pasang aplikasi pendukung**
	- Pastikan sudah menginstall [Node.js](https://nodejs.org/) di komputer.
3. **Install semua kebutuhan aplikasi**
	- Jalankan perintah berikut di terminal:
	```bash
		cd backend
		npm install
		cd ../frontend
		npm install
	```
4. **Buat file pengaturan rahasia**
	- Di folder `backend`, buat file bernama `.env` dan isi seperti contoh:
	```env
		DATABASE_URL="mysql://user:password@localhost:3306/sdn_petir3"
		JWT_SECRET="kode_rahasia_anda"
	```
5. **Inisialisasi database**
	```bash
		cd backend
		npx prisma migrate dev
	```
6. **Seed data** (opsional)
	```bash
		npm run seed
	```  
7. **Jalankan server backend**  
	```bash
		cd backend
		npm run dev
	```
8. **Jalankan tampilan website (frontend)**
	```bash
		cd frontend
		npm run dev
	```
9. **Akses website**
	- Buka browser dan kunjungi alamat yang muncul di terminal, biasanya `http://localhost:5173`.

---

## Penjelasan Fitur Utama

- **Login/Autentikasi**: Hanya pengguna terdaftar yang bisa mengakses fitur tertentu.
- **Galeri Foto**: Menampilkan dan mengelola foto-foto kegiatan sekolah.
- **Blog**: Tempat menulis dan membaca artikel atau berita sekolah.
- **Organisasi & Aktivitas**: Informasi tentang organisasi sekolah dan kegiatan yang sedang/akan berlangsung.
- **Tampilan Responsif**: Website bisa dibuka di HP, tablet, maupun komputer.

---

## Cara Kerja Singkat

1. Pengunjung membuka website dan melihat halaman utama.
2. Jika ingin mengelola konten, pengguna harus login.
3. Setelah login, pengguna bisa menambah/mengedit galeri, blog, dan aktivitas.
4. Semua data tersimpan di database yang aman.

---

## Glosarium Istilah

- **Node.js**: Program untuk menjalankan JavaScript di server.
- **React**: Alat untuk membuat tampilan website yang interaktif.
- **Prisma**: Alat untuk mengatur dan mengakses database.
- **API**: Cara aplikasi berkomunikasi antara backend dan frontend.
- **Database**: Tempat menyimpan data seperti foto, artikel, dan pengguna.

---

## Kontribusi

1. Fork repository
2. Buat branch fitur: `git checkout -b fitur-baru`
3. Commit perubahan
4. Pull request ke branch `main`

---

## Fitur Utama

- Autentikasi pengguna
- Manajemen galeri dan blog
- Manajemen organisasi dan aktivitas
- UI responsif dengan Tailwind CSS

## Kontribusi

1. Fork repository
2. Buat branch fitur: `git checkout -b fitur-baru`
3. Commit perubahan
4. Pull request ke branch `main`

## Lisensi

Proyek ini menggunakan lisensi MIT. Silakan gunakan dan modifikasi sesuai kebutuhan.
