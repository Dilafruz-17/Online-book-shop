import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api, getToken, setToken } from "./api.js";

const Ctx = createContext();
export const useStore = () => useContext(Ctx);

const loadGuestCart = () => {
  try { return JSON.parse(localStorage.getItem("cart")) ?? []; }
  catch { return []; }
};

export function StoreProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [cart, setCart] = useState(loadGuestCart);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  // Kitoblar va janrlar serverdan
  useEffect(() => {
    Promise.all([api("/books"), api("/genres")])
      .then(([b, g]) => { setBooks(b); setGenres(g); })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Sahifa ochilganda: token bo'lsa, foydalanuvchi va savatni tiklash
  useEffect(() => {
    (async () => {
      if (getToken()) {
        try {
          const data = await api("/auth/me");
          setUser(data.user);
          setCart(await api("/cart"));
        } catch {
          setToken(null);
          setUser(null);
        }
      }
      setReady(true);
    })();
  }, []);

  // Mehmonning savati brauzerda saqlanadi
  useEffect(() => {
    if (!user) localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, user]);

  const notify = (text, link) => {
    setToast({ text, link, key: Date.now() });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2500);
  };

  // ===== Savat =====
  const addToCart = async (id) => {
    const book = books.find((b) => b.id === id);
    try {
      if (user) {
        setCart(await api("/cart", { method: "POST", body: { bookId: id, qty: 1 } }));
      } else {
        setCart((c) =>
          c.some((i) => i.id === id)
            ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
            : [...c, { id, qty: 1 }]
        );
      }
      notify(`"${book ? book.title : "Kitob"}" savatga qo'shildi`, true);
    } catch (e) {
      notify(e.message);
    }
  };

  const setQty = async (id, qty) => {
    try {
      if (user) {
        setCart(await api(`/cart/${id}`, { method: "PATCH", body: { qty } }));
      } else {
        setCart((c) =>
          qty < 1 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty } : i))
        );
      }
    } catch (e) {
      notify(e.message);
    }
  };

  const clearCart = async () => {
    try {
      if (user) await api("/cart", { method: "DELETE" });
      setCart([]);
    } catch (e) {
      notify(e.message);
    }
  };

  // ===== Kirish va ro'yxatdan o'tish =====
  const finishAuth = async (data, guestCart) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.removeItem("cart");
    try {
      for (const i of guestCart) {
        await api("/cart", { method: "POST", body: { bookId: i.id, qty: Math.min(i.qty, 50) } });
      }
      setCart(await api("/cart"));
    } catch {
      setCart([]);
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const data = await api("/auth/register", { method: "POST", body: { name, email, password } });
      await finishAuth(data, cart);
      notify("Hisob yaratildi. Xush kelibsiz!");
      return null;
    } catch (e) {
      return e.message;
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api("/auth/login", { method: "POST", body: { email, password } });
      await finishAuth(data, cart);
      notify(`Xush kelibsiz, ${data.user.name}!`);
      return null;
    } catch (e) {
      return e.message;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCart([]);
    notify("Siz tizimdan chiqdingiz.");
  };

  // ===== Buyurtma =====
  const placeOrder = async ({ address, phone }) => {
    try {
      const order = await api("/orders", { method: "POST", body: { address, phone } });
      setCart([]);
      notify("Buyurtmangiz qabul qilindi!");
      return { order };
    } catch (e) {
      return { error: e.message };
    }
  };

  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider
      value={{
        books, genres, loading, loadError,
        cart, count, addToCart, setQty, clearCart,
        user, ready, register, login, logout,
        placeOrder, toast,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}