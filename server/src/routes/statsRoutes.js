import express from 'express';
import { 
    D2PlayTime,
    D1PlayTime,
    searchPlayer,
    autocompletePlayer
} from '../controllers/statsController.js';

const router = express.Router();

router.post('/D1PlayTime', D1PlayTime);
router.post('/D2PlayTime', D2PlayTime);
router.post('/search', searchPlayer);
router.post('/autocomplete', autocompletePlayer);

export default router;