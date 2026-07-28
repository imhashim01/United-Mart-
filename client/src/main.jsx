import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./styles/index.css";
import { useAuthStore } from "./features/auth/hooks/useAuth.js";

function AuthBootstrap() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

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
          style: {
            borderRadius: "10px",
            background: "#1E211F",
            color: "#fff",
            fontSize: "13px",
            padding: "10px 14px",
          },
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
