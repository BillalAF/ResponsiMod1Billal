# REST API Peminjaman Buku

## Deskripsi Umum

Proyek ini merupakan tugas responsi untuk modul Pembuatan API dengan JavaScript. API ini dibuat menggunakan Node.js dan Express.js, berfungsi untuk mengelola Perpustakaan

Tujuan utama proyek ini adalah untuk mempermudah proses pencatatan, pemantauan dari sebuah peminjaman buku.

## Tujuan

1. Mengimplementasikan konsep CRUD (Create, Read, Update, Delete) dalam REST API.
2. Meningkatkan pemahaman penggunaan Express.js sebagai framework backend.
3. Mengelola data menggunakan format JSON sebagai penyimpanan sederhana.
4. Membangun sistem pencatatan yang relevan dengan kebutuhan bisnis nyata.

## Fitur Utama API

| Metode | Endpoint   | Deskripsi                                                                 |
| ------ | ---------- | ------------------------------------------------------------------------  |
| GET    | /loans     | Menampilkan daftar peminjaman buku beserta filter status pencarian.       |
| POST   | /loans     | Menambahkan data sepatu baru ke dalam daftar.                             |
| PUT    | /loans/:id | Memperbarui data peminjaman buku seperti mengubah status menjadi RETURNED.|
| DELETE | /loans/:id | Menghapus data transaksi peminjaman buku dari sistem                      |

## Struktur Data

Contoh struktur data sepatu yang disimpan:

```
{
  "book_id": "d1402433-31da-477b-bd4d-2d9054b2d1c5",
  "member_id": "c322bd0d-f077-4701-ac61-ee1614838c59",
  "due_date": "2026-10-20",
  "status": "BORROWED"
}

```
dan berikut saat sudah di book maka hasil get dari /loans 
```
 "success": true,
  "message": "Berhasil mengambil semua data peminjaman",
  "total": 2,
  "data": [
    {
      "id": "de05044d-bb7d-4050-9b0c-a4b2c0219db0",
      "book_id": "d1402433-31da-477b-bd4d-2d9054b2d1c5",
      "member_id": "c322bd0d-f077-4701-ac61-ee1614838c59",
      "loan_date": "2026-10-10",
      "due_date": "2026-11-20",
      "return_date": null,
      "status": "BORROWED",
      "books": {
        "title": "Laut Bercerita"
      },
      "members": {
        "full_name": "Billal Ardi"
      }
    },
```
Keterangan:

- id → Nomor unik peminjaman
- book_id → Nomor unik buku
- member_id → Nomor unik member
- nama → Nama sepatu atau merek pelanggan
- status → Status peminjaman buku (BORROWED(dipinjam), RETURNED(dikembalikan), OVERDUE(melewati batas))
- loan_date → Tanggal sepatu dipinjam
- return_date → Tanggal buku harus di kembalikan

## Bonus Fitur

API ini juga dilengkapi dengan fitur filter berdasarkan status, misalnya:
GET /loans?status=BORROWED
akan menampilkan hanya sepatu yang sudah di pinjam.

## Alur Kerja API

1. Pengguna mengirimkan permintaan HTTP (GET, POST, PUT, DELETE) ke server.
2. Server memproses permintaan menggunakan Express.js.
3. Data peminjman disimpan atau diambil dari file items.json.
4. Server mengembalikan respons dalam format JSON.

## Teknologi yang Digunakan

- Node.js – runtime environment untuk menjalankan JavaScript di sisi server.
- Express.js – framework untuk membangun REST API dengan cepat dan sederhana.
- JSON – format data utama untuk pertukaran informasi antar sistem.
- Supabase - Sebagai DB untuk deploy
- Vercel - Sebagai server

## Hasil Akhir

Dengan adanya API ini, proses pengelolaan data peminjamam buku menjadi lebih mudah, terstruktur, dan dapat dikembangkan ke sistem front-end di masa depan, seperti dashboard berbasis web atau aplikasi mobile.
API ini juga dapat dikembangkan lebih lanjut dengan menambahkan database seperti MongoDB atau Supabase untuk penyimpanan data yang lebih kompleks.

## Contoh Request dan Response

GET /loans

Response:

```
{
  "success": true,
  "message": "Berhasil mengambil semua data peminjaman",
  "total": 2,
  "data": [
    {
      "id": "de05044d-bb7d-4050-9b0c-a4b2c0219db0",
      "book_id": "d1402433-31da-477b-bd4d-2d9054b2d1c5",
      "member_id": "c322bd0d-f077-4701-ac61-ee1614838c59",
      "loan_date": "2026-10-10",
      "due_date": "2026-11-20",
      "return_date": null,
      "status": "BORROWED",
      "books": {
        "title": "Laut Bercerita"
      },
      "members": {
        "full_name": "Billal Ardi"
      }
    },
    {
      "id": "fcde7e9f-0b27-46c7-af37-b323c688df64",
      "book_id": "d1402433-31da-477b-bd4d-2d9054b2d1c5",
      "member_id": "c322bd0d-f077-4701-ac61-ee1614838c59",
      "loan_date": "2026-10-10",
      "due_date": "2026-11-10",
      "return_date": null,
      "status": "RETURNED",
      "books": {
        "title": "Laut Bercerita"
      },
      "members": {
        "full_name": "Billal Ardi"
      }
    }
  ]
}
```

Body:
POST /loans

```
{
  "book_id": "d1402433-31da-477b-bd4d-2d9054b2d1c5",
  "member_id": "c322bd0d-f077-4701-ac61-ee1614838c59",
  "due_date": "2026-10-20",
  "status": "BORROWED"
}
```

Response:

```
{
"message": "Data sepatu berhasil ditambahkan."{
  "success": true,
  "message": "Data peminjaman berhasil dibuat!",
  "data": {
    "id": "fcde7e9f-0b27-46c7-af37-b323c688df64",
    "book_id": "d1402433-31da-477b-bd4d-2d9054b2d1c5",
    "member_id": "c322bd0d-f077-4701-ac61-ee1614838c59",
    "loan_date": "2026-10-10",
    "due_date": "2026-11-10",
    "return_date": null,
    "status": "RETURNED"}

```

PUT /loans/:id
Body:

```
{
"status": "OVERDUE",
"return_date": "2026-11-10"
}
```

```
{
  "success": true,
  "message": "Data peminjaman berhasil diperbarui!",
  "data": {
    "id": "fcde7e9f-0b27-46c7-af37-b323c688df64",
    "book_id": "d1402433-31da-477b-bd4d-2d9054b2d1c5",
    "member_id": "c322bd0d-f077-4701-ac61-ee1614838c59",
    "loan_date": "2026-10-10",
    "due_date": "2026-11-10",
    "return_date": "2026-11-10",
    "status": "OVERDUE"
  }
}
```

DELETE /items/:id
Response:

```
{
  "success": true,
  "message": "Data peminjaman berhasil dihapus!",
  "data": {
    "id": "de05044d-bb7d-4050-9b0c-a4b2c0219db0",
    "book_id": "d1402433-31da-477b-bd4d-2d9054b2d1c5",
    "member_id": "c322bd0d-f077-4701-ac61-ee1614838c59",
    "loan_date": "2026-10-10",
    "due_date": "2026-11-20",
    "return_date": null,
    "status": "BORROWED"
  }
}
```
