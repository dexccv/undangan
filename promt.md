# PROMPT LENGKAP UNTUK MEMBUAT WEBSITE UNDANGAN PERNIKAHAN

Salin prompt di bawah ini ke AI coding assistant (seperti ChatGPT, Claude, atau Cursor) untuk menghasilkan kode website yang lengkap.

---

## PROMPT (AWALI DENGAN INI):

Buatkan kode HTML, CSS, dan JavaScript untuk website undangan pernikahan satu halaman (single page) dengan spesifikasi berikut:

1. **Personalisasi nama tamu** dari parameter URL `?to=Nama`. Jika tidak ada, tampilkan default "Tamu Undangan". Contoh URL: `index.html?to=Zoya`. Tampilkan sapaan "Kepada Yth. [Nama]" di halaman pembuka.

2. **Halaman cover**:
   - Latar belakang gradien lembut (cream ke dusty rose) atau gambar bunga samar.
   - Tulisan "The Wedding of" dengan font serif.
   - Nama pengantin: "Ahmad & Fatimah" (bisa diganti nanti).
   - Tombol "Buka Undangan" yang jika diklik akan smooth scroll ke bagian countdown.

3. **Countdown timer**:
   - Target tanggal: 25 Desember 2025, pukul 09:00 WIB.
   - Tampilkan hari, jam, menit, detik secara real-time.

4. **Informasi acara**:
   - Akad nikah: 25 Desember 2025, 09:00 - 10:00 WIB.
   - Resepsi: 25 Desember 2025, 11:00 - 15:00 WIB.
   - Lokasi: "Gedung Melati, Jl. Kenangan No. 10, Jakarta Selatan".
   - Tombol "Buka Google Maps" dengan link ke maps.

5. **Kisah Kami**:
   - 3 timeline: "Bertemu (2020)", "Lamaran (2024)", "Pernikahan (2025)".
   - Setiap timeline dengan deskripsi singkat dan ikon.

6. **Galeri foto** (placeholder):
   - Tampilkan 4 foto dengan grid.
   - Saat foto diklik, muncul lightbox (gambar besar).

7. **Form Buku Tamu & RSVP dalam satu bagian**:
   - Form memiliki: Nama lengkap, Ucapan/Doa, Pilihan hadir (Hadir/Tidak Hadir), Jumlah tamu yang ikut (number, min=1, max=10).
   - Tombol "Kirim" menampilkan alert "Terima kasih, [Nama]! Ucapan & konfirmasi Anda telah tersimpan." (tidak perlu database nyata, cukup simulasi dengan localStorage atau alert).
   - Tampilkan beberapa contoh ucapan statis di bawah form.

8. **Hadiah digital**:
   - Menampilkan 2 rekening (BCA: 1234567890 a.n. Ahmad, Mandiri: 9876543210 a.n. Fatimah).
   - Setiap rekening dilengkapi tombol "Salin nomor" (copy ke clipboard dengan notifikasi).

9. **Musik latar**:
   - Tombol play/pause (ikon) di pojok kanan bawah.
   - Musik bisa menggunakan file embed dari YouTube (gunakan iframe tersembunyi) atau file MP3 contoh "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3". Boleh menggunakan link dummy.

10. **Efek & animasi**:
    - Animasi fade-in saat scroll (gunakan CSS `@keyframes` atau library sederhana).
    - Konfetti kecil saat halaman pertama kali di-load (gunakan library canvas-confetti dari CDN).
    - Tombol "Buka Undangan" dengan efek hover.

11. **Responsif**:
    - Tampilan optimal di ponsel (max-width 600px) dan desktop.
    - Font size, padding, margin menyesuaikan.

12. **Footer**:
    - Tulisan "© 2025 - Undangan Pernikahan Digital" dan ikon hati.

---

## NEGATIVE PROMPT (LARANGAN YANG HARUS DIPATUHI):

Jangan lakukan atau gunakan hal-hal berikut dalam kode:

- ❌ Jangan gunakan framework berat (React, Vue, Angular). Cukup HTML, CSS, vanilla JS.
- ❌ Jangan gunakan jQuery.
- ❌ Jangan tambahkan background video otomatis yang berat.
- ❌ Jangan gunakan gambar dengan lisensi tidak jelas (gunakan placeholder unsplash atau gambar lokal dummy).
- ❌ Jangan buat navigasi multi halaman (cukup satu halaman dengan scroll).
- ❌ Jangan menyertakan pop-up iklan atau alert yang mengganggu selain notifikasi sukses.
- ❌ Jangan meminta akses lokasi atau kamera tanpa izin eksplisit.
- ❌ Jangan menggunakan efek suara selain musik latar yang dikontrol tombol.
- ❌ Jangan membuat countdown yang tidak akurat (pastikan menggunakan JavaScript Date).
- ❌ Jangan gunakan inline styles berlebihan; gunakan file CSS terpisah atau <style> di head.
- ❌ Jangan abaikan aksesibilitas (pastikan ada kontras warna yang cukup dan atribut alt pada gambar).
- ❌ Jangan tambahkan form yang mengirim data ke server eksternal tanpa persetujuan (cukup simulasi local).

---

## FORMAT OUTPUT YANG DIINGINKAN:

Berikan kode dalam satu file HTML lengkap (embed CSS dan JS di dalamnya) yang dapat langsung disimpan sebagai `index.html` dan dibuka di browser. Sertakan komentar pada bagian penting.

---

## CATATAN TAMBAHAN UNTUK AI:

- Gunakan Google Fonts: 'Playfair Display', 'Poppins', dan 'Great Vibes' (opsional).
- Gunakan Font Awesome 6 (gratis) melalui CDN untuk ikon.
- Gunakan CDN canvas-confetti: `https://cdn.jsdelivr.net/npm/canvas-confetti@1`.
- Untuk lightbox sederhana, buat sendiri dengan JavaScript (tanpa library eksternal).
- Pastikan parameter URL `?to=...` dibaca dan ditampilkan dengan aman (hindari XSS).
- Untuk contoh ucapan statis, buat array berisi 2-3 ucapan contoh.
- Timer countdown harus terus berjalan setiap detik.
- Semua teks (nama pengantin, tanggal, rekening) bisa di-hardcode sesuai contoh di atas.