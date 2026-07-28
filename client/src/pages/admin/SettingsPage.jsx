import { useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import { getPersistedSettings, persistSettings } from "../../utils/persistedData";

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

const defaultSettings = {
  storeName: "United Mart Sukkur",
  supportEmail: "support@unitedmartsukkur.pk",
  supportPhone: "+92 300 1234567",
  address: "Station Road, Sukkur, Sindh, Pakistan",
  deliveryFlatRate: 150,
  freeDeliveryThreshold: 3000,
  orderCutoffTime: "16:00",
  emailNotifications: true,
  smsNotifications: false,
};

export default function SettingsPage() {
  const [form, setForm] = useState(() => getPersistedSettings(defaultSettings));

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = (e) => {
    e.preventDefault();
    persistSettings(form);
    toast.success("Settings saved");
  };

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

        <SettingsCard title="Delivery Settings" subtitle="Controls checkout delivery pricing and cutoff time">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Flat Delivery Rate (Rs)">
              <input type="number" className={inputClass} value={form.deliveryFlatRate} onChange={(e) => update("deliveryFlatRate", e.target.value)} />
            </Field>
            <Field label="Free Delivery Threshold (Rs)">
              <input type="number" className={inputClass} value={form.freeDeliveryThreshold} onChange={(e) => update("freeDeliveryThreshold", e.target.value)} />
            </Field>
          </div>
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

        <button type="submit" className="h-11 px-6 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors">
          Save Changes
        </button>
      </form>
    </AdminLayout>
  );
}
