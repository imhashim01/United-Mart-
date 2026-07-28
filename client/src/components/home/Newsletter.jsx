import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2 } from "lucide-react";
import { fadeUp, viewportOnce } from "../../animations/variants";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setStatus("loading");
    // Replace with real newsletter API call
    setTimeout(() => setStatus("success"), 900);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative overflow-hidden rounded-[var(--radius-xl)] bg-orchard-900 px-6 py-12 md:px-16 md:py-16 text-center"
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle, #E8A33D 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

        <div className="relative max-w-lg mx-auto">
          <div className="h-14 w-14 mx-auto rounded-full bg-mango-500/15 flex items-center justify-center mb-5">
            <Mail size={24} className="text-mango-500" />
          </div>
          <h2 className="font-display text-2xl md:text-[32px] text-white mb-2.5">
            Get fresh deals in your inbox
          </h2>
          <p className="text-white/65 text-sm md:text-base mb-7">
            Weekly discounts, new arrivals, and early access to seasonal produce —
            no spam, unsubscribe anytime.
          </p>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 bg-success-100 text-success-600 font-semibold text-sm px-5 py-3.5 rounded-[var(--radius-md)]"
              >
                <CheckCircle2 size={18} />
                You&apos;re in! Check your inbox to confirm.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col sm:flex-row gap-2.5"
              >
                <div className="flex-1 text-left">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="you@example.com"
                    className="w-full h-12 px-4 rounded-[var(--radius-md)] bg-white text-sm text-charcoal-900 placeholder:text-charcoal-300 border border-transparent focus:outline-none focus:ring-[3px] focus:ring-mango-500/30"
                  />
                  {error && (
                    <p className="text-xs text-danger-100 mt-1.5 text-left">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-12 px-6 rounded-[var(--radius-md)] bg-mango-500 text-charcoal-900 font-semibold text-sm hover:brightness-95 disabled:opacity-70 transition-all shrink-0"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
