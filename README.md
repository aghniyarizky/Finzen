# Saku GenZ

## Deskripsi

Saku GenZ adalah aplikasi frontend untuk membantu mahasiswa dan anak muda mencatat serta memantau keuangan pribadi. Aplikasi menyediakan dashboard ringkasan keuangan dan berbagai alat untuk mengelola transaksi, anggaran, tabungan, serta pinjaman. Frontend berkomunikasi dengan backend melalui REST API yang alamatnya dikonfigurasi menggunakan environment variable.

Repository ini berisi aplikasi frontend Next.js. Backend/API tidak disertakan di repository ini, sehingga fitur yang memerlukan data membutuhkan backend yang dapat diakses.

## Key Features

- **Autentikasi:** registrasi, verifikasi OTP, login, onboarding profil dan kondisi keuangan.
- **Dashboard:** ringkasan saldo, pemasukan dan pengeluaran, transaksi terkini, pinjaman, grafik, dan informasi kesehatan finansial.
- **Pencatatan transaksi:** melihat, menambah, dan mengubah pemasukan maupun pengeluaran, termasuk alur scan struk.
- **Penganggaran:** melihat, membuat, dan mengubah budget.
- **Target tabungan:** membuat dan mengelola target serta mencatat setoran.
- **Pengelolaan pinjaman:** daftar dan detail pinjaman, formulir pinjaman, serta kalkulator bunga.
- **Kesehatan finansial dan asisten:** halaman financial health dan fitur Cari Aman.
- **Antarmuka responsif:** komponen UI menggunakan Tailwind CSS dan Material Icons.

## Preview

### Endpoint autentikasi

Contoh berikut menggambarkan request yang dibuat frontend ke backend. URL lengkapnya menggunakan `NEXT_PUBLIC_API_URL`; backend harus menyediakan endpoint tersebut. Repository ini tidak mendefinisikan implementasi endpoint atau menjamin format response backend.

#### Registrasi

```http
POST {NEXT_PUBLIC_API_URL}/api/auth/register
Content-Type: application/json
```

Request:

```json
{
  "fullName": "Budi Santoso",
  "username": "budis",
  "email": "budi@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

Contoh response sukses (ilustrasi):

```json
{
  "message": "Pendaftaran berhasil"
}
```

Frontend memeriksa status HTTP untuk menentukan keberhasilan registrasi; body response sukses tidak dibaca. Kolom formulir wajib diisi, email menggunakan validasi format browser, dan frontend menolak password yang tidak sama dengan konfirmasinya. Validasi backend tetap diperlukan.

#### Verifikasi OTP

```http
POST {NEXT_PUBLIC_API_URL}/api/auth/verify-otp
Content-Type: application/json
```

Request:

```json
{
  "email": "budi@example.com",
  "otpCode": "123456"
}
```

Contoh response sukses (ilustrasi):

```json
{
  "message": "Akun berhasil diaktifkan",
  "data": "<token>"
}
```

Email dan kode OTP wajib diisi; kolom OTP membatasi input hingga enam karakter. Frontend tidak memeriksa bahwa keenam karakter tersebut semuanya angka, sehingga format dan masa berlaku OTP perlu divalidasi backend. Jika response menyertakan `data`, nilainya disimpan sebagai token.

#### Login

```http
POST {NEXT_PUBLIC_API_URL}/api/auth/login
Content-Type: application/json
```

Request:

```json
{
  "identifier": "budis",
  "password": "Password123!"
}
```

Contoh response sukses (ilustrasi):

```json
{
  "data": "<token>",
  "user": {
    "username": "budis",
    "email": "budi@example.com"
  }
}
```

Kolom identifier dan password wajib diisi. Frontend menyimpan `data` sebagai token jika tersedia, serta menyimpan informasi pengguna jika response menyediakan `user`. Response gagal ditampilkan menggunakan pesan `message` dari backend jika tersedia.

#### Kirim ulang OTP

```http
POST {NEXT_PUBLIC_API_URL}/api/auth/resend-otp
Content-Type: application/json
```

Request:

```json
{
  "email": "budi@example.com"
}
```

Frontend mengirim alamat email dan mengharapkan response JSON; kebijakan pengiriman ulang, batas percobaan, dan validasi email ditangani backend.

> Response di atas hanya contoh bentuk data yang relevan dengan frontend, bukan kontrak backend yang diverifikasi. Endpoint, aturan validasi, autentikasi, dan response final perlu dicocokkan dengan dokumentasi backend yang digunakan.

## Project Structure

```text
app/
  globals.css                 # Gaya global dan import Tailwind CSS
  layout.tsx                  # Root layout, font, metadata, dan ikon
  page.tsx                    # Entry point dan pemilih tampilan berdasarkan query `mode`
