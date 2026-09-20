import { useFormContext } from "react-hook-form";
import { MapPin } from "lucide-react";
import clsx from "clsx";

// One-time delivery details for a guest order — nothing here is saved to an
// account. Fields mirror AddressManager's shape (line1/area/city/phone) plus
// a name, since a guest has no account to read one from.
export default function GuestDetailsForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="border border-border rounded-[var(--radius-md)] p-4">
      <p className="text-sm font-semibold text-charcoal-900 flex items-center gap-1.5 mb-1">
        <MapPin size={15} className="text-orchard-700" />
        Delivery Details
      </p>
      <p className="text-xs text-charcoal-600 mb-3">
        Checking out as a guest — these details are used for this order only and won&apos;t be saved.
      </p>

      <div className="flex flex-col gap-3">
        <Field label="Full Name" error={errors.guestName}>
          <input
            {...register("guestName", { required: "Required" })}
            className={fieldClass(errors.guestName)}
            placeholder="e.g. Ayesha Khan"
          />
        </Field>

        <Field label="Phone" error={errors.guestPhone}>
          <input
            {...register("guestPhone", {
              required: "Required",
              pattern: { value: /^[0-9\s+-]{10,15}$/, message: "Invalid phone number" },
            })}
            className={fieldClass(errors.guestPhone)}
            placeholder="03XX XXXXXXX"
          />
        </Field>

        <Field label="Street Address" error={errors.guestLine1}>
          <input
            {...register("guestLine1", { required: "Required" })}
            className={fieldClass(errors.guestLine1)}
            placeholder="House #, Street, Road"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Area" error={errors.guestArea}>
            <input
              {...register("guestArea", { required: "Required" })}
              className={fieldClass(errors.guestArea)}
              placeholder="e.g. Model Colony"
            />
          </Field>
          <Field label="City" error={errors.guestCity}>
            <input
              {...register("guestCity", { required: "Required" })}
              className={fieldClass(errors.guestCity)}
              placeholder="e.g. Sukkur"
            />
          </Field>
        </div>
      </div>
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
