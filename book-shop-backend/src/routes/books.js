import { Router } from "express";
import db from "../db.js";

const router = Router();

const toBook = (b) => ({
  id: b.id,
  title: b.title,
  author: b.author,
  price: b.price,
  genre: b.genre,
  rating: b.rating,
  isbn: b.isbn,
  desc: b.description,
  color: b.color,
});

const SORTS = {
  popular: "id ASC",
  rating: "rating DESC",
  low: "price ASC",
  high: "price DESC",
};

router.get("/books", (req, res) => {
  const { q = "", genre = "", sort = "popular" } = req.query;
  const where = [];
  const params = [];

  if (genre) { where.push("genre = ?"); params.push(genre); }
  if (q) {
    where.push("(LOWER(title) LIKE ? OR LOWER(author) LIKE ?)");
    const like = `%${String(q).toLowerCase()}%`;
    params.push(like, like);
  }

  const sql =
    "SELECT * FROM books" +
    (where.length ? " WHERE " + where.join(" AND ") : "") +
    " ORDER BY " + (SORTS[sort] || SORTS.popular);

  res.json(db.prepare(sql).all(...params).map(toBook));
});

router.get("/books/:id", (req, res) => {
  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Kitob topilmadi." });

  const related = db
    .prepare("SELECT * FROM books WHERE genre = ? AND id != ? LIMIT 4")
    .all(book.genre, book.id);

  res.json({ ...toBook(book), related: related.map(toBook) });
});

router.get("/genres", (req, res) => {
  const rows = db.prepare("SELECT DISTINCT genre FROM books ORDER BY genre").all();
  res.json(rows.map((r) => r.genre));
});

export default router;