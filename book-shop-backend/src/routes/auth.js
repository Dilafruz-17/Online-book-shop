import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(1, "Iltimos, ismingizni kiriting."),
  email: z.string().trim().toLowerCase().email("Iltimos, to'g'ri elektron pochta kiriting."),
  password: z.string().min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak."),
});
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Elektron pochta noto'g'ri."),
  password: z.string().min(1, "Parolni kiriting."),
});

const makeToken = (u) =>
  jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

router.post("/register", (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const { name, email, password } = parsed.data;

  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email))
    return res.status(409).json({ error: "Bu elektron pochta allaqachon ro'yxatdan o'tgan." });

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?,?,?)")
    .run(name, email, hash);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);

  res.status(201).json({ token: makeToken(user), user: publicUser(user) });
});

router.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const { email, password } = parsed.data;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: "Elektron pochta yoki parol noto'g'ri." });

  res.json({ token: makeToken(user), user: publicUser(user) });
});

router.get("/me", requireAuth, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(401).json({ error: "Foydalanuvchi topilmadi." });
  res.json({ user: publicUser(user) });
});

export default router;