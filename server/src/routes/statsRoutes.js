import express from 'express';
import { 
    D2PlayTime,
    D1PlayTime
} from '../controllers/statsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/D1PlayTime', D1PlayTime);
router.get('/D2PlayTime', D2PlayTime);


export default router;