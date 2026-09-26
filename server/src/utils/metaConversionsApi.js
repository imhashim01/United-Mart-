import crypto from 'crypto';

// developers.facebook.com/docs/marketing-api/conversions-api — current
// stable Graph API version as of writing.
const GRAPH_API_VERSION = 'v26.0';
const PIXEL_ID = '1117935500793140';
const CAPI_ENDPOINT = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events`;

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

// Meta requires em/ph hashed with SHA-256 after this exact normalization.
export const hashEmail = (email) => {
  if (!email || typeof email !== 'string') return undefined;
  const normalized = email.trim().toLowerCase();
  return normalized ? sha256(normalized) : undefined;
};

export const hashPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return undefined;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly ? sha256(digitsOnly) : undefined;
};

// external_id also must be hashed per Meta's user_data requirements.
export const hashExternalId = (userId) => {
  if (!userId) return undefined;
  const normalized = String(userId).trim();
  return normalized ? sha256(normalized) : undefined;
};

const buildUserData = ({ email, phone, externalId, fbp, clientIp, userAgent }) => {
  const userData = {};
  const em = hashEmail(email);
  const ph = hashPhone(phone);
  const externalIdHash = hashExternalId(externalId);
  if (em) userData.em = em;
  if (ph) userData.ph = ph;
  if (externalIdHash) userData.external_id = externalIdHash;
  // fbp is sent raw (unhashed) — it's a cookie value, not PII.
  if (fbp) userData.fbp = fbp;
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;
  return userData;
};

// Sends one event to Meta's Conversions API. Never throws — every failure
// (missing token, network error, non-2xx response) is logged and swallowed
// so tracking can never break a real cart/checkout/order flow.
export const sendMetaCapiEvent = async ({
  eventName,
  eventId,
  eventSourceUrl,
  customData = {},
  email,
  phone,
  externalId,
  fbp,
  clientIp,
  userAgent,
}) => {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    console.error(`[metaConversionsApi] META_CAPI_ACCESS_TOKEN is not set — skipped ${eventName} event`);
    return;
  }

  try {
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: 'website',
          ...(eventSourceUrl ? { event_source_url: eventSourceUrl } : {}),
          user_data: buildUserData({ email, phone, externalId, fbp, clientIp, userAgent }),
          custom_data: customData,
        },
      ],
      // Optional: set META_CAPI_TEST_EVENT_CODE while verifying in Events
      // Manager's Test Events tool. Unset it for normal production traffic.
      ...(process.env.META_CAPI_TEST_EVENT_CODE ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE } : {}),
    };

    const response = await fetch(`${CAPI_ENDPOINT}?access_token=${encodeURIComponent(accessToken)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error(`[metaConversionsApi] ${eventName} event rejected (${response.status}):`, errorBody);
    }
  } catch (error) {
    console.error(`[metaConversionsApi] ${eventName} event failed:`, error.message);
  }
};
