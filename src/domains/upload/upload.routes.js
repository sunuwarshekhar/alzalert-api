import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/http.js';
import { authMiddleware, requireRoles } from '../../shared/middleware/auth.js';
import { uploadController } from './upload.controller.js';

const router = Router();

router.get(
  '/presign',
  authMiddleware,
  requireRoles('admin', 'caregiver'),
  asyncHandler(uploadController.presign)
);

export default router;
