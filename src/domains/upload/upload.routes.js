import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/http.js';
import { authMiddleware, requireRoles } from '../../shared/middleware/auth.js';
import { fileUploadDriver } from '../../shared/storage/index.js';
import { uploadController } from './upload.controller.js';
import { validateUploadKey, uploadFileMiddleware } from './upload.middleware.js';

const router = Router();

router.get(
  '/presign',
  authMiddleware,
  requireRoles('admin', 'caregiver', 'community'),
  asyncHandler(uploadController.presign)
);

if (fileUploadDriver === 'fs') {
  router.post(
    '/file',
    authMiddleware,
    requireRoles('admin', 'caregiver', 'community'),
    validateUploadKey,
    (req, res, next) => {
      uploadFileMiddleware(req, res, (err) => {
        if (err) return next(err);
        next();
      });
    },
    asyncHandler(uploadController.uploadFile)
  );
}

export default router;
