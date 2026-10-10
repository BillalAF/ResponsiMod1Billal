import { supabase } from '../config/supabase.js';

export const MemberModel = {
  async getAll() {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('joined_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(data) {
    const { full_name, email, member_type } = data;
    const { data: result, error } = await supabase
      .from('members')
      .insert([{ full_name, email, member_type }])
      .select();
    if (error) throw error;
    return result && result[0] ? result[0] : null;
  }
};