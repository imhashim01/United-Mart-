import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import * as ordersApi from "../features/admin/orders/api/ordersApi";
import { formatDate } from "../utils/formatCurrency";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        const { data } = await ordersApi.listMyOrders({ limit: 100 });
        if (!mounted) return;
        setOrders(data.data || []);
      } catch (error) {
        if (!mounted) return;
        console.error("Failed to load customer orders:", error?.response || error.message);
        setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);

    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-linen-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="flex flex-col gap-3 mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orchard-700">Track Order</p>
          <h1 className="font-display text-3xl text-orchard-900">Your Orders</h1>
          <p className="max-w-2xl text-sm text-charcoal-600">
            Review your recent orders and track their status. Orders placed in this session are listed below.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[var(--radius-lg)] border border-border bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-charcoal-900">Loading orders...</h2>
            <p className="mt-2 text-sm text-charcoal-600">Fetching the latest order status from your account.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-border bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-charcoal-900">No orders yet</h2>
            <p className="mt-2 text-sm text-charcoal-600">Place an order first, then return here to track it.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-orchard-900 px-5 text-sm font-semibold text-white hover:bg-orchard-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[var(--radius-lg)] border border-border bg-white p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-charcoal-600">Order number</p>
                    <p className="text-lg font-semibold text-orchard-900">{order.orderNumber}</p>
                  </div>
                  <div className="text-sm text-charcoal-600">
                    Placed on {formatDate(order.createdAt)}
                  </div>
                  <div className="text-sm font-semibold text-charcoal-900">
                    {order.status}
                  </div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-orchard-900 hover:text-mango-500 transition-colors"
                  >
                    View details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
