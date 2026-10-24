import { useSearchParams } from "react-router-dom";
import { books, genres } from "../data.js";
import BookCard from "../components/BookCard.jsx";

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();
  const genre = params.get("genre") || "";
  const sort = params.get("sort") || "popular";

  const set = (key, value) => {
    const p = new URLSearchParams(params);
    value ? p.set(key, value) : p.delete(key);
    setParams(p);
  };

  let list = books.filter(
    (b) => (!genre || b.genre === genre) && (!q || (b.title + " " + b.author).toLowerCase().includes(q))
  );
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

  return (
    <div className="w sec">
      <h1>Barcha kitoblar</h1>
      <div className="shop-layout">
        <aside className="box side">
          <b>Janr</b>
          <button className={"link " + (!genre ? "on" : "")} onClick={() => set("genre", "")}>Barchasi</button>
          {genres.map((g) => (
            <button key={g} className={"link " + (genre === g ? "on" : "")} onClick={() => set("genre", g)}>{g}</button>
          ))}
          <b>Saralash</b>
          <select value={sort} onChange={(e) => set("sort", e.target.value)} aria-label="Saralash">
            <option value="popular">Mashhur</option>
            <option value="rating">Reyting bo'yicha</option>
            <option value="low">Narx: arzondan qimmatga</option>
            <option value="high">Narx: qimmatdan arzonga</option>
          </select>
        </aside>
        <div>
          <p className="muted">{list.length} ta kitob topildi</p>
          {list.length ? (
            <div className="grid">{list.map((b) => <BookCard key={b.id} book={b} />)}</div>
          ) : (
            <p>Qidiruv bo'yicha kitob topilmadi.</p>
          )}
        </div>
      </div>
    </div>
  );
}