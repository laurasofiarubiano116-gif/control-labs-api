import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';
import { validateEquipmentPayload } from '../middlewares/validateEquipment.middleware';

const router = Router();

router.post('/', validateEquipmentPayload, EquipmentController.createEquipment);
router.get('/', EquipmentController.getEquipment);
router.patch('/:id', EquipmentController.updateEquipment);

export default router;
