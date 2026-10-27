import { Router } from "express";
import { z } from "zod";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const getCart = (userId) =>
  db.prepare("SELECT book_id AS id, qty FROM cart_items WHERE user_id = ? ORDER BY rowid").all(userId);

router.get("/", (req, res) => res.json(getCart(req.user.id)));

router.post("/", (req, res) => {
  const parsed = z
    .object({ bookId: z.number().int(), qty: z.number().int().min(1).max(50).default(1) })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Noto'g'ri ma'lumot." });
  const { bookId, qty } = parsed.data;

  if (!db.prepare("SELECT id FROM books WHERE id = ?").get(bookId))
    return res.status(404).json({ error: "Kitob topilmadi." });

  db.prepare(
    `INSERT INTO cart_items (user_id, book_id, qty) VALUES (?,?,?)
     ON CONFLICT(user_id, book_id) DO UPDATE SET qty = qty + excluded.qty`
  ).run(req.user.id, bookId, qty);

  res.json(getCart(req.user.id));
});

router.patch("/:bookId", (req, res) => {
  const parsed = z.object({ qty: z.number().int().max(50) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Noto'g'ri ma'lumot." });
  const bookId = Number(req.params.bookId);

  if (parsed.data.qty < 1)
    db.prepare("DELETE FROM cart_items WHERE user_id = ? AND book_id = ?").run(req.user.id, bookId);
  else
    db.prepare("UPDATE cart_items SET qty = ? WHERE user_id = ? AND book_id = ?").run(
      parsed.data.qty, req.user.id, bookId
    );

  res.json(getCart(req.user.id));
});

router.delete("/", (req, res) => {
  db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(req.user.id);
  res.json([]);
});

export default router;