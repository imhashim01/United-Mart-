import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./styles/index.css";
import { useAuthStore } from "./features/auth/hooks/useAuth.js";
import { loadProducts, loadCategories, loadBrands } from "./data/productsData.js";

function AuthBootstrap() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const [catalogReady, setCatalogReady] = useState(false);

  useEffect(() => {
    hydrate();
    // Fetch the live catalog from the real backend before rendering pages
    // that read it — this is what keeps every device/browser in sync,
    // instead of each one showing its own stale local copy.
    Promise.all([loadProducts(), loadCategories(), loadBrands()]).finally(() => {
      setCatalogReady(true);
    });
  }, [hydrate]);

  if (!catalogReady) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #E4E1D8", borderTopColor: "#173A2E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <App />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root");
const root = window.__UMS_REACT_ROOT__ || createRoot(rootElement);
window.__UMS_REACT_ROOT__ = root;

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2500,
          style: { borderRadius: "10px", background: "#1E211F", color: "#fff", fontSize: "13px", padding: "10px 14px" },
        }}
      />
    </QueryClientProvider>
  </StrictMode>
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    root.unmount();
    delete window.__UMS_REACT_ROOT__;
  });
}