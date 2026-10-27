import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { money } from "../data.js";
import { useStore } from "../store.jsx";

export default function Checkout() {
  const { books, cart, user, ready, placeOrder } = useStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!ready) return <div className="w sec"><p>Yuklanmoqda...</p></div>;
  if (!user) return <Navigate to="/login" replace />;

  const rows = cart.map((i) => ({ ...i, book: books.find((b) => b.id === i.id) })).filter((r) => r.book);
  const subtotal = rows.reduce((s, r) => s + r.book.price * r.qty, 0);
  const delivery = subtotal === 0 || subtotal >= 30 ? 0 : 4;

  if (!rows.length)
    return (
      <div className="w sec">
        <h1>Buyurtma</h1>
        <p>Savatingiz bo'sh.</p>
        <Link to="/shop" className="btn">Kitoblarni ko'rish</Link>
      </div>
    );

  const submit = async (e) => {
    e.preventDefault();
    if (address.trim().length < 5) return setError("Manzilni to'liq kiriting.");
    if (phone.trim().length < 7) return setError("Telefon raqamini kiriting.");
    setBusy(true);
    setError("");
    const res = await placeOrder({ address, phone });
    setBusy(false);
    if (res.error) return setError(res.error);
    navigate("/orders");
  };

  return (
    <div className="w sec">
      <h1>Buyurtmani rasmiylashtirish</h1>
      <div className="cart-layout">
        <form className="box cart-list" onSubmit={submit}>
          <h3>Yetkazib berish ma'lumotlari</h3>
          <label htmlFor="a">Manzil</label>
          <input id="a" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shahar, ko'cha, uy" />
          <label htmlFor="t">Telefon raqami</label>
          <input id="t" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
          <p className="muted" style={{ marginTop: 16 }}>To'lov: yetkazib berilganda naqd pul (sinov rejimi).</p>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn full" type="submit" disabled={busy}>
            {busy ? "Kutib turing..." : "Buyurtma berish"}
          </button>
        </form>

        <div className="box summary">
          <h3>Buyurtmangiz</h3>
          {rows.map(({ book, qty }) => (
            <p key={book.id}><span>{book.title} × {qty}</span><span>{money(book.price * qty)}</span></p>
          ))}
          <p><span>Yetkazib berish</span><span>{delivery ? money(delivery) : "Bepul"}</span></p>
          <p className="total"><span>Jami</span><span>{money(subtotal + delivery)}</span></p>
        </div>
      </div>
    </div>
  );
}