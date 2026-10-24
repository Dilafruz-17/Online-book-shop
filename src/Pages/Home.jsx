import { Link } from "react-router-dom";
import { books, genres } from "../data.js";
import BookCard from "../components/BookCard.jsx";
import Cover from "../components/Cover.jsx";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="w hero-row">
          <div>
            <h1>Keyingi sevimli kitobingizni toping</h1>
            <p>10 000 dan ortiq kitob. $30 dan yuqori buyurtmalarda yetkazib berish bepul.</p>
            <Link to="/shop" className="btn light">Barcha kitoblar</Link>
          </div>
          <div className="hero-covers">
            {books.slice(0, 3).map((b) => (
              <Cover key={b.id} book={b} />
            ))}
          </div>
        </div>
      </section>
      <section className="w sec">
        <div className="chips">
          {genres.map((g) => (
            <Link key={g} className="btn outline" to={`/shop?genre=${encodeURIComponent(g)}`}>{g}</Link>
          ))}
        </div>
        <h2>Eng ko'p sotilganlar</h2>
        <div className="grid">{books.slice(0, 4).map((b) => <BookCard key={b.id} book={b} />)}</div>
        <h2>Yangi kitoblar</h2>
        <div className="grid">{books.slice(4, 8).map((b) => <BookCard key={b.id} book={b} />)}</div>
      </section>
    </>
  );
}