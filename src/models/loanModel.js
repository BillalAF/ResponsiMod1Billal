import { supabase } from '../config/supabase.js';

// Normalisasi nilai status agar cocok dengan check constraint database
function normalizeStatusForDB(status) {
  if (!status) return undefined;
  const s = String(status).trim().toLowerCase();
  if (s === 'dipinjam' || s === 'borrowed') return 'BORROWED';
  if (s === 'kembali' || s === 'returned') return 'RETURNED';
  if (s === 'terlambat' || s === 'overdue') return 'OVERDUE';
  return status;
}

export const LoanModel = {
  // 1. Ambil semua data peminjaman (Mendukung Filter Query ?status=...)
  async getAllLoans(status) {
    let query = supabase
      .from('loans')
      .select('id, book_id, member_id, loan_date, due_date, return_date, status, books(title), members(full_name)');

    if (status) {
      const s = String(status).trim().toLowerCase();
      let statusList = [status];
      // Mendukung pencarian baik dengan istilah bahasa Indonesia maupun bahasa Inggris (BORROWED, OVERDUE, RETURNED)
      if (s === 'terlambat' || s === 'overdue') {
        statusList = ['Terlambat', 'terlambat', 'OVERDUE', 'overdue'];
      } else if (s === 'dipinjam' || s === 'borrowed') {
        statusList = ['Dipinjam', 'dipinjam', 'BORROWED', 'borrowed'];
      } else if (s === 'kembali' || s === 'returned') {
        statusList = ['Kembali', 'kembali', 'RETURNED', 'returned'];
      }
      query = query.in('status', statusList);
    }

    const { data, error } = await query;
    if (error) {
      // Fallback jika relasi foreign key belum dibuat di Supabase
      let fallbackQuery = supabase.from('loans').select('*');
      if (status) {
        const s = String(status).trim().toLowerCase();
        let statusList = [status];
        if (s === 'terlambat' || s === 'overdue') {
          statusList = ['Terlambat', 'terlambat', 'OVERDUE', 'overdue'];
        } else if (s === 'dipinjam' || s === 'borrowed') {
          statusList = ['Dipinjam', 'dipinjam', 'BORROWED', 'borrowed'];
        } else if (s === 'kembali' || s === 'returned') {
          statusList = ['Kembali', 'kembali', 'RETURNED', 'returned'];
        }
        fallbackQuery = fallbackQuery.in('status', statusList);
      }
      const fallbackResult = await fallbackQuery;
      if (fallbackResult.error) throw fallbackResult.error;
      return fallbackResult.data;
    }
    return data;
  },

  // 2. Ambil detail peminjaman berdasarkan ID
  async getLoanById(id) {
    const { data, error } = await supabase
      .from('loans')
      .select('id, book_id, member_id, loan_date, due_date, return_date, status, books(title), members(full_name)')
      .eq('id', id)
      .single();

    if (error) {
      const fallbackResult = await supabase
        .from('loans')
        .select('*')
        .eq('id', id)
        .single();
      if (fallbackResult.error) throw fallbackResult.error;
      return fallbackResult.data;
    }
    return data;
  },

  // 3. Tambah peminjaman baru (Create)
  async createLoan(payload) {
    const finalPayload = { ...payload };
    if (finalPayload.status) {
      finalPayload.status = normalizeStatusForDB(finalPayload.status);
    }

    const { data, error } = await supabase
      .from('loans')
      .insert([finalPayload])
      .select();

    if (error) throw error;
    return data && data[0] ? data[0] : null;
  },

  // 4. Perbarui data peminjaman (Update)
  async updateLoan(id, payload) {
    const finalPayload = { ...payload };
    if (finalPayload.status) {
      finalPayload.status = normalizeStatusForDB(finalPayload.status);
    }

    const { data, error } = await supabase
      .from('loans')
      .update(finalPayload)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data && data[0] ? data[0] : null;
  },

  // 5. Hapus peminjaman (Delete)
  async deleteLoan(id) {
    const { data, error } = await supabase
      .from('loans')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    return data && data[0] ? data[0] : null;
  }
};
