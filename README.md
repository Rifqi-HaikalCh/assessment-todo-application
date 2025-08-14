# Nodewave To-Do Application

Aplikasi manajemen tugas (To-Do) yang dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS. Aplikasi ini memiliki fitur autentikasi, manajemen tugas personal, dan panel admin.

## 🚀 Teknologi yang Digunakan

- **Framework:** Next.js 14 (App Router)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** Zustand
- **Data Fetching:** React Query (TanStack Query)
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Notifications:** Sonner
- **Icons:** Lucide React

## 📋 Fitur Utama

### Fitur Wajib
- ✅ **Autentikasi:** Login dan Register dengan validasi
- ✅ **Manajemen To-Do:** CRUD operasi untuk tugas
- ✅ **Status Toggle:** Tandai tugas sebagai selesai/belum selesai
- ✅ **Hapus To-Do:** Hapus tugas individual atau bulk delete
- ✅ **Filter:** Filter berdasarkan status (All, Completed, Pending)

### Fitur Opsional
- ✅ **Halaman Admin:** Lihat semua To-Do dari semua pengguna
- ✅ **Search:** Cari To-Do berdasarkan judul
- ✅ **Pagination:** Navigasi halaman untuk daftar yang panjang
- ✅ **User Info:** Tampilkan informasi pengguna di setiap To-Do

## 🛠️ Instalasi & Setup

### Prerequisites
- Node.js 18+ 
- npm atau yarn atau pnpm

### Langkah Instalasi

1. **Clone repository**
```bash
git clone [repository-url]
cd todo-app
```

2. **Install dependencies**
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

4. **Jalankan development server**
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

5. **Buka browser**
```
http://localhost:3000
```

## 📁 Struktur Direktori

```
todo-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Grup route untuk autentikasi
│   │   ├── login/         # Halaman login
│   │   └── register/      # Halaman register
│   ├── (dashboard)/       # Grup route untuk dashboard
│   │   ├── todo/          # Halaman To-Do user
│   │   └── admin/         # Halaman admin
│   ├── api/               # API routes (jika diperlukan)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Halaman utama
├── components/            # Komponen React
│   ├── ui/               # Komponen UI dasar
│   ├── auth/             # Komponen autentikasi
│   ├── todo/             # Komponen To-Do
│   └── layout/           # Komponen layout
├── lib/                   # Library dan utilities
│   ├── api/              # API client dan functions
│   ├── schemas/          # Zod validation schemas
│   ├── store/            # Zustand stores
│   ├── hooks/            # Custom React hooks
│   └── utils.ts          # Utility functions
├── public/               # Static files
├── middleware.ts         # Next.js middleware
├── next.config.js        # Konfigurasi Next.js
├── tailwind.config.ts    # Konfigurasi Tailwind CSS
└── package.json          # Dependencies
```

## 🔑 API Endpoints

Aplikasi ini menggunakan API dari `https://fe-test-api.nwappservice.com`

### Authentication
- `POST /register` - Registrasi user baru
- `POST /login` - Login user
- `GET /verify-token` - Verifikasi token JWT

### To-Do Operations
- `GET /todos` - Ambil semua To-Do (dengan filter)
- `POST /todos` - Buat To-Do baru
- `PUT /todos/:id` - Update To-Do
- `POST /todos/:id/mark` - Toggle status To-Do
- `DELETE /todos/:id` - Hapus To-Do

## 🎨 Desain & UI

Aplikasi ini mengikuti desain yang telah diberikan dengan:
- **Font:** Inter untuk halaman utama, Poppins untuk register
- **Warna Utama:** Blue (#0066ff), Gray, Green, Red
- **Layout:** Responsive dengan mobile-first approach
- **Komponen:** Menggunakan Shadcn UI yang sudah dikustomisasi

## 📝 Cara Penggunaan

### 1. Register
- Buka halaman `/register`
- Isi form dengan data yang valid
- Klik tombol "Register"

### 2. Login
- Buka halaman `/login`
- Masukkan email/username dan password
- Centang "Remember Me" jika ingin tetap login
- Klik tombol "Login"

### 3. Mengelola To-Do
- Setelah login, Anda akan diarahkan ke `/todo`
- **Tambah:** Ketik judul tugas dan klik "Add Todo"
- **Tandai Selesai:** Klik checkbox atau ikon check
- **Hapus:** Klik ikon X pada tugas yang sudah selesai
- **Bulk Delete:** Pilih beberapa tugas dan klik "Delete Selected"

### 4. Admin Panel
- Hanya bisa diakses oleh user dengan role admin
- Lihat semua To-Do dari semua user
- Filter berdasarkan status
- Search berdasarkan judul

## 🔒 Middleware & Proteksi Route

Aplikasi menggunakan middleware untuk:
- Melindungi route yang memerlukan autentikasi
- Redirect user yang belum login ke halaman login
- Redirect user yang sudah login dari halaman auth

## 🧪 Testing (Opsional)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📦 Build & Deployment

### Build untuk production
```bash
npm run build
```

### Start production server
```bash
npm run start
```

### Deploy ke Vercel (Recommended)
```bash
vercel
```

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tim Pengembang

- Frontend Developer - [Your Name]
- UI/UX Designer - [Designer Name]

## 📞 Kontak & Support

Untuk pertanyaan atau dukungan, silakan hubungi:
- Email: support@nodewave.com
- Website: https://nodewave.com

---

**Note:** Pastikan untuk mengganti placeholder seperti `[repository-url]`, `[Your Name]`, dll dengan informasi yang sebenarnya.