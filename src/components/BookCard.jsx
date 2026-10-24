import { Link } from "react-router-dom";
import { money } from "../data.js";
import { useStore } from "../store.jsx";
import Cover from "./Cover.jsx";

export default function BookCard({ book }) {
  const { addToCart } = useStore();
  return (
    <div className="card">
      <Link to={`/book/${book.id}`}>
        <Cover book={book} />
      </Link>
      <div className="card-title">{book.title}</div>
      <div className="muted">{book.author}</div>
      <div className="card-foot">
        <span>{money(book.price)}</span>
        <button className="btn small" onClick={() => addToCart(book.id)}>Qo'shish</button>
      </div>
    </div>
  );
}