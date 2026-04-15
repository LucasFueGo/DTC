import express from 'express';
import { 
    getCharacterEquipment
} from '../controllers/equipmentController.js';

const router = express.Router();

router.post('/', getCharacterEquipment);

export default router;