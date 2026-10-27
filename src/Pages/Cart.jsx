import { Link } from "react-router-dom";
import { money } from "../data.js";
import { useStore } from "../store.jsx";
import Cover from "../components/Cover.jsx";

export default function Cart() {
  const { books, loading, cart, setQty, clearCart, user } = useStore();

  if (loading) return <div className="w sec"><p>Yuklanmoqda...</p></div>;

  const rows = cart.map((i) => ({ ...i, book: books.find((b) => b.id === i.id) })).filter((r) => r.book);
  const subtotal = rows.reduce((s, r) => s + r.book.price * r.qty, 0);
  const delivery = subtotal === 0 || subtotal >= 30 ? 0 : 4;

  if (!rows.length)
    return (
      <div className="w sec">
        <h1>Savat</h1>
        <p>Savatingiz bo'sh.</p>
        <Link to="/shop" className="btn">Kitoblarni ko'rish</Link>
      </div>
    );

  return (
    <div className="w sec">
      <h1>Savat</h1>
      <div className="cart-layout">
        <div className="box cart-list">
          {rows.map(({ book, qty }) => (
            <div className="cart-row" key={book.id}>
              <Cover book={book} size="mini" />
              <div className="grow">
                <b>{book.title}</b>
                <div className="muted">{book.author}</div>
              </div>
              <div className="qty">
                <button onClick={() => setQty(book.id, qty - 1)} aria-label="Kamaytirish">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(book.id, qty + 1)} aria-label="Ko'paytirish">+</button>
              </div>
              <div className="line-total">{money(book.price * qty)}</div>
            </div>
          ))}
          <button className="link" onClick={clearCart}>Savatni tozalash</button>
        </div>
        <div className="box summary">
          <h3>Buyurtma xulosasi</h3>
          <p><span>Oraliq summa</span><span>{money(subtotal)}</span></p>
          <p><span>Yetkazib berish</span><span>{delivery ? money(delivery) : "Bepul"}</span></p>
          <p className="total"><span>Jami</span><span>{money(subtotal + delivery)}</span></p>
          {user ? (
            <Link to="/checkout" className="btn full">Buyurtmani rasmiylashtirish</Link>
          ) : (
            <Link to="/login" className="btn full">Rasmiylashtirish uchun kiring</Link>
          )}
        </div>
      </div>
    </div>
  );
}