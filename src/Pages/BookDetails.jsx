import { useParams } from "react-router-dom";
import { money } from "../data.js";
import { useStore } from "../store.jsx";
import BookCard from "../components/BookCard.jsx";
import Cover from "../components/Cover.jsx";
import NotFound from "./NotFound.jsx";

export default function BookDetails() {
  const { id } = useParams();
  const { books, loading, addToCart } = useStore();

  if (loading) return <div className="w sec"><p>Yuklanmoqda...</p></div>;

  const book = books.find((b) => b.id === Number(id));
  if (!book) return <NotFound />;
  const related = books.filter((b) => b.genre === book.genre && b.id !== book.id).slice(0, 4);

  return (
    <div className="w sec">
      <div className="detail">
        <Cover book={book} size="big" />
        <div className="detail-info">
          <h1>{book.title}</h1>
          <p className="muted">Muallif: {book.author} · Reyting: {book.rating} / 5 · {book.genre}</p>
          <p className="price">{money(book.price)}</p>
          <p>{book.desc}</p>
          <button className="btn" onClick={() => addToCart(book.id)}>Savatga qo'shish</button>
        </div>
      </div>
      {related.length > 0 && (
        <>
          <h2>O'xshash kitoblar</h2>
          <div className="grid">{related.map((b) => <BookCard key={b.id} book={b} />)}</div>
        </>
      )}
    </div>
  );
}