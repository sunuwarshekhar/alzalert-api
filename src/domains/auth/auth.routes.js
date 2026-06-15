import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/http.js';
import { authController } from './auth.controller.js';

const router = Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));

export default router;
