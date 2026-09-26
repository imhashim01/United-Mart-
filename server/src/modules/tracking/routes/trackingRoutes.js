import { Router } from 'express';
import { optionalAuth } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import { trackAddToCart, trackInitiateCheckout } from '../controllers/trackingController.js';
import { addToCartTrackingSchema, initiateCheckoutTrackingSchema } from '../validators/trackingValidators.js';

const router = Router();

// optionalAuth attaches req.user (for em/ph/external_id matching) when a
// valid token is present, but never blocks a guest's tracking call.
router.post('/add-to-cart', optionalAuth, validate(addToCartTrackingSchema), trackAddToCart);
router.post('/initiate-checkout', optionalAuth, validate(initiateCheckoutTrackingSchema), trackInitiateCheckout);

export default router;
