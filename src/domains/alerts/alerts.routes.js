import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/http.js';
import { requireRoles } from '../../shared/middleware/auth.js';
import { alertsController } from './alerts.controller.js';

const router = Router();

router.get('/', asyncHandler(alertsController.list));
router.post('/', requireRoles('admin', 'caregiver'), asyncHandler(alertsController.create));
router.get('/:id', asyncHandler(alertsController.getById));
router.put('/:id', requireRoles('admin', 'caregiver'), asyncHandler(alertsController.update));
router.delete('/:id', requireRoles('admin', 'caregiver'), asyncHandler(alertsController.remove));

export default router;
