import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getPersistedOrderById, subscribeOrderStorageUpdates } from "../utils/orderStorage";
import { formatPrice, formatDate } from "../utils/formatCurrency";

export default function PublicOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(() => getPersistedOrderById(id));

  useEffect(() => {
    const handleUpdate = () => setOrder(getPersistedOrderById(id));
    const unsubscribe = subscribeOrderStorageUpdates(handleUpdate);
    return unsubscribe;
  }, [id]);

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="min-h-screen bg-linen-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="flex flex-col gap-2 mb-6">
          <Link to="/orders" className="text-sm font-semibold text-orchard-900 hover:text-mango-500 transition-colors">
            <ArrowLeft size={16} /> Back to orders
          </Link>
          <h1 className="font-display text-3xl text-orchard-900">Order {order.orderNumber}</h1>
          <p className="text-sm text-charcoal-600">Placed on {formatDate(order.createdAt)}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-5">
            <div className="rounded-[var(--radius-lg)] border border-border bg-white p-6">
              <h2 className="text-sm font-semibold text-charcoal-900 mb-4">Order summary</h2>
              <div className="space-y-3 text-sm text-charcoal-600">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-charcoal-900">{item.name}</p>
                      <p>{item.unit} × {item.qty}</p>
                    </div>
                    <p className="font-semibold text-charcoal-900 tabular-nums">{formatPrice(item.subtotal)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border pt-4 space-y-2 text-sm text-charcoal-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal-900 tabular-nums">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-semibold text-charcoal-900 tabular-nums">{formatPrice(order.delivery)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-success-600">
                    <span>Discount</span>
                    <span className="font-semibold tabular-nums">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-base font-semibold text-charcoal-900">Total</span>
                  <span className="text-base font-semibold text-charcoal-900 tabular-nums">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-border bg-white p-6">
              <h2 className="text-sm font-semibold text-charcoal-900 mb-4">Order status</h2>
              <p className="text-sm font-semibold text-orchard-900 mb-2">{order.status}</p>
              <div className="space-y-3 text-sm text-charcoal-600">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="rounded-[var(--radius-sm)] bg-linen-50 p-3">
                    <p className="font-medium text-charcoal-900">{event.status}</p>
                    <p>{formatDate(event.timestamp)}</p>
                    <p>{event.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[var(--radius-lg)] border border-border bg-white p-6">
              <h2 className="text-sm font-semibold text-charcoal-900 mb-4">Customer</h2>
              <div className="flex items-center gap-3 mb-4">
                <img src={order.customer.avatar} alt={order.customer.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-charcoal-900">{order.customer.name}</p>
                  <p className="text-sm text-charcoal-600">{order.customer.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-charcoal-600">
                <div>
                  <span className="font-semibold text-charcoal-900">Phone:</span> {order.customer.phone}
                </div>
                <div>
                  <span className="font-semibold text-charcoal-900">Address:</span>
                  <div>{order.address.line1}</div>
                  <div>{order.address.area}, {order.address.city}</div>
                </div>
                <div>
                  <span className="font-semibold text-charcoal-900">Payment:</span> {order.paymentMethod}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
