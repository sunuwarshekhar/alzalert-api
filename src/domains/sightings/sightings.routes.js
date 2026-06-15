import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/http.js';
import { requireRoles } from '../../shared/middleware/auth.js';
import { sightingsController } from './sightings.controller.js';

const router = Router();

router.get('/', asyncHandler(sightingsController.list));
router.post('/', requireRoles('admin', 'caregiver', 'community'), asyncHandler(sightingsController.create));
router.delete('/:id', requireRoles('admin', 'caregiver'), asyncHandler(sightingsController.remove));

export default router;
