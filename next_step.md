# Langkah Selanjutnya (Next Steps)
## Rencana Kerja Pengembangan Web Pendaftaran BoC 2026

Berikut adalah langkah-langkah konkret yang akan kita lakukan setelah rancangan ini disetujui:

### 1. Desain Ulang UI & Sistem Warna (Theme Implementation)
*   Mengonfigurasi variabel warna di [globals.css](file:///d:/GITHUB/Project/web-pendaftaran-boc/app/globals.css) (Merah: `#700702`, Biru: `#002D61`, Krem: `#FFF6E9`).
*   Mengubah skema warna pada seluruh komponen landing page (Hero, About, Game Concept, Timeline, FAQ, Contact) dari model gelap/dark-zinc ke nuansa krem-biru-merah yang premium dan responsif.

### 2. Form Input Pendaftaran & Upload Gambar ke Google Drive
*   Membuat field input berkas sesuai dengan dokumen [daftar form input.md](file:///d:/GITHUB/Project/web-pendaftaran-boc/Resource/daftar%20form%20input.md).
*   Menambahkan logika Javascript untuk mengonversi gambar ke base64 (atau form-data) di sisi client agar bisa diunggah via Google Drive API (Google Apps Script).
*   Mengonfigurasi payload upload ke Apps Script agar disimpan langsung di Drive developer/admin (`abelekaputra05@gmail.com`).

### 3. Dashboard Admin & Fitur Validasi Pendaftaran
*   Membuat route baru `/admin` (atau `/admin/dashboard`) yang diproteksi menggunakan NextAuth.
*   Membatasi hak akses dashboard tersebut hanya untuk user admin dengan email `abelekaputra05@gmail.com`.
*   Menampilkan data pendaftar, menampilkan pratinjau (preview) foto-foto berkas dari Google Drive, dan menyediakan tombol untuk mengubah status pendaftaran peserta menjadi **"Valid"**.

### 4. Pengujian & Demo
*   Melakukan registrasi simulasi dengan data lengkap dan berkas gambar.
*   Masuk sebagai admin untuk memvalidasi pendaftaran dan memastikan statusnya ter-update di Google Sheets backend.
