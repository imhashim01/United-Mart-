import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Printer, Download, MapPin, CreditCard, Phone, Mail } from "lucide-react";
import * as ordersApi from "../../features/admin/orders/api/ordersApi";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import Badge from "../../components/ui/Badge";
import OrderStatusStepper from "../../features/admin/orders/components/OrderStatusStepper";
import OrderTimeline from "../../features/admin/orders/components/OrderTimeline";
import InvoiceDocument from "../../features/admin/orders/components/InvoiceDocument";
import { ORDER_STATUSES, STATUS_BADGE_VARIANT } from "../../data/adminData";
import { formatPrice, formatDate } from "../../utils/formatCurrency";
import { downloadInvoicePdf } from "../../utils/invoicePdf";
import { fadeUp } from "../../animations/variants";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await ordersApi.getOrder(id);
        setOrder(data.data);
      } catch (error) {
        console.error('Failed to fetch order:', error?.response || error.message);
      }
    })();
  }, [id]);

  useEffect(() => {
    // manage loading state around the fetch above
    if (order === null) setLoading(true);
    else setLoading(false);
  }, [order]);

  if (loading) {
    return (
      <AdminLayout title={`Order ${id}`}>
        <div className="min-h-[200px] flex items-center justify-center">Loading order...</div>
      </AdminLayout>
    );
  }

  if (!order && !loading) return <Navigate to="/admin/orders" replace />;

  const handleStatusChange = async (newStatus) => {
    try {
      await ordersApi.updateOrderStatus(order.id, { status: newStatus });
      setOrder((prev) => ({
        ...prev,
        status: newStatus,
        timeline: [
          ...prev.timeline,
          { status: newStatus, timestamp: new Date().toISOString(), note: `Status updated to ${newStatus} by admin` },
        ],
      }));
      toast.success(`Order ${order.id} marked as ${newStatus}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update order status');
      console.error('Update order status failed:', error?.response || error.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    downloadInvoicePdf(order);
    toast.success("Invoice downloaded");
  };

  return (
    <AdminLayout title={`Order ${order.id}`}>
      {/* On-screen admin view — hidden when printing */}
      <div className="print:hidden">
        <nav className="flex items-center gap-1.5 text-sm text-charcoal-600 mb-5">
          <Link to="/admin/orders" className="hover:text-orchard-700 transition-colors">Orders</Link>
          <ChevronRight size={14} />
          <span className="text-charcoal-900 font-medium">{order.id}</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="font-display text-xl md:text-2xl text-orchard-900">{order.id}</h1>
              <Badge variant={STATUS_BADGE_VARIANT[order.status]}>{order.status}</Badge>
            </div>
            <p className="text-sm text-charcoal-600">Placed on {formatDate(order.createdAt)}</p>
          </div>

          <div className="flex items-center gap-2.5">
            {!["Cancelled", "Delivered", "Returned"].includes(order.status) && (
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="h-10 px-3 rounded-[var(--radius-sm)] border border-border-strong text-sm bg-white focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 h-10 px-4 rounded-[var(--radius-md)] border border-border-strong text-sm font-medium text-charcoal-900 hover:bg-linen-50 transition-colors"
            >
              <Printer size={15} />
              Print Invoice
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 h-10 px-4 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors"
            >
              <Download size={15} />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Stepper */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white border border-border rounded-[var(--radius-lg)] p-5 md:p-6">
              <p className="text-sm font-semibold text-charcoal-900 mb-6">Order Progress</p>
              <OrderStatusStepper status={order.status} />
            </motion.div>

            {/* Items */}
            <div className="bg-white border border-border rounded-[var(--radius-lg)] p-5 md:p-6">
              <p className="text-sm font-semibold text-charcoal-900 mb-4">Order Items ({order.items.length})</p>
              <div className="flex flex-col divide-y divide-border">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-[var(--radius-sm)] object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal-900 truncate">{item.name}</p>
                      <p className="text-xs text-charcoal-600">{item.unit} × {item.qty}</p>
                    </div>
                    <p className="text-sm font-semibold text-charcoal-900 tabular-nums shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-sm mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-charcoal-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-charcoal-900">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span>Delivery</span>
                  <span className="tabular-nums text-charcoal-900">{order.delivery === 0 ? "Free" : formatPrice(order.delivery)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-success-600">
                    <span>Discount</span>
                    <span className="tabular-nums">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 mt-1 border-t border-border">
                  <span className="text-base font-semibold text-charcoal-900">Total</span>
                  <span className="text-lg font-bold text-charcoal-900 tabular-nums">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-border rounded-[var(--radius-lg)] p-5 md:p-6">
              <p className="text-sm font-semibold text-charcoal-900 mb-5">Order Timeline</p>
              <OrderTimeline timeline={order.timeline} />
            </div>
          </div>

          {/* Sidebar: customer + address + payment */}
          <div className="flex flex-col gap-5">
            <div className="bg-white border border-border rounded-[var(--radius-lg)] p-5">
              <p className="text-sm font-semibold text-charcoal-900 mb-4">Customer</p>
              <div className="flex items-center gap-3 mb-4">
                <img src={order.customer.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-charcoal-900">{order.customer.name}</p>
                  <p className="text-xs text-charcoal-600">Customer</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm text-charcoal-600">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="shrink-0" />
                  {order.customer.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="shrink-0" />
                  {order.customer.email}
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-[var(--radius-lg)] p-5">
              <p className="text-sm font-semibold text-charcoal-900 mb-3 flex items-center gap-1.5">
                <MapPin size={15} className="text-orchard-700" />
                Delivery Address
              </p>
              <p className="text-sm text-charcoal-600">
                {order.address.line1}, {order.address.area}, {order.address.city}
              </p>
            </div>

            <div className="bg-white border border-border rounded-[var(--radius-lg)] p-5">
              <p className="text-sm font-semibold text-charcoal-900 mb-3 flex items-center gap-1.5">
                <CreditCard size={15} className="text-orchard-700" />
                Payment
              </p>
              <p className="text-sm text-charcoal-600">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only invoice — hidden on screen, shown when printing */}
      <div className="hidden print:block">
        <InvoiceDocument order={order} />
      </div>
    </AdminLayout>
  );
}
