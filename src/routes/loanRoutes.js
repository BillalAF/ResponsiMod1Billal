import express from 'express';
import { LoanController } from '../controllers/loanController.js';

const router = express.Router();

// READ (Semua / Filter Query ?status=...)
router.get('/', LoanController.getLoans);

// READ (Detail berdasarkan ID)
router.get('/:id', LoanController.getLoanById);

// CREATE
router.post('/', LoanController.createLoan);

// UPDATE
router.put('/:id', LoanController.updateLoan);

// DELETE
router.delete('/:id', LoanController.deleteLoan);

export default router;
