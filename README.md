<div align="center">

![HostImgAjaa](https://socialify.git.ci/razannnnnn/HostImgAjaa/image?custom_language=Next.js&font=Raleway&forks=1&issues=1&language=1&name=1&owner=1&pattern=Charlie+Brown&pulls=1&stargazers=1&theme=Auto)

**Free Image Hosting — Upload, Store, and Share in seconds.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-3448c5?style=flat-square&logo=cloudinary)](https://cloudinary.com)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-v4-purple?style=flat-square)](https://next-auth.js.org)
[![Resend](https://img.shields.io/badge/Resend-Email-black?style=flat-square)](https://resend.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

[🚀 Live Demo](https://host-img-ajaa.vercel.app/) · [🐛 Report Bug](https://github.com/razannnnnn/HostImgAjaa/issues) · [💡 Request Feature](https://github.com/razannnnnn/HostImgAjaa/issues)

</div>

---

## ✨ Features

- 🖼️ **Upload gambar** — drag & drop atau klik untuk browse file
- 🔗 **URL CDN custom** — link gambar menggunakan domain sendiri
- 📎 **Upload dari URL** — simpan gambar dari link eksternal
- 🗑️ **Kode penghapusan** — hapus gambar kapan saja dengan delete code unik
- 👤 **Autentikasi** — register & login dengan email + password
- 📧 **Verifikasi email** — email verifikasi otomatis via Resend
- 🔒 **Rate limiting guest** — guest dibatasi 10 upload/hari berdasarkan IP
- ⚡ **Electric Border** — animasi border keren di upload box
- 🌌 **Aurora Background** — background animasi WebGL yang memukau
- 🔔 **Toast notifications** — notifikasi animasi untuk setiap aksi
- 📱 **Fully Responsive** — tampil sempurna di mobile, tablet, dan desktop
- 🌙 **Dark Mode** — otomatis mengikuti preferensi sistem
- 💸 **100% Gratis** — tidak perlu registrasi untuk upload

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS v3 + Tailus UI |
| **Database** | MongoDB Atlas (Mongoose) |
| **Storage** | Cloudinary |
| **Auth** | NextAuth.js v4 (Credentials) |
| **Email** | Resend |
| **Animation** | OGL (Aurora), Canvas API (ElectricBorder) |
| **Font** | Geist + Geist Mono |
| **Deploy** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Resend account

### Installation

**1. Clone repository**
```bash
git clone https://github.com/razannnnnn/HostImgAjaa.git
cd HostImgAjaa
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup environment variables**

Buat file `.env.local` di root project:
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostimgajaa

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**4. Jalankan development server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📡 API Endpoints

### `POST /api/upload`
Upload gambar dari file atau URL. Guest dibatasi 10 upload/hari.

**Upload File:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/image.png"
```

**Upload dari URL:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/image.png"}'
```

**Response:**
```json
{
  "success": true,
  "url": "https://host-img-ajaa.vercel.app/api/i/abc123.png",
  "filename": "abc123.png",
  "deleteCode": "def456ghi789",
  "uploadedAt": "2026-03-19T00:00:00.000Z"
}
```

---

### `GET /api/i/[filename]`
Akses gambar via URL CDN custom. URL Cloudinary tersembunyi dari user.

```
https://host-img-ajaa.vercel.app/api/i/abc123.png
```

---

### `GET /delete/[deleteCode]`
Hapus gambar dari sistem (Cloudinary + MongoDB) menggunakan delete code.

```
https://host-img-ajaa.vercel.app/delete/def456ghi789
```

**Response:**
```json
{
  "success": true,
  "message": "Gambar berhasil dihapus"
}
```

---

### `POST /api/register`
Daftar akun baru. Email verifikasi otomatis dikirim via Resend.

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email": "kamu@email.com", "password": "password123"}'
```

---

### `GET /api/verify-email?token=[token]`
Verifikasi email setelah klik link di inbox.

---

## 📁 Project Structure

```
hostimgajaa/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js   # NextAuth config
│   │   ├── upload/route.js               # POST upload gambar
│   │   ├── register/route.js             # POST register user
│   │   ├── verify-email/route.js         # GET verifikasi email
│   │   └── i/[filename]/route.js         # GET proxy gambar
│   ├── delete/[deleteCode]/
│   │   └── route.js                      # GET hapus gambar
│   ├── upload/
│   │   └── page.jsx                      # Halaman upload
│   ├── verify-success/page.jsx           # Halaman sukses verifikasi
│   ├── verify-failed/page.jsx            # Halaman gagal verifikasi
│   ├── layout.js
│   └── page.jsx                          # Halaman home
├── components/
│   ├── Aurora.jsx                        # Background animasi WebGL
│   ├── AuthModal.jsx                     # Modal login & register
│   ├── DonationModal.jsx                 # Modal donasi Saweria
│   ├── Footer.jsx
│   ├── Navbar.jsx                        # Navbar + dropdown user
│   ├── Providers.jsx                     # SessionProvider + ToastProvider
│   ├── Toast.jsx                         # Komponen toast notification
│   ├── ToastProvider.jsx                 # Context untuk toast
│   └── UploadBox.jsx                     # Komponen upload utama
├── lib/
│   ├── cloudinary.js                     # Konfigurasi Cloudinary
│   ├── email.js                          # Resend email sender
│   └── mongodb.js                        # Koneksi MongoDB
├── models/
│   ├── GuestUpload.js                    # Schema rate limit guest
│   ├── Image.js                          # Schema gambar
│   └── User.js                           # Schema user
└── public/
    └── fonts/                            # Font Geist lokal
```

---

## 🔐 Authentication Flow

```
Register → Kirim email verifikasi (Resend)
        → Klik link di inbox
        → Email terverifikasi
        → Login berhasil
```

Guest yang belum login dibatasi **10 upload per hari** berdasarkan IP address.

---

## 🌐 Deploy ke Vercel

**1. Push ke GitHub**
```bash
git add .
git commit -m "ready to deploy"
git push origin main
```

**2. Import di Vercel**
- Buka [vercel.com](https://vercel.com)
- Klik **Add New Project**
- Import repository dari GitHub
- Tambahkan semua environment variables dari `.env.local`
- Klik **Deploy**

---

## ☕ Support

Kalau project ini bermanfaat, pertimbangkan untuk support pengembangnya!

[![Saweria](https://img.shields.io/badge/Saweria-Support%20Developer-orange?style=flat-square)](https://saweria.co/razn)

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

<div align="center">

Made with ❤️ by **Razan** · © 2026 HostImgAjaa

</div>
