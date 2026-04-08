import express from 'express';
import { 
    playTime
} from '../controllers/statsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);


router.get('/playTime', playTime);

export default router;