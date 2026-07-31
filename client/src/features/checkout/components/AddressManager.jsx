import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MapPin, Plus, Check, Home, Briefcase, X } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "../../auth/hooks/useAuth";
import { addMyAddress, getMe } from "../../auth/api/authApi";

const ADDRESS_ICONS = { home: Home, work: Briefcase, other: MapPin };

const normalizeAddress = (address) => ({
  ...address,
  id: address.id ?? address._id ?? `addr-${Date.now()}`,
  area: address.area ?? address.state ?? "",
});

export default function AddressManager({ selectedId, onSelect, onAddressChange }) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [addresses, setAddresses] = useState(
    user?.addresses?.map(normalizeAddress) ?? []
  );
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses.map(normalizeAddress));
    }
  }, [user?.addresses]);

  // If the user exists but has no addresses loaded (possible stale auth state),
  // refresh the profile from the server to ensure persisted addresses are available.
  useEffect(() => {
    let mounted = true;
    const refreshUser = async () => {
      if (!user) return;
      if (Array.isArray(user.addresses) && user.addresses.length > 0) return;
      try {
        const resp = await getMe();
        if (!mounted) return;
        const fresh = resp.data.data;
        if (fresh?.addresses) {
          setAddresses(fresh.addresses.map(normalizeAddress));
          // also update auth store so other components see the fresh addresses
          useAuthStore.getState().setUser(fresh);
        }
      } catch (err) {
        // ignore — keep current state
      }
    };
    refreshUser();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (addresses.length === 0) {
      setShowForm(true);
      return;
    }

    if (!selectedId && addresses.length > 0) {
      onSelect(addresses[0].id);
      onAddressChange?.(addresses[0]);
      setShowForm(false);
      return;
    }

    if (selectedId) {
      const selected = addresses.find((addr) => addr.id === selectedId);
      if (selected) {
        onAddressChange?.(selected);
      }
    }
  }, [addresses, selectedId, onSelect, onAddressChange]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const newAddress = {
      label: data.label,
      name: data.name,
      phone: data.phone,
      line1: data.line1,
      city: data.city,
      state: data.area,
      postalCode: data.postalCode,
      country: data.country || "Pakistan",
      isDefault: addresses.length === 0,
    };

    if (user) {
      try {
        const response = await addMyAddress(newAddress);
        const updatedUser = response.data.data;
        setUser(updatedUser);
        const savedAddresses = (updatedUser.addresses ?? []).map(normalizeAddress);
        setAddresses(savedAddresses);
        const addedAddress = savedAddresses.find(
          (address) =>
            address.line1 === newAddress.line1 &&
            address.phone === newAddress.phone &&
            address.city === newAddress.city
        ) ?? savedAddresses[savedAddresses.length - 1];
        onSelect(addedAddress?.id);
        onAddressChange?.(addedAddress);
        reset();
        setShowForm(false);
        toast.success('Address saved successfully');
        return;
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to save address';
        toast.error(message);
        return;
      }
    }

    const localAddress = { ...newAddress, id: `addr-${Date.now()}` };
    setAddresses((prev) => [...prev, localAddress]);
    onSelect(localAddress.id);
    onAddressChange?.(localAddress);
    reset();
    setShowForm(false);
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

      <div className="flex flex-col gap-2.5">
        {addresses.map((addr) => {
          const Icon = ADDRESS_ICONS[addr.label] ?? MapPin;
          const selected = selectedId === addr.id;
          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => {
                onSelect(addr.id);
                onAddressChange?.(addr);
              }}
              className={clsx(
                "text-left p-3.5 rounded-[var(--radius-sm)] border-2 transition-colors flex items-start gap-3",
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
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-charcoal-900 capitalize">{addr.label}</p>
                  {addr.isDefault && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-charcoal-600 bg-linen-50 px-1.5 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-charcoal-900">{addr.name} · {addr.phone}</p>
                <p className="text-xs text-charcoal-600">{addr.line1}, {addr.area}, {addr.city}</p>
              </div>
              {selected && <Check size={18} className="text-orchard-900 shrink-0" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-3 border-t border-border flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-charcoal-900">New Address</p>
                <button type="button" onClick={() => setShowForm(false)} aria-label="Cancel">
                  <X size={16} className="text-charcoal-600" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Full Name" error={errors.name}>
                  <input
                    {...register("name", { required: "Required" })}
                    className={fieldClass(errors.name)}
                    placeholder="Full name"
                  />
                </Field>
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
              </div>

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
                <select {...register("label")} defaultValue="home" className={fieldClass(null)}>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              <button
                type="submit"
                className="h-10 rounded-[var(--radius-sm)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors"
              >
                Save Address
              </button>
            </div>
          </motion.form>
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
