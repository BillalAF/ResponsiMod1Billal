import express from 'express';
import dotenv from 'dotenv';
import loanRoutes from './routes/loanRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware body parser JSON
app.use(express.json());

// Endpoint info & health check
app.get('/', (req, res) => {
  res.json({
    message: 'API Sistem Peminjaman Buku (Supabase + Express) siap digunakan!',
    endpoints: {
      loans: {
        getAll: 'GET /loans atau GET /api/loans',
        filterQuery: 'GET /loans?status=Terlambat',
        getDetail: 'GET /loans/:id',
        create: 'POST /loans',
        update: 'PUT /loans/:id',
        delete: 'DELETE /loans/:id'
      }
    }
  });
});

// Routing peminjaman (mendukung /loans dan /api/loans untuk Postman)
app.use('/loans', loanRoutes);
app.use('/api/loans', loanRoutes);

// Routing pendukung lainnya
app.use('/books', bookRoutes);
app.use('/api/books', bookRoutes);
app.use('/members', memberRoutes);
app.use('/api/members', memberRoutes);
app.use('/authors', authorRoutes);
app.use('/api/authors', authorRoutes);
app.use('/categories', categoryRoutes);
app.use('/api/categories', categoryRoutes);

// Handle 404 jika route tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint tidak ditemukan' });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

export default app;