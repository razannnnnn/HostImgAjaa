<div align="center">

<img src="public/favicon.png" width="80" height="80" alt="HostImgAjaa Logo" />

# HostImgAjaa

**Free Image Hosting — Upload, Store, and Share in seconds.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-3448c5?style=flat-square&logo=cloudinary)](https://cloudinary.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

[🚀 Live Demo](https://host-img-ajaa.vercel.app/) · [🐛 Report Bug](https://github.com/razannnnnn/HostImgAjaa/issues) · [💡 Request Feature](https://github.com/razannnnnn/HostImgAjaa/issues)

</div>

---

## ✨ Features

- 🖼️ **Upload gambar** — drag & drop atau klik untuk browse file
- 🔗 **URL CDN custom** — link gambar menggunakan domain sendiri
- 📎 **Upload dari URL** — simpan gambar dari link eksternal
- 🗑️ **Kode penghapusan** — hapus gambar kapan saja dengan delete code
- ⚡ **Electric Border** — animasi border yang keren di upload box
- 🌌 **Aurora Background** — background animasi WebGL yang memukau
- 📱 **Fully Responsive** — tampil sempurna di mobile, tablet, dan desktop
- 🌙 **Dark Mode** — otomatis mengikuti preferensi sistem
- 💸 **100% Gratis** — tidak perlu registrasi

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS v3 + Tailus UI |
| **Database** | MongoDB Atlas (Mongoose) |
| **Storage** | Cloudinary |
| **Animation** | OGL (Aurora), Canvas API (ElectricBorder) |
| **Font** | Geist + Geist Mono |
| **Deploy** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostimgajaa
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
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
Upload gambar dari file atau URL.

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
  "url": "https://hostimgajaa.com/api/i/abc123.png",
  "filename": "abc123.png",
  "deleteCode": "def456ghi789",
  "uploadedAt": "2026-03-19T00:00:00.000Z"
}
```

---

### `GET /api/i/[filename]`
Akses gambar via URL CDN custom.

```
https://hostimgajaa.com/api/i/abc123.png
```

---

### `GET /delete/[deleteCode]`
Hapus gambar dari sistem (Cloudinary + MongoDB).

```
https://hostimgajaa.com/delete/def456ghi789
```

**Response:**
```json
{
  "success": true,
  "message": "Gambar berhasil dihapus"
}
```

---

## 📁 Project Structure

```
hostimgajaa/
├── app/
│   ├── api/
│   │   ├── upload/route.js       # POST upload gambar
│   │   └── i/[filename]/route.js # GET proxy gambar
│   ├── delete/[deleteCode]/
│   │   └── route.js              # GET hapus gambar
│   ├── upload/
│   │   └── page.jsx              # Halaman upload
│   ├── layout.js
│   └── page.jsx                  # Halaman home
├── components/
│   ├── Aurora.jsx                # Background animasi WebGL
│   ├── DonationModal.jsx         # Modal donasi Saweria
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   └── UploadBox.jsx             # Komponen upload utama
├── lib/
│   ├── cloudinary.js             # Konfigurasi Cloudinary
│   └── mongodb.js                # Koneksi MongoDB
├── models/
│   └── Image.js                  # Mongoose schema
└── public/
    └── fonts/                    # Font Geist lokal
```

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
