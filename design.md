# Desain Website Undangan Pernikahan - Inspirasi dari mehnikah.com

## 1. Gambaran Umum
Website undangan pernikahan digital yang elegan, romantis, dan modern. Halaman tunggal (single page) dengan efek scroll halus, animasi sederhana, serta personalisasi nama tamu dari parameter URL (contoh: `?to=NamaTamu`).

## 2. Target Pengguna
- Pengantin: mengirimkan tautan ke tamu.
- Tamu: membuka di ponsel/desktop, melihat info acara, mengirim ucapan & konfirmasi kehadiran.

## 3. Palet Warna
- Warna Utama: `#FDF5F0` (krem lembut)
- Warna Sekunder: `#D4A5A5` (dusty rose)
- Aksen: `#A67C6B` (coklat muda hangat)
- Teks: `#4A3B32` (coklat gelap)
- Teks Muda: `#7F6A5C`
- Latar Footer: `#2E2A28` (hitam kecoklatan)

## 4. Tipografi
- Font Utama (heading): "Playfair Display" (serif, elegan)
- Font Teks: "Poppins" atau "Montserrat" (sans-serif, modern, mudah dibaca)
- Font dekoratif (opsional): "Great Vibes" untuk nama pengantin.

## 5. Struktur Halaman (urutan scroll)
1. **Cover / Pembuka**  
   - Latar belakang gradien atau foto samar dengan overlay.  
   - Ucapan "The Wedding of" + Nama Pengantin Pria & Wanita.  
   - Tombol "Buka Undangan" (smooth scroll ke section berikutnya).  
   - Parameter nama tamu ditampilkan di sini (contoh: "Kepada, Bapak/Ibu Zoya").

2. **Countdown & Informasi Acara**  
   - Hitung mundur menuju hari pernikahan (jam, hari, menit, detik).  
   - Tanggal & waktu akad dan resepsi.  
   - Nama tempat, alamat lengkap, link Google Maps.

3. **Kisah Kami (Our Story)**  
   - Garis waktu singkat (bertemu, lamaran, pernikahan).  
   - Masing-masing dengan ilustrasi atau foto kecil.

4. **Galeri Momen**  
   - Grid foto (3-6 foto) dengan efek lightbox saat diklik.

5. **Kirim Doa & Ucapan (Buku Tamu)**  
   - Form: Nama, Ucapan.  
   - Tombol kirim (data disimpan ke database atau local storage sementara).  
   - Tampilkan beberapa ucapan terbaru.

6. **Konfirmasi Kehadiran (RSVP)**  
   - Form: Nama, jumlah hadir, pilihan hadir/tidak hadir.  
   - Tombol konfirmasi.

7. **Hadiah Digital (Amplop Online)**  
   - Teks singkat: "Doa Restu adalah yang terpenting, namun jika ingin memberi tanda kasih..."  
   - Daftar nomor rekening (BCA, Mandiri, dll) atau link saweria.

8. **Penutup & Musik Latar**  
   - Ucapan terima kasih.  
   - Tombol play/pause musik (embedded YouTube atau file MP3).  
   - Footer dengan hak cipta.

## 6. Komponen Interaktif
- **Parameter URL** (`?to=Nama`) → sapaan otomatis di cover.
- **Countdown timer** menggunakan JavaScript tanggal target.
- **Tombol salin** nomor rekening (copy to clipboard).
- **Konfetti** kecil saat pertama kali membuka undangan (opsional).
- **Animasi scroll** (fade-in, slide-up) menggunakan CSS atau library AOS.

## 7. Responsivitas
- Mobile-first (lebar konten maksimal 500px di ponsel).  
- Pada desktop, konten dibatasi lebar 800px + margin auto, dengan latar belakang penuh.  
- Grid galeri: 1 kolom di ponsel, 2-3 kolom di tablet/desktop.

## 8. Teknologi yang Digunakan
- HTML5, CSS3 (flexbox/grid), JavaScript native.  
- Font Google Fonts.  
- Font Awesome 6 (ikon).  
- (Opsional) AOS.js untuk animasi, SweetAlert untuk notifikasi.

## 9. Struktur File (opsional)
/index.html
/style.css
/script.js
/assets/foto1.jpg
/assets/musik.mp3