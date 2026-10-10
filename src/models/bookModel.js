import { supabase } from '../config/supabase.js';

export const BookModel = {
  // Mengambil semua buku dari Supabase
  async getAll() {
    const { data, error } = await supabase
      .from('books')
      .select('*');
    if (error) throw error;
    return data;
  },

  async create(data) {
    const { isbn, title, author_id, category_id, total_copies } = data;
    const copies = total_copies || 1;
    const payload = {
      isbn,
      title,
      total_copies: copies,
      available_copies: copies
    };
    if (author_id) payload.author_id = author_id;
    if (category_id) payload.category_id = category_id;

    const { data: result, error } = await supabase
      .from('books')
      .insert([payload])
      .select();
    if (error) throw error;
    return result && result[0] ? result[0] : null;
  },

  async delete(id) {
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) throw error;
    return { message: "Buku berhasil dihapus dari sistem." };
  }
};