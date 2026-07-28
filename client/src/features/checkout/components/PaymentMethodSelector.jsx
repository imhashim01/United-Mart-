import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, Smartphone, Landmark, Check, Copy, CreditCard } from "lucide-react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";

const METHODS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay with cash when your order arrives",
    icon: Banknote,
  },
  {
    id: "jazzcash",
    label: "JazzCash",
    description: "Pay instantly via JazzCash mobile wallet",
    icon: Smartphone,
  },
  {
    id: "easypaisa",
    label: "EasyPaisa",
    description: "Pay instantly via EasyPaisa mobile wallet",
    icon: Smartphone,
  },
  {
    id: "bank",
    label: "Bank Transfer",
    description: "Transfer directly to our bank account",
    icon: Landmark,
  },
];

export default function PaymentMethodSelector({ selected, onSelect }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [copied, setCopied] = useState("");

  const handleCopy = async (value) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="border border-border rounded-[var(--radius-md)] p-4 bg-white shadow-sm">
      <p className="text-sm font-semibold text-charcoal-900 mb-3">Payment Method</p>

      <div className="flex flex-col gap-2.5">
        {METHODS.map((method) => {
          const isSelected = selected === method.id;
          return (
            <div key={method.id}>
              <button
                type="button"
                onClick={() => onSelect(method.id)}
                className={clsx(
                  "w-full text-left p-3.5 rounded-[var(--radius-sm)] border-2 transition-colors flex items-center gap-3",
                  isSelected ? "border-orchard-900 bg-linen-50" : "border-border hover:border-border-strong"
                )}
              >
                <div
                  className={clsx(
                    "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                    isSelected ? "bg-orchard-900 text-white" : "bg-linen-50 text-charcoal-600"
                  )}
                >
                  <method.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-charcoal-900">{method.label}</p>
                  <p className="text-xs text-charcoal-600">{method.description}</p>
                </div>
                {isSelected && <Check size={18} className="text-orchard-900 shrink-0" />}
              </button>

              <AnimatePresence>
                {isSelected && method.id === "jazzcash" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <PaymentInfoCard
                      title="JazzCash Payment"
                      fields={[
                        { label: "JazzCash Number", value: "03142175028" },
                        { label: "Account Title", value: "Abdul Rehman" },
                      ]}
                      instructions={[
                        "Send the payment to the JazzCash number above.",
                        "Enter the mobile number used for the payment.",
                        "Click \"Complete Secure Order\".",
                        "Our team will verify your payment before processing your order.",
                      ]}
                      onCopy={handleCopy}
                      copied={copied}
                    />
                    <div className="p-3.5 pt-2">
                      <label className="text-xs font-medium text-charcoal-600 mb-1 block">
                        Mobile Number Used for Payment
                      </label>
                      <input
                        {...register("walletNumber", {
                          required: "Please enter the mobile number used to complete your JazzCash payment.",
                          pattern: {
                            value: /^03[0-9]{9}$/,
                            message: "Enter the JazzCash number used for payment, e.g. 03001234567.",
                          },
                        })}
                        placeholder="03XXXXXXXXX"
                        className={clsx(
                          "w-full h-10 px-3 rounded-[var(--radius-sm)] border text-sm focus:outline-none focus:ring-[3px] transition-all",
                          errors.walletNumber
                            ? "border-danger-600 bg-danger-100/40 focus:ring-danger-600/10"
                            : "border-border-strong focus:border-orchard-700 focus:ring-orchard-900/10"
                        )}
                      />
                      {errors.walletNumber && (
                        <p className="text-xs text-danger-600 mt-1">{errors.walletNumber.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {isSelected && method.id === "easypaisa" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <PaymentInfoCard
                      title="EasyPaisa Payment"
                      fields={[
                        { label: "EasyPaisa Number", value: "03142175028" },
                        { label: "Account Title", value: "Abdul Rehman" },
                      ]}
                      instructions={[
                        "Send payment to the EasyPaisa account.",
                        "Enter the number used for payment.",
                        "Complete your order.",
                      ]}
                      onCopy={handleCopy}
                      copied={copied}
                    />
                    <div className="p-3.5 pt-2">
                      <label className="text-xs font-medium text-charcoal-600 mb-1 block">
                        Mobile Number Used for Payment
                      </label>
                      <input
                        {...register("walletNumber", {
                          required: "Please enter the mobile number used to complete your EasyPaisa payment.",
                          pattern: {
                            value: /^03[0-9]{9}$/,
                            message: "Enter the EasyPaisa number used for payment, e.g. 03001234567.",
                          },
                        })}
                        placeholder="03XXXXXXXXX"
                        className={clsx(
                          "w-full h-10 px-3 rounded-[var(--radius-sm)] border text-sm focus:outline-none focus:ring-[3px] transition-all",
                          errors.walletNumber
                            ? "border-danger-600 bg-danger-100/40 focus:ring-danger-600/10"
                            : "border-border-strong focus:border-orchard-700 focus:ring-orchard-900/10"
                        )}
                      />
                      {errors.walletNumber && (
                        <p className="text-xs text-danger-600 mt-1">{errors.walletNumber.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {isSelected && method.id === "bank" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <PaymentInfoCard
                      title="Bank Transfer"
                      fields={[
                        { label: "Bank Name", value: "Faysal Bank" },
                        { label: "Account Title", value: "Abdul Rehman" },
                        { label: "IBAN", value: "PK24FAYS3301301000003716" },
                      ]}
                      instructions={[
                        "Transfer the total amount.",
                        "Use your Order ID as the payment reference.",
                        "Upload the payment screenshot (optional).",
                        "Our team will verify the transfer.",
                      ]}
                      onCopy={handleCopy}
                      copied={copied}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PaymentInfoCard({ title, fields, instructions, onCopy, copied }) {
  return (
    <div className="border border-border rounded-[var(--radius-md)] bg-mint-50/40 p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-charcoal-900">{title}</p>
          <p className="text-xs text-charcoal-600">Save the details and complete your payment before placing the order.</p>
        </div>
        <CreditCard size={20} className="text-orchard-700" />
      </div>
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-white p-3 border border-border">
            <div>
              <p className="text-xs text-charcoal-600">{field.label}</p>
              <p className="text-sm font-semibold text-charcoal-900">{field.value}</p>
            </div>
            <button
              type="button"
              onClick={() => onCopy(field.value)}
              className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-border-strong bg-linen-50 px-3 py-2 text-xs font-semibold text-orchard-900 hover:bg-orchard-900/10 transition-colors"
            >
              <Copy size={14} />
              {copied === field.value ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-charcoal-600 space-y-2">
        {instructions.map((step, index) => (
          <p key={index} className="flex items-start gap-2">
            <span className="mt-0.5 text-mango-500">•</span>
            {step}
          </p>
        ))}
      </div>
    </div>
  );
}
