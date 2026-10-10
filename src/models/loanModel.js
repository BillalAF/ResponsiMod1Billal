import { supabase } from '../config/supabase.js';

export const LoanModel = {
  // 1. Ambil semua data peminjaman (bisa difilter status)
  async getAllLoans(status) {
    let query = supabase
      .from('loans')
      .select('id, book_id, member_id, loan_date, due_date, return_date, status, books(title), members(full_name)');

    if (status) {
      // Gunakan eq atau ilike untuk filter status (case-insensitive)
      query = query.ilike('status', status);
    }

    const { data, error } = await query;
    if (error) {
      // Fallback jika relasi foreign key belum dibuat di Supabase
      let fallbackQuery = supabase.from('loans').select('*');
      if (status) {
        fallbackQuery = fallbackQuery.ilike('status', status);
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
    const { data, error } = await supabase
      .from('loans')
      .insert([payload])
      .select();

    if (error) throw error;
    return data && data[0] ? data[0] : null;
  },

  // 4. Perbarui data peminjaman (Update)
  async updateLoan(id, payload) {
    const { data, error } = await supabase
      .from('loans')
      .update(payload)
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
