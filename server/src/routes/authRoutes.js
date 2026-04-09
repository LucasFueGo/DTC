import express from 'express';
import { exchangeToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/exchangeToken', exchangeToken);

export default router;