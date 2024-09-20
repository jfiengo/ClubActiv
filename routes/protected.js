// routes/protected.js

import { Router } from 'express';
const router = Router();
import isAuthenticated from '../middleware/authMiddleware.js';

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard');
});

export default router;