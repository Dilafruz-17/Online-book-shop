import { Router } from "express";
import { z } from "zod";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const orderSchema = z.object({
  address: z.string().trim().min(5, "Manzilni to'liq kiriting."),
  phone: z.string().trim().min(7, "Telefon raqamini kiriting."),
});

router.post("/", (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const { address, phone } = parsed.data;

  const items = db
    .prepare(
      `SELECT b.id, b.title, b.price, c.qty FROM cart_items c
       JOIN books b ON b.id = c.book_id WHERE c.user_id = ?`
    )
    .all(req.user.id);
  if (!items.length) return res.status(400).json({ error: "Savatingiz bo'sh." });

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= 30 ? 0 : 4;
  const total = subtotal + delivery;

  const orderId = db.transaction(() => {
    const info = db
      .prepare(
        "INSERT INTO orders (user_id, subtotal, delivery, total, address, phone) VALUES (?,?,?,?,?,?)"
      )
      .run(req.user.id, subtotal, delivery, total, address, phone);
    const add = db.prepare(
      "INSERT INTO order_items (order_id, book_id, title, price, qty) VALUES (?,?,?,?,?)"
    );
    items.forEach((i) => add.run(info.lastInsertRowid, i.id, i.title, i.price, i.qty));
    db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(req.user.id);
    return info.lastInsertRowid;
  })();

  res.status(201).json({ id: orderId, subtotal, delivery, total, status: "yangi" });
});

router.get("/", (req, res) => {
  const orders = db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC")
    .all(req.user.id);
  const itemsStmt = db.prepare(
    "SELECT book_id AS bookId, title, price, qty FROM order_items WHERE order_id = ?"
  );
  res.json(orders.map((o) => ({ ...o, items: itemsStmt.all(o.id) })));
});

export default router;