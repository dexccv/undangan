# Platform Undangan Digital & Panel Pengelola (Digitalisasi.id)

Platform aplikasi web undangan pernikahan digital berbasis React dan Vite dengan arsitektur multi-tenant dinamis, animasi panggung interaktif (GSAP & Three.js), sistem manajemen konten mandiri (CMS Developer Dashboard), pemutar musik hybrid (Upload Audio & YouTube Link), integrasi Google Firebase (Firestore, Storage, Authentication), serta generator tautan pengiriman massal WhatsApp.

---

## Daftar Isi

- [Ikhtisar Arsitektur](#ikhtisar-arsitektur)
- [Pembaruan dan Fitur Utama](#pembaruan-dan-fitur-utama)
  - [1. Pengalaman Tamu Undangan (Guest Experience)](#1-pengalaman-tamu-undangan-guest-experience)
  - [2. Mesin Musik Latar Hybrid (Audio Upload & YouTube)](#2-mesin-musik-latar-hybrid-audio-upload--youtube)
  - [3. Halaman Utama Berkedalaman Visual (Landing Page)](#3-halaman-utama-berkedalaman-visual-landing-page)
  - [4. Panel Pengelola Komprehensif (Developer Dashboard)](#4-panel-pengelola-komprehensif-developer-dashboard)
  - [5. Sistem Manajemen Pesanan & Smart Chat Parser](#5-sistem-manajemen-pesanan--smart-chat-parser)
- [Tumpukan Teknologi (Tech Stack)](#tumpukan-teknologi-tech-stack)
- [Struktur Direktori Proyek](#struktur-direktori-proyek)
- [Struktur Database & Penyimpanan Berkas](#struktur-database--penyimpanan-berkas)
  - [Cloud Firestore (NoSQL Database)](#cloud-firestore-nosql-database)
  - [Firebase Storage (Penyimpanan Berkas Gambar & Audio)](#firebase-storage-penyimpanan-berkas-gambar--audio)
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
- `/`: Membuka halaman utama (*Landing Page*) pemasaran publik dan alur pemesanan paket undangan.

---

## Pembaruan dan Fitur Utama

### 1. Pengalaman Tamu Undangan (Guest Experience)

- **Animasi Tirai Teatrikal (Curtain Reveal):** Tirai ganda pembuka berskala penuh yang dianimasikan menggunakan GreenSock (GSAP) dengan aksen belahan emas dan tombol pembuka interaktif sebelum memasuki halaman utama undangan.
- **Personalisasi Tamu Dinamis:** Kartu sampul secara otomatis membaca parameter URL `to` dan menampilkan nama tamu terhormat secara presisi.
- **Kisah Perjalanan Cinta Dinamis (Love Story Milestones):** Rangkaian tonggak sejarah pertemuan dan komitmen pasangan yang dirender dinamis dari koleksi dokumen database, lengkap dengan foto pendukung, tahun, dan uraian naratif.
- **Galeri Foto Prewedding Bento & Modal Lightbox:** Susunan tata letak bento grid responsif dengan fitur perbesaran foto (*modal lightbox zoom*).
- **Konfirmasi Kehadiran & Buku Doa Restu Real-Time:** Formulir pencatatan kehadiran tamu dan ucapan doa restu yang tersinkronisasi langsung ke sub-koleksi Cloud Firestore secara seketika (*real-time listener*).
- **Amplop Digital & Salin Rekening:** Fasilitas transfer hadiah pernikahan nontunai dengan fungsi salin nomor rekening bank dalam satu kali klik beserta notifikasi toast.
- **Petunjuk Lokasi & Integrasi Google Maps:** Peta digital dan tombol navigasi langsung menuju lokasi akad nikah dan resepsi.

---

### 2. Mesin Musik Latar Hybrid (Audio Upload & YouTube)

- **Dukungan Ganda (Hybrid Audio Engine):**
  - **Berkas Audio:** Memutar berkas audio lokal maupun cloud (`.mp3`, `.wav`, `.m4a`, `.ogg`) dengan *looping* mulus menggunakan HTML5 Audio API.
  - **Tautan YouTube:** Memutar video/lagu dari tautan YouTube apa saja (`youtube.com/watch`, `youtu.be`, `music.youtube.com`, `shorts`) di latar belakang menggunakan *YouTube IFrame Player API* tanpa mengganggu visual layar.
- **Otomasi Pemutaran:** Musik otomatis mulai diputar secara lembut seketika tamu menekan tombol **"Buka Undangan"** pada tirai awal.
- **Floating Vinyl Player ([MusicPlayer.jsx](file:///d:/PROJECT/undangan-main/src/components/MusicPlayer.jsx)):** Tombol piringan hitam (*vinyl disc*) melayang dengan animasi putaran kontinu saat musik aktif, dilengkapi tombol jeda/putar dan *info pill* judul lagu serta artis.

---

### 3. Halaman Utama Berkedalaman Visual (Landing Page)

- **Multi-Layer Atmospheric Depth:** Latar belakang bertingkat yang menggabungkan rona dasar *Warm Champagne Ivory*, dua bola pencahayaan *ambient aura mesh* (Emas & Sage lembut), garis kisi arsitektural (*architectural grid lines* 64px), serta lapisan tekstur mikro kertas (*tactile film grain* SVG data-URI) tanpa membebani kartu grafis (GPU).
- **Floating Titanium Smartphone Showcase:** Area hero editorial split dua kolom yang memuat tiruan ponsel pintar titanium tiga dimensi dengan takik dinamis (*dynamic island*), pratinjau kartu undangan langsung, dan dua lencana mengambang (*live confirmation pulse* dan *music status*).
- **Double-Bezel Card Architecture:** Kartu fitur dan paket harga (Silver, Gold Imperial, Royal Platinum) mengadopsi konstruksi bingkai berlapis dengan sorotan cahaya dalam (*inset highlight*).
- **Alur Pemesanan Interaktif:**
  - Formulir rincian pengantin, tanggal acara, lokasi, hingga judul lagu yang diinginkan.
  - Tampilan instruksi pembayaran QRIS otomatis.
  - Pengunggahan bukti transfer pembayaran.
  - Tombol pengarah langsung ke kontak WhatsApp Developer (`081225589199`).

---

### 4. Panel Pengelola Komprehensif (Developer Dashboard)

- **Arsitektur Modular & Ringan:** Kode panel pengelola diorganisasikan secara terstruktur ke dalam sub-komponen fungsional pada direktori `src/components/dev/` untuk mencegah *re-render* berlebih dan memudahkan pemeliharaan:
  - `DevOrdersView.jsx`: Pengelolaan antrean pesanan masuk, pencarian cepat, filter kategori, dan metrik KPI.
  - `DevCouplesList.jsx`: Manajemen daftar pasangan dengan tabel presisi di desktop dan kartu adaptif di mobile.
  - `DevEditorView.jsx`: Formulir penyuntingan 9 modul undangan dengan bilah sub-tab melayang (*sticky chips*) dan preset paket.
  - `DevBlastView.jsx`: Generator tautan tamu personal, pengimpor file Excel/CSV, dan pratinjau pesan WhatsApp.
  - `DevSmartParserModal.jsx`: Modal ekstraktor cerdas dari format teks obrolan WhatsApp.
- **Keamanan Autentikasi Admin:** Dilindungi gerbang masuk Firebase Authentication dengan enkripsi kata sandi dan opsi bypass pengembang lokal (*Dev Mode*).
- **Executive Topbar & Status Sistem:** Bilah status atas real-time yang memantau konektivitas server, jumlah pasangan terdaftar, dan indikator lencana pesanan baru masuk.
- **Ergonomi Seluler Terpadu (Mobile-First UI/UX):**
  - **Navigasi Tunggal Bawah (Fixed Bottom Nav):** Menghilangkan navigasi tab ganda di bagian atas mobile, memusatkan alur navigasi pada 4 tombol ergonomis di bawah layar (`Pesanan`, `Undangan`, `Editor`, `Blast WA`).
  - **Metrik Mini 3-Kolom:** Kartu statistik pesanan dirancang kompak sejajar pada layar ponsel, menghemat lebih dari 300px ruang vertikal.
  - **Kartu Undangan Responsif:** Pada layar `< 768px`, tabel desktop otomatis bertransformasi menjadi kartu seluler lengkap dengan tombol aksi sentuh lega (**≥44px**) dan salin tautan 1-klik tanpa pemotongan ke samping (*zero horizontal overflow*).
- **Editor Data Pasangan (9 Sub-Bagian Terstruktur):**
  1. *Profil Mempelai:* Data nama lengkap, nama panggilan, orang tua, akun media sosial, serta kutipan doa dan sumber ayat.
  2. *Jadwal Acara:* Waktu, tanggal, dan alamat presisi prosesi akad nikah serta resepsi pernikahan.
  3. *Foto & Media:* Slot pengunggahan gambar resolusi tinggi untuk sampul, tirai, sambutan, mempelai, tempat acara, dan penutup.
  4. *Musik & Lagu Latar:* Pilihan sumber musik (unggah MP3, tautan YouTube dengan pengambil metadata otomatis, atau lagu preset bawaan) beserta pemutar uji coba audio langsung.
  5. *Perjalanan Kisah Cinta:* Manajemen fase cerita lengkap dengan foto kenangan, tahun, judul, dan uraian narasi.
  6. *Galeri Foto Prewedding:* Album foto prewedding dinamis dengan takarir (*caption*) dan integrasi Firebase Storage.
  7. *Rekening & Hadiah:* Rekening bank mempelai, dompet digital, nama penerima kado fisik, dan alamat kirim.
  8. *Pratinjau Layar (Responsive Device Frame):* Uji coba tampilan undangan langsung dalam bingkai realistis Ponsel (390px dengan takik ponsel), Tablet (768px), atau Komputer Desktop (100%), lengkap dengan simulasi nama tamu.
  9. *Kehadiran & Doa Tamu:* Pemantauan daftar konfirmasi kehadiran tamu (Hadir/Tidak Hadir, jumlah orang) dan buku doa restu.
- **Floating Save Action Bar Aman:** Bilah simpan melayang dengan bantalan area aman (*safe-area bottom padding*) yang mencegah tombol terhalang oleh bilah navigasi seluler.

---

### 5. Sistem Manajemen Pesanan, WhatsApp Blast & Smart Parser

- **Antrean Pesanan Masuk & Pencarian Instan:** Menampilkan pesanan paket dari Landing Page secara real-time, dilengkapi kolom pencarian instan berdasarkan nama mempelai, nomor telepon, atau paket.
- **Peninjau Bukti Transfer QRIS:** Membuka bukti pembayaran dalam jendela modal pop-up interaktif dengan opsi perbesaran gambar atau penggantian foto bukti.
- **Konversi Pesanan Satu Klik:** Tombol *"Buat Undangan dari Pesanan Ini"* yang langsung memetakan seluruh data pesanan pelanggan ke formulir editor undangan secara otomatis.
- **Impor Tamu Massal dari Excel / CSV:** Fitur pengunggahan berkas spreadsheet (`.xlsx`, `.xls`, `.csv`) pada modul WhatsApp Blast yang secara cerdas mendeteksi kolom Nama dan Nomor Telepon untuk memuat ratusan tamu sekaligus.
- **Bilah Penyisip Variabel Pesan 1-Klik:** Tombol pintas `[+ {nama_tamu}]` dan `[+ {link}]` untuk menyisipkan variabel tautan ke posisi kursor pada template pesan WhatsApp.
- **Simulasi Gelembung Chat WhatsApp (Live Bubble Preview):** Kotak pratinjau visual hijau WhatsApp yang memperlihatkan contoh pesan yang akan diterima oleh tamu undangan sebelum dikirimkan.
- **Smart Chat Parser:** Fasilitas cerdas bertenaga regex untuk menyalin teks rincian pernikahan dari obrolan WhatsApp calon pengantin dan mengekstrak nama mempelai, orang tua, tanggal, lokasi, serta rekening ke kolom formulir secara otomatis.
- **Ekspor Data ke Microsoft Excel:** Kemampuan mengekspor seluruh daftar konfirmasi kehadiran dan ucapan doa tamu ke format file `.xlsx` menggunakan SheetJS.

---

## Tumpukan Teknologi (Tech Stack)

| Kategori | Teknologi / Pustaka | Deskripsi Fungsi |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 / React DOM | Pembangunan UI modular berbasis komponen fungsional |
| **Build Tooling** | Vite 8 | Kompilasi kilat modul ES dan optimasi bundel produksi |
| **Animasi & Interaksi** | GSAP (GreenSock) | Animasi pembukaan tirai teater berpresisi tinggi |
| **Grafika 3D Ambient** | Three.js | Cincin geometri ambient dan partikel debu halus |
| **Backend & Basis Data** | Google Cloud Firestore | Basis data NoSQL dokumen untuk pasangan, pesanan, tamu, dan doa |
| **Penyimpanan Berkas** | Google Firebase Storage | Penyimpanan berkas foto dan audio resolusi tinggi terenkripsi |
| **Autentikasi** | Google Firebase Auth | Manajemen sesi login pengelola panel |
| **Mesin Audio Hybrid** | HTML5 Audio & YouTube IFrame API | Pemutaran musik latar mulus dari berkas lokal atau YouTube |
| **Ikonografi** | @phosphor-icons/react | Seluruh ikon grafis konsisten tanpa emoji mentah |
| **Olah Data Spreadsheet**| SheetJS (xlsx) | Impor daftar tamu dari Excel dan ekspor data RSVP ke `.xlsx` |
| **Notifikasi Dialog** | SweetAlert2 | Modal konfirmasi dan notifikasi status interaktif |
| **Efek Visual Partikel** | canvas-confetti | Hamburan konfeti saat tamu membuka tirai undangan |

---

## Struktur Direktori Proyek

```text
undangan-main/
├── public/
│   ├── assets/                 # Berkas gambar statis, foto mempelai, musik mp3, dan ikon
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── CurtainReveal.jsx   # Komponen tirai pembuka megah (GSAP & Confetti)
│   │   ├── CurtainReveal.css   # Lembar gaya tirai teater dan efek shimmer
│   │   ├── DevDashboard.jsx    # Orchestrator utama panel pengelola (Executive Studio)
│   │   ├── DevDashboard.css    # Lembar gaya studio pengelola, responsivitas, & kartu
│   │   ├── dev/                # Sub-komponen modular panel pengelola
│   │   │   ├── DevOrdersView.jsx      # Antrean pesanan masuk, metrik KPI, & filter
│   │   │   ├── DevCouplesList.jsx     # Daftar undangan (tabel desktop & kartu mobile)
│   │   │   ├── DevEditorView.jsx      # Editor 9 tab, preset paket, & save bar aman
│   │   │   ├── DevBlastView.jsx       # WhatsApp blast, impor Excel, & bubble preview
│   │   │   └── DevSmartParserModal.jsx# Ekstraktor cerdas teks obrolan WhatsApp
│   │   ├── LandingPage.jsx     # Halaman depan editorial dengan showcase mockup ponsel & form order
│   │   ├── LandingPage.css     # Gaya ambient aura mesh, kisi arsitektur, dan film grain
│   │   ├── ThreeScene.jsx      # Lapisan latar grafika Three.js ambient
│   │   ├── MusicPlayer.jsx     # Pemutar vinyl melayang dengan info pill lagu
│   │   ├── Cover.jsx           # Bagian sampul utama undangan
│   │   ├── Quotes.jsx          # Bagian kutipan doa dan ayat suci
│   │   ├── Parents.jsx         # Profil kedua mempelai dan orang tua
│   │   ├── CountdownAndEvents.jsx # Jadwal akad, resepsi, dan hitung mundur
│   │   ├── Story.jsx           # Rangkaian linimasa kisah perjalanan cinta
│   │   ├── Gallery.jsx         # Galeri foto prewedding bento grid & lightbox
│   │   ├── RSVP.jsx            # Formulir konfirmasi kehadiran tamu
│   │   ├── Guestbook.jsx       # Buku doa restu tamu undangan
│   │   ├── Gift.jsx            # Amplop digital dan alamat pengiriman kado
│   │   ├── Closing.jsx         # Penutup undangan dan ungkapan terima kasih
│   │   └── ui/                 # Komponen antarmuka pembantu (ScrollReveal, Skeleton)
│   ├── context/
│   │   ├── MusicContext.jsx    # Mesin musik global (HTML5 Audio + YouTube IFrame API)
│   │   └── ToastContext.jsx    # State global antrean notifikasi toast
│   ├── firebase.js             # Inisialisasi Firebase App, Firestore, Auth, Storage
│   ├── App.jsx                 # Pengatur rute URL parameter & pemanggilan data
│   ├── App.css                 # Gaya umum tampilan tema undangan Ivory & Gold
│   ├── index.css               # Variabel CSS global, reset browser, dan tipografi
│   └── main.jsx                # Titik masuk utama aplikasi React
├── index.html                  # Berkas HTML utama Vite
├── vite.config.js              # Konfigurasi Vite
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
  ├── quote_text: string
  ├── quote_teks: string
  ├── quote_source: string
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
  ├── fitur_musik: boolean
  ├── musik_tipe: string ("upload" | "youtube" | "preset")
  ├── musik_url: string
  ├── judul_lagu: string
  ├── penyanyi_lagu: string
  ├── paket_pesanan: string
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

orders/ {orderId}
  ├── id: string
  ├── customer_name: string
  ├── customer_phone: string
  ├── bride_name: string
  ├── groom_name: string
  ├── package_name: string
  ├── package_price: number
  ├── event_date: string
  ├── event_location: string
  ├── song_title: string
  ├── payment_proof: string (URL Storage)
  ├── status: string ("pending" | "processing" | "completed")
  └── created_at: timestamp
```

### Firebase Storage (Penyimpanan Berkas Gambar & Audio)

Berkas foto dan audio yang diunggah melalui panel kendali disimpan pada bucket penyimpanan Firebase dengan skema hierarki berikut:

```text
couples/
  └── {coupleId}/
        ├── audio_{timestamp}_{filename}.mp3   # Berkas lagu latar
        ├── cover_{timestamp}_{filename}.jpg   # Foto sampul utama
        ├── story_{index}_{timestamp}_{filename}.jpg # Foto linimasa kisah cinta
        └── gallery_{index}_{timestamp}_{filename}.jpg # Foto album prewedding

payment_proofs/
  └── proof_{timestamp}_{filename}.jpg         # Bukti transfer pembayaran pesanan
```

---

## Panduan Instalasi & Pengembangan Lokal

### Prasyarat

- Node.js versi 18.0 atau lebih tinggi
- Pengelola paket `npm` atau `pnpm`
- Peramban web modern yang mendukung WebGL, HTML5 Audio, dan CSS Backdrop Filter

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
2. **Keterbacaan Bahasa Awam:** Istilah teknis digantikan dengan padanan bahasa Indonesia yang ramah (contoh: *Konfirmasi Kehadiran* menggantikan *RSVP*, *Nama Tautan* menggantikan *Slug/ID*, *Jumlah Hadir* menggantikan *Pax*).
3. **Kinerja Bebas Hambatan (Non-Blocking Performance):** Efek grafika latar Three.js dan tekstur noise dijalankan dengan isolasi `pointer-events: none` dan parameter memori terkontrol untuk menjaga kestabilan 60 FPS saat digulir pada layar ponsel.
4. **Ketahanan Tata Letak Seluler:** Menggunakan unit ketinggian dinamis (`min-height: 100dvh`) dan penanganan *overflow* fleksibel untuk mencegah pemotongan bilah navigasi peramban ponsel pada sistem iOS dan Android.
5. **Sanitasi Data Anti-Crash:** Seluruh mutasi dokumen ke Cloud Firestore dilengkapi filter sanitasi data otomatis untuk mencegah terkirimnya nilai `undefined` yang dapat memicu eror server.

---

## Lisensi

Proyek ini dikembangkan secara eksklusif untuk kebutuhan Digitalisasi.id. Seluruh hak cipta dilindungi undang-undang.
