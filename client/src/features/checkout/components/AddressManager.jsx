import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { MapPin, Plus, Check, Home, Briefcase, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useAuthStore } from "../../auth/hooks/useAuth";
import * as addressApi from "../api/addressApi";

const ADDRESS_ICONS = { Home: Home, Work: Briefcase, Other: MapPin };

function normalizeAddress(addr) {
  return {
    id: addr.id ?? addr._id,
    label: addr.label,
    line1: addr.line1,
    line2: addr.line2,
    area: addr.state, // this app's UI calls it "area"; backend calls it "state"
    city: addr.city,
    postalCode: addr.postalCode,
    country: addr.country,
    phone: addr.phone,
  };
}

export default function AddressManager({ selectedId, onSelect, onAddressChange }) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const addresses = user?.addresses || [];
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // No saved addresses yet (new customer) → open the form immediately so
  // they must fill in and save a real address before they can select one.
  // Otherwise, auto-select their default (or first) saved address.
  useEffect(() => {
    if (addresses.length === 0) {
      setShowForm(true);
      return;
    }
    const stillExists = addresses.some((a) => (a.id ?? a._id) === selectedId);
    if (!selectedId || !stillExists) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      const id = defaultAddr.id ?? defaultAddr._id;
      onSelect(id);
      onAddressChange?.(normalizeAddress(defaultAddr));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses.length]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const { data: response } = await addressApi.addAddress({
        label: data.label,
        line1: data.line1,
        state: data.area,
        city: data.city,
        phone: data.phone,
        isDefault: addresses.length === 0,
      });
      const updatedUser = response.data;
      setUser(updatedUser);
      const newAddress = updatedUser.addresses[updatedUser.addresses.length - 1];
      const id = newAddress.id ?? newAddress._id;
      onSelect(id);
      onAddressChange?.(normalizeAddress(newAddress));
      reset();
      setShowForm(false);
      toast.success("Address saved");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addr) => {
    const id = addr.id ?? addr._id;
    if (!window.confirm("Remove this address?")) return;
    setDeletingId(id);
    try {
      const { data: response } = await addressApi.deleteAddress(id);
      setUser(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove address");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="border border-border rounded-[var(--radius-md)] p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-charcoal-900 flex items-center gap-1.5">
          <MapPin size={15} className="text-orchard-700" />
          Delivery Address
        </p>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 text-xs font-semibold text-orchard-900 hover:text-mango-500 transition-colors"
          >
            <Plus size={14} />
            Add New
          </button>
        )}
      </div>

      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-charcoal-600 py-2">No saved addresses yet — add one to continue.</p>
      )}

      <div className="flex flex-col gap-2.5">
        {addresses.map((addr) => {
          const id = addr.id ?? addr._id;
          const Icon = ADDRESS_ICONS[addr.label] ?? MapPin;
          const selected = selectedId === id;
          return (
            <div key={id} className="relative">
              <button
                type="button"
                onClick={() => {
                  onSelect(id);
                  onAddressChange?.(normalizeAddress(addr));
                }}
                className={clsx(
                  "w-full text-left p-3.5 rounded-[var(--radius-sm)] border-2 transition-colors flex items-start gap-3",
                  selected ? "border-orchard-900 bg-linen-50" : "border-border hover:border-border-strong"
                )}
              >
                <div
                  className={clsx(
                    "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                    selected ? "bg-orchard-900 text-white" : "bg-linen-50 text-charcoal-600"
                  )}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-charcoal-900">{addr.label}</p>
                    {addr.isDefault && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-charcoal-600 bg-linen-50 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-charcoal-900">{addr.phone}</p>
                  <p className="text-xs text-charcoal-600">{addr.line1}, {addr.state}, {addr.city}</p>
                </div>
                {selected && <Check size={18} className="text-orchard-900 shrink-0" />}
              </button>
              <button
                type="button"
                aria-label="Remove address"
                disabled={deletingId === id}
                onClick={() => handleDelete(addr)}
                className="absolute top-3.5 right-3 text-charcoal-300 hover:text-danger-600 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-3 border-t border-border flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-charcoal-900">New Address</p>
                {addresses.length > 0 && (
                  <button type="button" onClick={() => setShowForm(false)} aria-label="Cancel">
                    <X size={16} className="text-charcoal-600" />
                  </button>
                )}
              </div>

              <Field label="Phone" error={errors.phone}>
                <input
                  {...register("phone", {
                    required: "Required",
                    pattern: { value: /^[0-9\s+-]{10,15}$/, message: "Invalid phone number" },
                  })}
                  className={fieldClass(errors.phone)}
                  placeholder="03XX XXXXXXX"
                />
              </Field>

              <Field label="Street Address" error={errors.line1}>
                <input
                  {...register("line1", { required: "Required" })}
                  className={fieldClass(errors.line1)}
                  placeholder="House #, Street, Road"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Area" error={errors.area}>
                  <input
                    {...register("area", { required: "Required" })}
                    className={fieldClass(errors.area)}
                    placeholder="e.g. Model Colony"
                  />
                </Field>
                <Field label="City" error={errors.city}>
                  <input
                    {...register("city", { required: "Required" })}
                    className={fieldClass(errors.city)}
                    placeholder="e.g. Sukkur"
                  />
                </Field>
              </div>

              <Field label="Label">
                <select {...register("label")} defaultValue="Home" className={fieldClass(null)}>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={saving}
                className="h-10 rounded-[var(--radius-sm)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function fieldClass(error) {
  return clsx(
    "w-full h-10 px-3 rounded-[var(--radius-sm)] border text-sm focus:outline-none focus:ring-[3px] transition-all",
    error
      ? "border-danger-600 bg-danger-100/40 focus:ring-danger-600/10"
      : "border-border-strong focus:border-orchard-700 focus:ring-orchard-900/10"
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-charcoal-600 mb-1 block">{label}</label>
      {children}
      {error && <p className="text-xs text-danger-600 mt-1">{error.message}</p>}
    </div>
  );
}