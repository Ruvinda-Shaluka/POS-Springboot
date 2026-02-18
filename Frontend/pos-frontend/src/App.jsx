import React, { useEffect, useState } from "react";
import AppRouter from "./routes/AppRouter";
import Toast from "./components/ui/Toast";

export const AppCtx = React.createContext(null);

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const [toast, setToast] = useState(null);

  const [orderSeq, setOrderSeq] = useState(1);

  const showToast = (message, type = "info") => {
    setToast({ id: Date.now(), message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const ctxValue = {
    customers,
    setCustomers,
    items,
    setItems,
    orders,
    setOrders,
    orderSeq,
    setOrderSeq,
    showToast,
  };

  return (
    <AppCtx.Provider value={ctxValue}>
      <div className="min-h-screen bg-zinc-950 text-white">
        <AppRouter />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </AppCtx.Provider>
  );
}
