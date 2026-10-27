import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api.js";
import { money } from "../data.js";
import { useStore } from "../store.jsx";

export default function Orders() {
  const { user, ready } = useStore();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    api("/orders").then(setOrders).catch((e) => setError(e.message));
  }, [user]);

  if (!ready) return <div className="w sec"><p>Yuklanmoqda...</p></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="w sec">
      <h1>Mening buyurtmalarim</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {!orders && !error && <p>Yuklanmoqda...</p>}
      {orders && orders.length === 0 && (
        <>
          <p>Sizda hali buyurtma yo'q.</p>
          <Link to="/shop" className="btn">Kitoblarni ko'rish</Link>
        </>
      )}
      <div className="orders">
        {orders &&
          orders.map((o) => (
            <div className="box order" key={o.id}>
              <div className="order-head">
                <b>Buyurtma #{o.id}</b>
                <span className="badge">{o.status}</span>
              </div>
              <p className="muted">{o.created_at.slice(0, 16)} · {o.address} · {o.phone}</p>
              {o.items.map((it) => (
                <p key={it.bookId}><span>{it.title} × {it.qty}</span><span>{money(it.price * it.qty)}</span></p>
              ))}
              <p className="total"><span>Jami</span><span>{money(o.total)}</span></p>
            </div>
          ))}
      </div>
    </div>
  );
}