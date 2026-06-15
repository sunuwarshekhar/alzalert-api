import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/http.js';
import { usersController } from './users.controller.js';

const router = Router();

router.get('/', asyncHandler(usersController.list));
router.post('/', asyncHandler(usersController.create));
router.get('/:id', asyncHandler(usersController.getById));
router.put('/:id', asyncHandler(usersController.update));
router.delete('/:id', asyncHandler(usersController.remove));

export default router;
