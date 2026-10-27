import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import "./db.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";

if (!process.env.JWT_SECRET) {
  console.error(".env faylida JWT_SECRET yo'q!");
  process.exit(1);
}

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

// Parol tanlab hujum qilishdan himoya: 15 daqiqada 30 ta urinish
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: { error: "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring." },
  })
);

app.get("/.well-known/*path", (req, res) => res.status(204).end());
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api", (req, res) => res.status(404).json({ error: "Bunday manzil yo'q." }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Serverda xatolik yuz berdi." });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server ishlayapti: http://localhost:${port}`));