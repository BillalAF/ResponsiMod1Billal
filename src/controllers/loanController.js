import { LoanModel } from '../models/loanModel.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(value) {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

export const LoanController = {
  // READ: GET /loans atau GET /loans?status=Terlambat
  async getLoans(req, res) {
    try {
      const { status } = req.query;
      const loans = await LoanModel.getAllLoans(status);
      res.status(200).json({
        success: true,
        message: status 
          ? `Berhasil mengambil data peminjaman dengan status: ${status}`
          : 'Berhasil mengambil semua data peminjaman',
        total: loans.length,
        data: loans
      });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  // READ: GET /loans/:id
  async getLoanById(req, res) {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) {
        return res.status(400).json({
          success: false,
          error: `Format ID "${id}" tidak valid. Kolom id di database Supabase kamu bertipe UUID. Gunakan format UUID (contoh: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11).`
        });
      }

      const loan = await LoanModel.getLoanById(id);
      if (!loan) {
        return res.status(404).json({ success: false, error: 'Data peminjaman tidak ditemukan' });
      }
      res.status(200).json({
        success: true,
        message: 'Berhasil mengambil detail peminjaman',
        data: loan
      });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  // CREATE: POST /loans
  async createLoan(req, res) {
    try {
      const { book_id, member_id, due_date } = req.body;
      if (!book_id || !member_id || !due_date) {
        return res.status(400).json({
          success: false,
          error: 'book_id, member_id, dan due_date wajib diisi!'
        });
      }

      if (!isValidUUID(book_id)) {
        return res.status(400).json({
          success: false,
          error: `book_id "${book_id}" bukan UUID yang valid. Tabel books di Supabase kamu menggunakan tipe UUID (contoh: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11). Ambil UUID buku dari tabel books.`
        });
      }

      if (!isValidUUID(member_id)) {
        return res.status(400).json({
          success: false,
          error: `member_id "${member_id}" bukan UUID yang valid. Tabel members di Supabase kamu menggunakan tipe UUID (contoh: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11). Ambil UUID anggota dari tabel members.`
        });
      }

      const payload = {
        book_id,
        member_id,
        due_date,
        loan_date: req.body.loan_date || new Date().toISOString().split('T')[0],
        status: req.body.status || 'Dipinjam',
        return_date: req.body.return_date || null
      };

      const newLoan = await LoanModel.createLoan(payload);
      res.status(201).json({
        success: true,
        message: 'Data peminjaman berhasil dibuat!',
        data: newLoan
      });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  // UPDATE: PUT /loans/:id
  async updateLoan(req, res) {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) {
        return res.status(400).json({
          success: false,
          error: `Format ID "${id}" tidak valid. Kolom id di database Supabase kamu bertipe UUID.`
        });
      }

      const updatedLoan = await LoanModel.updateLoan(id, req.body);
      if (!updatedLoan) {
        return res.status(404).json({
          success: false,
          error: 'Data peminjaman tidak ditemukan atau gagal diperbarui'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Data peminjaman berhasil diperbarui!',
        data: updatedLoan
      });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  // DELETE: DELETE /loans/:id
  async deleteLoan(req, res) {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) {
        return res.status(400).json({
          success: false,
          error: `Format ID "${id}" tidak valid. Kolom id di database Supabase kamu bertipe UUID.`
        });
      }

      const deletedLoan = await LoanModel.deleteLoan(id);
      if (!deletedLoan) {
        return res.status(404).json({
          success: false,
          error: 'Data peminjaman tidak ditemukan atau sudah dihapus'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Data peminjaman berhasil dihapus!',
        data: deletedLoan
      });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};
