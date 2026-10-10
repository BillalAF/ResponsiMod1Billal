-- ========================================================
-- SKEMA DATABASE SUPABASE (MENGGUNAKAN UUID)
-- Salin dan jalankan seluruh query ini di Supabase SQL Editor
-- jika ingin mereset atau mengisi data awal
-- ========================================================

-- 1. Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Buat tabel members jika belum ada
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  member_type VARCHAR(50) DEFAULT 'Mahasiswa',
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Buat tabel books jika belum ada
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  isbn VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  total_copies INT DEFAULT 5,
  available_copies INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Buat tabel loans jika belum ada
CREATE TABLE IF NOT EXISTS loans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  loan_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  status VARCHAR(50) DEFAULT 'Dipinjam',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matikan Row Level Security (RLS) agar bisa diakses langsung lewat REST API lokal
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE loans DISABLE ROW LEVEL SECURITY;

-- 5. Masukkan Data Sampel Buku & Anggota (jika belum ada)
INSERT INTO members (full_name, email, member_type) VALUES
('Budi Santoso', 'budi@example.com', 'Mahasiswa'),
('Siti Rahma', 'siti@example.com', 'Dosen')
ON CONFLICT (email) DO NOTHING;

INSERT INTO books (isbn, title, total_copies, available_copies) VALUES
('978-602-03-8594-5', 'Struktur Data dan Algoritma', 5, 4),
('978-602-03-8595-2', 'Pemrograman Berorientasi Objek', 3, 2);

-- 6. Masukkan contoh transaksi peminjaman (mengambil UUID buku & member secara otomatis)
DO $$
DECLARE
  v_book_id UUID;
  v_member_id UUID;
BEGIN
  SELECT id INTO v_book_id FROM books LIMIT 1;
  SELECT id INTO v_member_id FROM members LIMIT 1;

  IF v_book_id IS NOT NULL AND v_member_id IS NOT NULL THEN
    -- Contoh data peminjaman berstatus "Terlambat"
    INSERT INTO loans (book_id, member_id, loan_date, due_date, status)
    VALUES (v_book_id, v_member_id, '2026-09-01', '2026-09-08', 'Terlambat');

    -- Contoh data peminjaman berstatus "Dipinjam"
    INSERT INTO loans (book_id, member_id, loan_date, due_date, status)
    VALUES (v_book_id, v_member_id, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'Dipinjam');
  END IF;
END $$;
