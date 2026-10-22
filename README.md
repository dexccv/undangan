# Platform Undangan Digital & Panel Pengelola (Digitalisasi.id)

Platform aplikasi web undangan pernikahan digital berbasis React dan Vite dengan arsitektur multi-tenant dinamis, animasi panggung interaktif (GSAP & Three.js), sistem manajemen konten mandiri (CMS Dashboard), integrasi Google Firebase (Firestore, Storage, Authentication), serta generator tautan pengiriman massal WhatsApp.

---

## Daftar Isi

- [Ikhtisar Arsitektur](#ikhtisar-arsitektur)
- [Pembaruan dan Fitur Utama](#pembaruan-dan-fitur-utama)
  - [1. Pengalaman Tamu Undangan (Guest Experience)](#1-pengalaman-tamu-undangan-guest-experience)
  - [2. Halaman Utama Berkedalaman Visual (Landing Page)](#2-halaman-utama-berkedalaman-visual-landing-page)
  - [3. Panel Pengelola Komprehensif (Management Dashboard)](#3-panel-pengelola-komprehensif-management-dashboard)
- [Tumpukan Teknologi (Tech Stack)](#tumpukan-teknologi-tech-stack)
- [Struktur Direktori Proyek](#struktur-direktori-proyek)
- [Struktur Database & Penyimpanan Berkas](#struktur-database--penyimpanan-berkas)
  - [Cloud Firestore (NoSQL Database)](#cloud-firestore-nosql-database)
  - [Firebase Storage (Penyimpanan Berkas Gambar)](#firebase-storage-penyimpanan-berkas-gambar)
- [Panduan Instalasi & Pengembangan Lokal](#panduan-instalasi--pengembangan-lokal)
  - [Prasyarat](#prasyarat)
  - [Langkah Pemasangan](#langkah-pemasangan)
  - [Kompilasi Produksi](#kompilasi-produksi)
- [Standar Kualitas & Desain (Anti-Slop Standards)](#standar-kualitas--desain-anti-slop-standards)
- [Lisensi](#lisensi)

---

## Ikhtisar Arsitektur

Aplikasi ini menggunakan pola arsitektur berbasis komponen tunggal (*Single Page Application*) dengan perutean internal berbasis parameter URL (*query parameters*):

- `/?id={nama-tautan}&to={nama-tamu}`: Membuka undangan pernikahan spesifik untuk tamu yang dituju dengan personalisasi nama dan konten khusus pasangan.
- `/?id=demo`: Membuka mode demonstrasi undangan dengan data contoh lengkap (Nadia & Agus).
- `/?id=dev`: Membuka antarmuka autentikasi dan panel kendali pengelola (*Executive Management Dashboard*).
- `/`: Membuka halaman utama (*Landing Page*) pemasaran publik.

---

## Pembaruan dan Fitur Utama

### 1. Pengalaman Tamu Undangan (Guest Experience)

- **Animasi Tirai Teatrikal (Curtain Reveal):** Tirai ganda pembuka berskala penuh yang dianimasikan menggunakan GreenSock (GSAP) dengan aksen belahan emas dan tombol pembuka interaktif sebelum memasuki halaman utama undangan.
- **Personalisasi Tamu Dinamis:** Kartu sampul secara otomatis membaca parameter URL `to` dan menampilkan nama tamu terhormat secara presisi.
- **Kisah Perjalanan Cinta Dinamis (Love Story Milestones):** Rangkaian tonggak sejarah pertemuan dan komitmen pasangan yang dirender dinamis dari koleksi dokumen database, lengkap dengan foto pendukung, tahun, dan uraian naratif.
- **Galeri Foto Prewedding Bento & Modal Lightbox:** Susunan tata letak bento grid responsif dengan fitur perbesaran foto (*modal lightbox zoom*).
- **Pemutar Musik Latar Mengambang (Audio Context Engine):** Sistem pemutar instrumen musik terintegrasi dengan tombol kendali melayang dan visual piringan vinyl berputar.
- **Konfirmasi Kehadiran & Buku Doa Restu Real-Time:** Formulir pencatatan kehadiran tamu dan ucapan doa restu yang tersinkronisasi langsung ke sub-koleksi Cloud Firestore secara seketika (*real-time listener*).
- **Amplop Digital & Salin Rekening:** Fasilitas transfer hadiah pernikahan nontunai dengan fungsi salin nomor rekening bank dalam satu kali klik beserta notifikasi toast.
- **Petunjuk Lokasi & Integrasi Google Maps:** Peta digital dan tombol navigasi langsung menuju lokasi akad nikah dan resepsi.

### 2. Halaman Utama Berkedalaman Visual (Landing Page)

- **Multi-Layer Atmospheric Depth:** Latar belakang bertingkat yang menggabungkan rona dasar *Warm Champagne Ivory*, dua bola pencahayaan *ambient aura mesh* (Emas & Sage lembut), garis kisi arsitektural (*architectural grid lines* 64px), serta lapisan tekstur mikro kertas (*tactile film grain* SVG data-URI) tanpa membebani kartu grafis (GPU).
- **Floating Titanium Smartphone Showcase:** Area hero editorial split dua kolom yang memuat tiruan ponsel pintar titanium tiga dimensi dengan takik dinamis (*dynamic island*), pratinjau kartu undangan langsung, dan dua lencana mengambang (*live confirmation pulse* dan *music status*).
- **Double-Bezel Card Architecture:** Kartu fitur dan paket harga (Silver, Gold Imperial, Royal Platinum) mengadopsi konstruksi bingkai berlapis dengan sorotan cahaya dalam (*inset highlight*).
- **Lencana Pembuktian Sosial (Trust Strip):** Rangkuman metrik kepercayaan di bawah tombol ajakan bertindak (CTA).

### 3. Panel Pengelola Komprehensif (Management Dashboard)

- **Keamanan Autentikasi Admin:** Dilindungi gerbang masuk Firebase Authentication dengan enkripsi kata sandi.
- **Executive Topbar & Studio Canvas:** Bilah atas pemantauan status koneksi server, jumlah pasangan aktif, serta tautan cepat ke pratinjau undangan.
- **Editor Data Pasangan (8 Tab Fungsional):**
  1. *Profil Mempelai:* Data nama lengkap, nama panggilan, orang tua, akun media sosial, serta kutipan ayat/sumber.
  2. *Jadwal Acara:* Waktu, tanggal, dan alamat presisi akad nikah serta resepsi.
  3. *Foto & Media:* Slot pengunggahan gambar beresolusi tinggi untuk sampul, kutipan, mempelai, lokasi, dan penutup.
  4. *Perjalanan Kisah Cinta:* Manajemen fase cerita lengkap dengan pratinjau foto, tombol pengunggahan langsung ke Firebase Storage, pilihan cepat aset lokal (*preset chips*), dan input tautan URL manual.
  5. *Galeri Foto Prewedding:* Penambahan dan pengurangan koleksi foto album dengan tombol unggah terintegrasi dan keterangan takarir (*caption*).
  6. *Rekening & Hadiah:* Data nomor rekening, bank tujuan, penerima kado fisik, dan alamat kirim.
  7. *Pratinjau Layar (Device Frame Switcher):* Peninjauan tampilan undangan secara langsung dalam frame Ponsel (390px), Tablet (768px), atau Komputer Desktop (100%).
  8. *Kehadiran & Doa Tamu:* Pemantauan daftar tamu yang hadir/berhalangan serta daftar ucapan doa.
- **Ekspor Data ke Microsoft Excel:** Kemampuan mengekspor seluruh daftar konfirmasi kehadiran dan ucapan tamu ke dalam berkas format `.xlsx` menggunakan SheetJS.
- **Generator Tautan Undangan & Kirim WhatsApp Massal:** Generator otomatis yang mengurai daftar nama tamu dan menghasilkan tautan personalisasi instan beserta pesan salam terformat untuk dikirimkan melalui WhatsApp dalam satu klik.

---

## Tumpukan Teknologi (Tech Stack)

| Kategori | Teknologi / Pustaka | Deskripsi Fungsi |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 / React DOM | Pembangunan UI modular berbasis komponen fungsional |
| **Build Tooling** | Vite 8 | Kompilasi kilat modul ES dan optimasi bundel produksi |
| **Animasi & Interaksi** | GSAP (GreenSock) | Animasi pembukaan tirai teater berpresisi tinggi |
| **Animasi Deklaratif** | Motion (Framer Motion) | Transisi halaman dan pergerakan elemen antar-komponen |
| **Grafika 3D Ambient** | Three.js & @react-three/fiber | Cincin geometri ambient dan partikel debu melayang |
| **Backend & Basis Data** | Google Cloud Firestore | Basis data NoSQL dokumen untuk pasangan, tamu, dan doa |
| **Penyimpanan Berkas** | Google Firebase Storage | Penyimpanan berkas foto resolusi tinggi terenkripsi |
| **Autentikasi** | Google Firebase Auth | Manajemen sesi pengelola panel |
| **Ikonografi** | @phosphor-icons/react | Seluruh ikon grafis konsisten tanpa emoji mentah |
| **Olah Data Spreadsheet**| SheetJS (xlsx) | Ekspor data tabular konfirmasi kehadiran tamu ke Excel |
| **Notifikasi Dialog** | SweetAlert2 | Modal konfirmasi penghapusan dan notifikasi status |
| **Efek Visual Partikel** | canvas-confetti | Hamburan konfeti saat tamu mengonfirmasi kehadiran |

---

## Struktur Direktori Proyek

```text
undangan-main/
├── public/
│   ├── assets/                 # Aset berkas gambar statis, musik mp3, dan ikon
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── CurtainReveal.jsx   # Komponen tirai pembuka megah (GSAP)
│   │   ├── CurtainReveal.css   # Lembar gaya tirai teater dan efek shimmer
│   │   ├── DevDashboard.jsx    # Panel pengelola lengkap (8 Tab Editor & Blast WA)
│   │   ├── DevDashboard.css    # Gaya studio eksekutif, topbar, dan kartu berlapis
│   │   ├── LandingPage.jsx     # Halaman depan editorial dengan mockup ponsel
│   │   ├── LandingPage.css     # Gaya ambient aura mesh, kisi arsitektur, dan film grain
│   │   ├── ThreeScene.jsx      # Lapisan latar grafika Three.js non-blocking
│   │   ├── AudioController.jsx # Pemutar musik latar mengambang
│   │   ├── BentoGallery.jsx    # Galeri foto tata letak bento & modal pembesar
│   │   ├── LoveStory.jsx       # Garis waktu perjalanan kisah cinta dinamis
│   │   ├── RSVPSection.jsx     # Formulir konfirmasi kehadiran dan buku tamu
│   │   └── Toast.jsx           # Notifikasi umpan balik sementara
│   ├── context/
│   │   ├── AudioContext.jsx    # State global pemutaran audio
│   │   └── ToastContext.jsx    # State global antrean notifikasi toast
│   ├── firebase.js             # Inisialisasi Firebase App, Firestore, Auth, Storage
│   ├── App.jsx                 # Pengatur rute URL parameter & pemanggilan data
│   ├── App.css                 # Gaya umum tampilan tema undangan Ivory & Gold
│   ├── index.css               # Variabel CSS global, reset browser, dan tipografi
│   └── main.jsx                # Titik masuk utama aplikasi React
├── index.html                  # Berkas HTML utama Vite
├── vite.config.js              # Konfigurasi Vite (izin host eksternal & tunnel)
└── package.json                # Dependensi pustaka dan skrip perintah proyek
```

---

## Struktur Database & Penyimpanan Berkas

### Cloud Firestore (NoSQL Database)

Struktur data dalam Firestore diorganisasikan ke dalam dokumen dan sub-koleksi sebagai berikut:

```text
couples/ {coupleId}
  ├── id: string (contoh: "nadia-agus")
  ├── wanita_panggilan: string
  ├── wanita_lengkap: string
  ├── wanita_ortu: string
  ├── wanita_ig: string
  ├── pria_panggilan: string
  ├── pria_lengkap: string
  ├── pria_ortu: string
  ├── pria_ig: string
  ├── tanggal_cover: string
  ├── tanggal_akad: string (format ISO)
  ├── waktu_akad: string
  ├── lokasi_akad: string
  ├── tanggal_resepsi: string (format ISO)
  ├── waktu_resepsi: string
  ├── lokasi_resepsi: string
  ├── alamat_baris1: string
  ├── alamat_baris2: string
  ├── link_maps: string
  ├── foto_cover: string (URL Storage)
  ├── foto_prewedding_1: string
  ├── foto_mempelai_wanita: string
  ├── foto_mempelai_pria: string
  ├── foto_venue_akad: string
  ├── foto_venue_resepsi: string
  ├── foto_closing: string
  ├── rekening_wanita: string
  ├── bank_wanita: string
  ├── an_wanita: string
  ├── rekening_pria: string
  ├── bank_pria: string
  ├── an_pria: string
  ├── alamat_kado: string
  ├── penerima_kado: string
  ├── love_story: array [
  │     { year: string, title: string, desc: string, foto: string }
  │   ]
  ├── foto_galeri: array [
  │     { src: string, caption: string }
  │   ]
  │
  ├── [Sub-Koleksi] invitations/{coupleId}/rsvp/
  │     └── {rsvpId}: { name, status, guests, message, timestamp }
  │
  └── [Sub-Koleksi] invitations/{coupleId}/guestbook/
        └── {wishId}: { name, message, timestamp }
```

### Firebase Storage (Penyimpanan Berkas Gambar)

Berkas foto yang diunggah oleh pengelola melalui panel kendali disimpan pada bucket penyimpanan Firebase dengan skema hierarki berikut:

```text
couples/
  └── {coupleId}/
        ├── cover_{timestamp}_{filename}.jpg
        ├── story_{index}_{timestamp}_{filename}.jpg
        └── gallery_{index}_{timestamp}_{filename}.jpg
```

---

## Panduan Instalasi & Pengembangan Lokal

### Prasyarat

- Node.js versi 18.0 atau lebih tinggi
- Pengelola paket `npm` atau `pnpm`
- Peramban web modern yang mendukung WebGL dan CSS Backdrop Filter

### Langkah Pemasangan

1. **Kloning Repositori:**
   ```bash
   git clone https://github.com/dexccv/undangan.git
   cd undangan
   ```

2. **Instalasi Seluruh Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Kredensial Firebase:**
   Pastikan konfigurasi kunci pada `src/firebase.js` sesuai dengan proyek Google Firebase Anda:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Menjalankan Server Pengembangan Lokal:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan secara lokal pada alamat `http://localhost:5173`.

### Kompilasi Produksi

Untuk menghasilkan bundel produksi teroptimasi dan termodulasi:

```bash
npm run build
```

Hasil kompilasi siap diterapkan (*deploy*) pada direktori `dist/` menuju layanan hosting seperti Firebase Hosting, Vercel, Cloudflare Pages, atau Netlify.

---

## Standar Kualitas & Desain (Anti-Slop Standards)

Platform ini secara ketat mematuhi pedoman desain antarmuka bermutu tinggi:

1. **Bebas Karakter Emoji Mentah:** Seluruh visual indikator dan simbol navigasi menggunakan ikon berbasis vektor SVG dari `@phosphor-icons/react` untuk menjaga kesan mewah dan profesional.
2. **Keterbacaan Bahasa Awam:** Istilah teknis yang membingungkan orang awam telah digantikan dengan padanan bahasa Indonesia yang ramah (contoh: *Konfirmasi Kehadiran* menggantikan *RSVP*, *Nama Tautan* menggantikan *Slug/ID*, *Jumlah Hadir* menggantikan *Pax*).
3. **Kinerja Bebas Hambatan (Non-Blocking Performance):** Efek grafika latar Three.js dan tekstur noise dijalankan dengan isolasi `pointer-events: none` dan parameter memori terkontrol untuk menjaga kestabilan 60 FPS saat digulir pada layar ponsel.
4. **Ketahanan Tata Letak Seluler:** Menggunakan unit ketinggian dinamis (`min-height: 100dvh`) untuk mencegah pemotongan bilah navigasi peramban ponsel pada sistem iOS dan Android.

---

## Lisensi

Proyek ini dikembangkan secara eksklusif untuk kebutuhan Digitalisasi.id. Seluruh hak cipta dilindungi undang-undang.
