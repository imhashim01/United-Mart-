import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import * as settingsApi from "../../features/admin/settings/api/settingsApi";
import { refreshSettings } from "../../data/settingsData";

function SettingsCard({ title, subtitle, children }) {
  return (
    <div className="bg-white border border-border rounded-[var(--radius-lg)] p-5 mb-5">
      <p className="text-sm font-semibold text-charcoal-900 mb-1">{title}</p>
      {subtitle && <p className="text-xs text-charcoal-600 mb-4">{subtitle}</p>}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-charcoal-600 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full h-10 px-3 rounded-[var(--radius-sm)] border border-border-strong text-sm focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 focus:border-orchard-700";

export default function SettingsPage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await settingsApi.getSettings();
        setForm(data.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        storeName: form.storeName,
        supportEmail: form.supportEmail,
        supportPhone: form.supportPhone,
        address: form.address,
        deliveryFlatRate: Number(form.deliveryFlatRate),
        freeDeliveryThreshold: Number(form.freeDeliveryThreshold),
        minimumOrderAmount: Number(form.minimumOrderAmount),
        orderCutoffTime: form.orderCutoffTime,
        emailNotifications: form.emailNotifications,
        smsNotifications: form.smsNotifications,
      };
      const { data } = await settingsApi.updateSettings(payload);
      setForm(data.data);
      await refreshSettings(); // so this device's cart/checkout picks up the change immediately
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <AdminLayout title="Website Settings">
        <p className="text-sm text-charcoal-600">Loading settings...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Website Settings">
      <form onSubmit={handleSave} className="max-w-2xl">
        <SettingsCard title="Store Information" subtitle="Shown on invoices, emails, and the storefront footer">
          <Field label="Store Name">
            <input className={inputClass} value={form.storeName} onChange={(e) => update("storeName", e.target.value)} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Support Email">
              <input type="email" className={inputClass} value={form.supportEmail} onChange={(e) => update("supportEmail", e.target.value)} />
            </Field>
            <Field label="Support Phone">
              <input className={inputClass} value={form.supportPhone} onChange={(e) => update("supportPhone", e.target.value)} />
            </Field>
          </div>
          <Field label="Store Address">
            <input className={inputClass} value={form.address} onChange={(e) => update("address", e.target.value)} />
          </Field>
        </SettingsCard>

        <SettingsCard title="Delivery Settings" subtitle="Controls checkout delivery pricing, cutoff time, and the minimum order amount">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Flat Delivery Rate (Rs)">
              <input type="number" min="0" className={inputClass} value={form.deliveryFlatRate} onChange={(e) => update("deliveryFlatRate", e.target.value)} />
            </Field>
            <Field label="Free Delivery Threshold (Rs)">
              <input type="number" min="0" className={inputClass} value={form.freeDeliveryThreshold} onChange={(e) => update("freeDeliveryThreshold", e.target.value)} />
            </Field>
          </div>
          <Field label="Minimum Order Amount (Rs)">
            <input type="number" min="0" className={inputClass} value={form.minimumOrderAmount} onChange={(e) => update("minimumOrderAmount", e.target.value)} />
          </Field>
          <Field label="Same-Day Order Cutoff Time">
            <input type="time" className={inputClass} value={form.orderCutoffTime} onChange={(e) => update("orderCutoffTime", e.target.value)} />
          </Field>
        </SettingsCard>

        <SettingsCard title="Notifications" subtitle="Choose how order updates are sent to customers">
          <label className="flex items-center justify-between">
            <span className="text-sm text-charcoal-900">Email notifications</span>
            <input type="checkbox" checked={form.emailNotifications} onChange={(e) => update("emailNotifications", e.target.checked)} className="accent-orchard-900 h-4 w-4" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-charcoal-900">SMS notifications</span>
            <input type="checkbox" checked={form.smsNotifications} onChange={(e) => update("smsNotifications", e.target.checked)} className="accent-orchard-900 h-4 w-4" />
          </label>
        </SettingsCard>

        <button type="submit" disabled={saving} className="h-11 px-6 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors disabled:opacity-60">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </AdminLayout>
  );
}