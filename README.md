# SDN Petir 3 Website

<div align="center">
  <img src="frontend/public/Logo-Sekolah.png" alt="Logo SDN Petir 3" width="120"/>
  
  **Sistem Informasi Website Sekolah Dasar Negeri Petir 3**
  
  [![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-5+-purple.svg)](https://www.prisma.io/)
</div>

---

## 📋 Daftar Isi

- [Gambaran Umum](#-gambaran-umum)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi & Setup](#-instalasi--setup)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Proyek](#-struktur-proyek)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Panduan Pengembangan](#-panduan-pengembangan)
- [Deployment](#-deployment)
- [FAQ](#-faq)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🎯 Gambaran Umum

Website SDN Petir 3 adalah sistem informasi sekolah berbasis web yang memungkinkan pengelolaan konten secara digital. Sistem ini dirancang untuk membantu sekolah dalam:

- 📢 **Publikasi Informasi**: Berita, pengumuman, dan artikel
- 🖼️ **Galeri Digital**: Dokumentasi kegiatan dan foto sekolah
- 👥 **Manajemen Organisasi**: Struktur organisasi dan profil guru
- 📅 **Jadwal Kegiatan**: Informasi kegiatan dan acara sekolah
- 🎥 **Media Center**: Video profil dan pengenalan sekolah

---

## 🏗️ Arsitektur Sistem

Aplikasi ini menggunakan arsitektur **Client-Server** dengan pemisahan yang jelas antara frontend dan backend:

```mermaid
graph TB
    A[Client Browser] --> B[Frontend React]
    B --> C[API Gateway]
    C --> D[Backend Express.js]
    D --> E[Database MySQL]
    D --> F[File Storage]
```

### Backend (Server-Side)
- **Framework**: Express.js dengan TypeScript
- **Database**: MySQL dengan Prisma ORM
- **Authentication**: JWT (JSON Web Token)
- **File Upload**: Multer middleware
- **API**: RESTful API endpoints

### Frontend (Client-Side)
- **Framework**: React 18 dengan TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Routing**: React Router
- **Rich Text Editor**: React Quill

---

## ✨ Fitur Utama

### 🔐 Sistem Autentikasi
- Login/logout admin
- Session management dengan JWT
- Protected routes untuk admin panel

### 📰 Manajemen Konten
- **Posts/Berita**: CRUD dengan rich text editor
- **Activities/Kegiatan**: Manajemen jadwal dan kegiatan
- **Gallery**: Upload dan organisasi foto
- **Organization**: Struktur organisasi dan profil guru

### 🎨 User Interface
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Modern UI**: Clean design dengan Tailwind CSS
- **Interactive Elements**: Modal, carousel, form validation
- **Media Player**: Video player untuk profil sekolah

### 📊 Dashboard Admin
- Statistics overview
- Recent content management
- Quick access to all features

---

## 🛠️ Teknologi yang Digunakan

### Backend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| Node.js | 16+ | Runtime JavaScript |
| Express.js | 4.18+ | Web framework |
| TypeScript | 5+ | Type-safe JavaScript |
| Prisma | 5+ | Database ORM |
| MySQL | 8+ | Database |
| JWT | - | Authentication |
| Multer | - | File upload |
| Helmet | - | Security middleware |
| CORS | - | Cross-origin requests |

### Frontend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| React | 18+ | UI framework |
| TypeScript | 5+ | Type-safe JavaScript |
| Vite | 4+ | Build tool |
| Tailwind CSS | 3+ | Utility-first CSS |
| React Router | 6+ | Client-side routing |
| React Hook Form | 7+ | Form management |
| React Quill | 2+ | Rich text editor |
| Axios | 1+ | HTTP client |
| Heroicons | 2+ | Icon library |

---

## 💻 Persyaratan Sistem

### Minimum Requirements
- **Node.js**: Version 16.0.0 atau lebih baru
- **npm**: Version 7.0.0 atau lebih baru
- **MySQL**: Version 8.0 atau lebih baru
- **Memory**: Minimum 2GB RAM
- **Storage**: 1GB free space

### Recommended
- **Node.js**: Version 18.0.0+ (LTS)
- **npm**: Version 9.0.0+
- **MySQL**: Version 8.0.30+
- **Memory**: 4GB+ RAM
- **Storage**: 5GB+ free space

---

## 🚀 Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/arifsuz/sdn-petir-3-website.git
cd sdn-petir-3-website
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 3. Setup Database
```bash
# Install MySQL dan buat database
mysql -u root -p
CREATE DATABASE sdn_petir3;
EXIT;
```

---

## ⚙️ Konfigurasi

### Environment Variables

Buat file `.env` di folder `backend/` dengan konfigurasi berikut:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/sdn_petir3"

# JWT Secret (gunakan string random yang kuat)
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Server Configuration
PORT=4000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_PATH=./uploads

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### Database Migration
```bash
cd backend
npx prisma migrate dev --name init
```

### Seed Data (Opsional)
```bash
npm run seed
```

---

## 🏃‍♂️ Menjalankan Aplikasi

### Development Mode

#### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Server akan berjalan di: `http://localhost:4000`

#### 2. Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di: `http://localhost:5173`

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Production Server
```bash
cd backend
npm start
```

---

## 📁 Struktur Proyek

```
sdn-petir-3-website/
├── backend/                    # Server-side application
│   ├── prisma/                # Database schema & migrations
│   │   ├── schema.prisma      # Database model definitions
│   │   └── migrations/        # Database migration files
│   ├── src/
│   │   ├── index.ts          # Application entry point
│   │   ├── middleware/       # Custom middleware
│   │   │   ├── requireAuth.ts # JWT authentication
│   │   │   └── upload.ts     # File upload handling
│   │   └── routes/           # API route handlers
│   │       ├── auth.ts       # Authentication endpoints
│   │       ├── posts.ts      # Posts/news management
│   │       ├── activities.ts # Activities management
│   │       ├── gallery.ts    # Gallery management
│   │       ├── organization.ts # Organization structure
│   │       ├── upload.ts     # File upload endpoints
│   │       └── contact.ts    # Contact form handling
│   ├── uploads/              # Uploaded files storage
│   ├── .env                  # Environment variables
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript configuration
│
├── frontend/                  # Client-side application
│   ├── public/               # Static assets
│   │   ├── Logo-Sekolah.png  # School logo
│   │   ├── Foto-Sekolah.jpeg # School photos
│   │   └── SEKOLAH/          # School videos
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.tsx    # Navigation component
│   │   │   ├── Footer.tsx    # Footer component
│   │   │   ├── BannerCarousel.tsx # Image carousel
│   │   │   ├── ContactForm.tsx    # Contact form
│   │   │   └── ImageInput.tsx     # Image upload input
│   │   ├── pages/            # Page components
│   │   │   ├── Home.tsx      # Homepage
│   │   │   ├── About.tsx     # About page
│   │   │   ├── Blog.tsx      # Blog listing
│   │   │   ├── PostDetail.tsx # Individual post
│   │   │   ├── Galery.tsx    # Photo gallery
│   │   │   ├── Kegiatan.tsx  # Activities page
│   │   │   └── Admin.tsx     # Admin dashboard
│   │   ├── lib/
│   │   │   └── api.ts        # API client configuration
│   │   ├── styles/
│   │   │   └── quill-custom.css # Rich editor styles
│   │   ├── main.tsx          # Application entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.ts        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS config
│   └── tsconfig.json         # TypeScript configuration
│
├── README.md                 # Project documentation
└── .gitignore               # Git ignore rules
```

---

## 📖 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication Endpoints

#### POST `/auth/login`
Login admin user
```json
{
  "username": "admin",
  "password": "password"
}
```

#### POST `/auth/logout`
Logout current user (requires authentication)

### Content Management Endpoints

#### Posts (Berita)
- `GET /posts` - Get all posts
- `POST /posts` - Create new post (auth required)
- `PUT /posts/:id` - Update post (auth required)
- `DELETE /posts/:id` - Delete post (auth required)

#### Activities (Kegiatan)
- `GET /activities` - Get all activities
- `POST /activities` - Create activity (auth required)
- `PUT /activities/:id` - Update activity (auth required)
- `DELETE /activities/:id` - Delete activity (auth required)

#### Gallery
- `GET /gallery` - Get all photos
- `POST /gallery` - Add photo (auth required)
- `PUT /gallery/:id` - Update photo (auth required)
- `DELETE /gallery/:id` - Delete photo (auth required)

#### Organization
- `GET /organization` - Get organization structure
- `POST /organization` - Add member (auth required)
- `PUT /organization/:id` - Update member (auth required)
- `DELETE /organization/:id` - Delete member (auth required)

#### File Upload
- `POST /upload` - Upload image file (auth required)

---

## 💾 Database Schema

### Posts Table
```sql
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    imageUrl VARCHAR(500),
    publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Activities Table
```sql
CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    imageUrl VARCHAR(500),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Gallery Table
```sql
CREATE TABLE gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    imageUrl VARCHAR(500) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Organization Table
```sql
CREATE TABLE organization (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    photoUrl VARCHAR(500),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 👨‍💻 Panduan Pengembangan

### Code Style Guidelines

#### TypeScript/JavaScript
- Gunakan TypeScript untuk type safety
- Ikuti ESLint rules
- Gunakan camelCase untuk variabel dan fungsi
- Gunakan PascalCase untuk komponen React

#### CSS/Styling
- Prioritaskan Tailwind CSS classes
- Hindari inline styles kecuali untuk dynamic values
- Gunakan consistent spacing dan color scheme

### Testing
```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

### Debugging
- Gunakan browser DevTools untuk frontend debugging
- Gunakan Node.js debugger untuk backend
- Check console logs dan network requests

---

## 🚢 Deployment

### Environment Setup
1. Setup production database
2. Configure environment variables
3. Setup file storage (local atau cloud)

### Build Process
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ../backend
npm start
```

---

## 🤝 Kontribusi

### How to Contribute
1. **Fork** repository ini
2. **Create branch** untuk fitur baru: `git checkout -b feature/nama-fitur`
3. **Commit** perubahan: `git commit -m 'Menambah fitur X'`
4. **Push** ke branch: `git push origin feature/nama-fitur`
5. **Submit Pull Request**

### Contribution Guidelines
- Ikuti code style yang sudah ada
- Tambahkan dokumentasi untuk fitur baru
- Test fitur sebelum submit PR
- Tulis commit message yang jelas

---

<div align="center">
  <p><strong>Made with ❤️ for SDN Petir 3</strong></p>
  <p>© 2025 SDN Petir 3. All rights reserved.</p>
</div>