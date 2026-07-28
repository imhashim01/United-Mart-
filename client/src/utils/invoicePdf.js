import { jsPDF } from "jspdf";
import { formatPrice, formatDate } from "./formatCurrency";

const BRAND_GREEN = [23, 58, 46]; // #173A2E
const CHARCOAL = [30, 33, 31];
const MUTED = [90, 95, 91];
const BORDER = [228, 225, 216];

export function generateInvoicePdf(order) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = 50;

  // Header band
  doc.setFillColor(...BRAND_GREEN);
  doc.rect(0, 0, pageWidth, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("United Mart Sukkur", margin, 45);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Station Road, Sukkur, Sindh, Pakistan", margin, 62);
  doc.text("support@unitedmartsukkur.pk  ·  +92 300 1234567", margin, 75);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - margin, 45, { align: "right" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(order.id, pageWidth - margin, 62, { align: "right" });
  doc.text(formatDate(order.createdAt), pageWidth - margin, 75, { align: "right" });

  y = 125;
  doc.setTextColor(...CHARCOAL);

  // Bill to / order info columns
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BILL TO", margin, y);
  doc.text("ORDER DETAILS", pageWidth / 2 + 10, y);

  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);

  const billLines = [
    order.customer.name,
    order.customer.phone,
    order.customer.email,
    `${order.address.line1}, ${order.address.area}, ${order.address.city}`,
  ];
  const orderLines = [
    `Status: ${order.status}`,
    `Payment: ${order.paymentMethod}`,
    `Items: ${order.items.length}`,
  ];

  billLines.forEach((line, i) => doc.text(line, margin, y + i * 14, { maxWidth: pageWidth / 2 - margin - 20 }));
  orderLines.forEach((line, i) => doc.text(line, pageWidth / 2 + 10, y + i * 14));

  y += billLines.length * 14 + 25;

  // Table header
  doc.setDrawColor(...BORDER);
  doc.setFillColor(247, 245, 239); // linen-50
  doc.rect(margin, y, pageWidth - margin * 2, 24, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...CHARCOAL);
  doc.text("ITEM", margin + 8, y + 16);
  doc.text("QTY", pageWidth - margin - 180, y + 16);
  doc.text("PRICE", pageWidth - margin - 120, y + 16);
  doc.text("TOTAL", pageWidth - margin - 50, y + 16, { align: "right" });

  y += 24;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);

  order.items.forEach((item) => {
    y += 24;
    doc.setTextColor(...CHARCOAL);
    doc.text(item.name, margin + 8, y, { maxWidth: pageWidth - margin * 2 - 220 });
    doc.text(String(item.qty), pageWidth - margin - 180, y);
    doc.text(formatPrice(item.price), pageWidth - margin - 120, y);
    doc.text(formatPrice(item.price * item.qty), pageWidth - margin - 50, y, { align: "right" });
    doc.setDrawColor(...BORDER);
    doc.line(margin, y + 8, pageWidth - margin, y + 8);
  });

  y += 30;

  // Totals block, right-aligned
  const totalsX = pageWidth - margin - 180;
  const rows = [
    ["Subtotal", formatPrice(order.subtotal)],
    ["Delivery", order.delivery === 0 ? "Free" : formatPrice(order.delivery)],
  ];
  if (order.discount > 0) rows.push(["Discount", `-${formatPrice(order.discount)}`]);

  doc.setFontSize(9.5);
  rows.forEach(([label, value], i) => {
    doc.setTextColor(...MUTED);
    doc.text(label, totalsX, y + i * 16);
    doc.setTextColor(...CHARCOAL);
    doc.text(value, pageWidth - margin, y + i * 16, { align: "right" });
  });

  y += rows.length * 16 + 8;
  doc.setDrawColor(...BORDER);
  doc.line(totalsX, y, pageWidth - margin, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_GREEN);
  doc.text("TOTAL", totalsX, y);
  doc.text(formatPrice(order.total), pageWidth - margin, y, { align: "right" });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 50;
  doc.setDrawColor(...BORDER);
  doc.line(margin, footerY - 15, pageWidth - margin, footerY - 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text("Thank you for shopping with United Mart Sukkur.", margin, footerY);
  doc.text("This is a system-generated invoice and does not require a signature.", margin, footerY + 12);

  return doc;
}

export function downloadInvoicePdf(order) {
  const doc = generateInvoicePdf(order);
  doc.save(`Invoice-${order.id}.pdf`);
}
