export const formatPrice = (amount) => `Rs ${Number(amount ?? 0).toLocaleString("en-PK")}`;

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
