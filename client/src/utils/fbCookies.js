// Reads Meta's _fbp cookie value — only readable client-side, so the
// backend needs the frontend to forward it for Conversions API calls.
export const getFbp = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)_fbp=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};
