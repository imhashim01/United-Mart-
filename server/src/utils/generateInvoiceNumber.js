export const generateOrderNumber = () => {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `UMS-ORD-${datePart}-${randomPart}`;
};

export const generateInvoiceNumber = () => {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `UMS-INV-${datePart}-${randomPart}`;
};

export const generateCouponUsageKey = (couponId, userId) => `${couponId}:${userId}`;
