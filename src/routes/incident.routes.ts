import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller';
import { validateIncidentPayload } from '../middlewares/validateIncident.middleware';

const router = Router();

router.post('/', validateIncidentPayload, IncidentController.createIncident);
router.get('/', IncidentController.getIncidents);
router.patch('/:id', IncidentController.updateIncident);

export default router;
