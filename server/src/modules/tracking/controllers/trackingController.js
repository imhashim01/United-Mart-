import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import { sendMetaCapiEvent } from '../../../utils/metaConversionsApi.js';

export const trackAddToCart = asyncHandler(async (req, res) => {
  const { eventId, productId, productName, price, fbp, email, phone, eventSourceUrl } = req.body;

  // Fire-and-forget: don't hold the response (and the function's billed
  // CPU time) open waiting on Meta's reply. A failure here is logged but
  // never affects the user-facing request.
  sendMetaCapiEvent({
    eventName: 'AddToCart',
    eventId,
    eventSourceUrl,
    customData: {
      content_name: productName,
      content_ids: [productId],
      content_type: 'product',
      value: price,
      currency: 'PKR',
    },
    email: req.user?.email || email,
    phone: req.user?.phone || phone,
    externalId: req.user?.id,
    fbp,
    clientIp: req.ip,
    userAgent: req.get('user-agent'),
  }).catch((err) => console.error('Meta CAPI AddToCart failed:', err.message));

  sendResponse(res, 200, null, 'Tracked');
});

export const trackInitiateCheckout = asyncHandler(async (req, res) => {
  const { eventId, value, numItems, fbp, email, phone, eventSourceUrl } = req.body;

  sendMetaCapiEvent({
    eventName: 'InitiateCheckout',
    eventId,
    eventSourceUrl,
    customData: {
      value,
      currency: 'PKR',
      num_items: numItems,
    },
    email: req.user?.email || email,
    phone: req.user?.phone || phone,
    externalId: req.user?.id,
    fbp,
    clientIp: req.ip,
    userAgent: req.get('user-agent'),
  }).catch((err) => console.error('Meta CAPI InitiateCheckout failed:', err.message));

  sendResponse(res, 200, null, 'Tracked');
});