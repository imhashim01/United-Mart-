import { Router } from 'express';
import { protect } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import {
  changePasswordController,
  forgotPassword,
  getMe,
  login,
  logout,
  refresh,
  register,
  resetPasswordController,
  verifyEmailController,
} from '../controllers/authController.js';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../validators/authValidators.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmailController);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordController);
router.post('/change-password', protect, validate(changePasswordSchema), changePasswordController);
router.get('/me', protect, getMe);

export default router;