components/
  auth/                       # Registrasi, login, OTP, onboarding
  main/
    dashboard.tsx             # Dashboard utama
    grafik-keuangan.tsx       # Grafik keuangan
    sidebar.tsx               # Navigasi dan aksi aplikasi
    financial-health/         # Fitur kesehatan finansial
    smart-assistant/           # Fitur Cari Aman
    catatan-keuangan/
      budgeting/              # Anggaran
      dompet/                 # Komponen dompet
      kelola-pinjaman/        # Pinjaman dan kalkulator bunga
      target-nabung/          # Target dan setoran tabungan
      transaksi/              # Transaksi dan scan struk
  # Komponen UI bersama seperti toast dan konfirmasi hapus
public/                       # Gambar, ikon, dan aset statis
services/                     # Direktori service; belum berisi file sumber
next.config.ts                # Konfigurasi Next.js
postcss.config.mjs            # Integrasi Tailwind CSS dengan PostCSS
eslint.config.mjs             # Konfigurasi ESLint
tsconfig.json                 # Konfigurasi TypeScript
package.json                  # Dependency dan script npm
package-lock.json             # Lockfile dependency npm
```

Tampilan utama dirender dari `app/page.tsx`. Navigasi fitur menggunakan query string, misalnya `/?mode=dashboard`, `/?mode=transaksi`, `/?mode=budgeting`, atau `/?mode=kelolapinjaman`; beberapa tampilan detail juga memakai parameter `id`. Direktori `services/` tersedia tetapi integrasi API saat ini dilakukan langsung oleh komponen frontend.

## Tech Stack

- **Next.js 16** — framework aplikasi web dan entry point frontend.
- **React 19** — library untuk membangun antarmuka berbasis komponen.
- **TypeScript 5** — bahasa dan pemeriksaan tipe.
- **Tailwind CSS 4** — styling utility-first melalui plugin PostCSS.
- **Material Icons** — ikon antarmuka.
- **Fetch API** — komunikasi HTTP dari frontend ke backend.
- **ESLint 9** dengan konfigurasi Next.js — linting.
- **Axios** juga terdaftar sebagai dependency, tetapi request yang terlihat pada komponen saat ini menggunakan Fetch API.

Versi dependency yang tepat dapat dilihat di `package.json` dan `package-lock.json`.

## Local Setup

### Prerequisites

- Node.js **20.9 atau lebih baru** (disarankan versi LTS yang kompatibel).
- npm, biasanya sudah disertakan bersama Node.js.
- Git.
- Backend Saku GenZ yang sedang berjalan atau URL backend yang dapat diakses. Tanpa backend, halaman frontend mungkin dapat dibuka, tetapi fitur yang mengambil atau menyimpan data tidak akan berfungsi penuh.

### 1. Clone repository

```bash
git clone https://github.com/aghniyarizky/Saku-GenZ.git
cd Saku-GenZ
```

### 2. Install dependencies

Gunakan lockfile repository untuk memasang versi dependency yang konsisten:

```bash
npm ci
```

### 3. Konfigurasi environment

Buat file `.env.local` di root project dan isi URL dasar backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Ganti nilai tersebut dengan URL backend yang digunakan. Jangan menambahkan path `/api` di akhir nilai karena komponen menambahkan path endpoint sendiri. Karena variabel memakai prefix `NEXT_PUBLIC_`, nilainya tersedia di browser; jangan menyimpan secret atau credential di dalamnya.

### 4. Jalankan aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Pastikan backend hidup dan dapat dijangkau dari browser, termasuk konfigurasi CORS backend bila frontend dan backend menggunakan origin berbeda.

### Pemeriksaan tambahan

```bash
npm run lint
npm run build
```

## Documentation

- [Next.js Documentation](https://nextjs.org/docs) — framework dan routing.
- [React Documentation](https://react.dev/learn) — komponen dan konsep React.
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — bahasa dan sistem tipe.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) — utility CSS.
- [Material Icons Guide](https://developers.google.com/fonts/docs/material_icons) — ikon antarmuka.
- [Fetch API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) — request HTTP di browser.
- [Axios Documentation](https://axios-http.com/docs/intro) — library yang tersedia sebagai dependency.
- [ESLint Documentation](https://eslint.org/docs/latest/) — linting.

## Commit Format Standards

Gunakan format commit yang ringkas dan konsisten:

```text
type(scope): subject
```

- `type` menjelaskan jenis perubahan, misalnya `feat`, `fix`, `docs`, `refactor`, atau `chore`.
- `scope` menyebut area yang terdampak, misalnya `auth`, `transaksi`, atau `readme`.
- `subject` menjelaskan perubahan dengan singkat, sebaiknya menggunakan bentuk perintah dan tanpa tanda titik di akhir.

Contoh:

```text
feat(auth): add OTP verification flow
fix(transaksi): handle empty transaction list
docs(readme): document local setup and API examples
refactor(dashboard): simplify summary rendering
chore(deps): update Next.js dependencies
```

Format ini merupakan panduan kontribusi; enforcement otomatis tidak dikonfigurasi di repository.
