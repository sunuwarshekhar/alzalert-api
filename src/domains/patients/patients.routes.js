import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/http.js';
import { requireRoles } from '../../shared/middleware/auth.js';
import { patientsController } from './patients.controller.js';

const router = Router();

router.get('/', requireRoles('admin', 'caregiver'), asyncHandler(patientsController.list));
router.post('/', requireRoles('admin', 'caregiver'), asyncHandler(patientsController.create));
router.get('/:id', requireRoles('admin', 'caregiver'), asyncHandler(patientsController.getById));
router.put('/:id', requireRoles('admin', 'caregiver'), asyncHandler(patientsController.update));
router.delete('/:id', requireRoles('admin', 'caregiver'), asyncHandler(patientsController.remove));

export default router;
