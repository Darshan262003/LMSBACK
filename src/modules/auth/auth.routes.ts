import { Router } from 'express';
import * as authController from './auth.controller';
import { validateRegister, validateLogin } from './auth.validator';
import { authRateLimitConfig } from '../../config/security';

const router = Router();

// Auth routes (with stricter rate limiting)
router.use(authRateLimitConfig);

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
