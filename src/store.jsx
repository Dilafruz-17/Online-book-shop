import { createContext, useContext, useEffect, useRef, useState } from "react";
import { books } from "./data.js";

const Ctx = createContext();
export const useStore = () => useContext(Ctx);

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load("cart", []));
  const [users, setUsers] = useState(() => load("users", []));
  const [user, setUser] = useState(() => load("user", null));
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("users", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("user", JSON.stringify(user)), [user]);

  const notify = (text, link) => {
    setToast({ text, link, key: Date.now() });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (id) => {
    const book = books.find((b) => b.id === id);
    setCart((c) =>
      c.some((i) => i.id === id)
        ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { id, qty: 1 }]
    );
    notify(`"${book ? book.title : "Book"}" added to cart`, true);
  };
  const setQty = (id, qty) =>
    setCart((c) => (qty < 1 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty } : i))));
  const clearCart = () => setCart([]);

  // Demo only: passwords are stored in plain text in the browser.
  const register = ({ name, email, password }) => {
    if (users.some((u) => u.email === email)) return "This email is already registered.";
    setUsers([...users, { name, email, password }]);
    setUser({ name, email });
    notify("Account created. Welcome!");
    return null;
  };
  const login = (email, password) => {
    const u = users.find((x) => x.email === email && x.password === password);
    if (!u) return "Wrong email or password.";
    setUser({ name: u.name, email: u.email });
    notify(`Welcome back, ${u.name}!`);
    return null;
  };
  const logout = () => {
    setUser(null);
    notify("You are logged out.");
  };

  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider
      value={{ cart, count, addToCart, setQty, clearCart, user, register, login, logout, toast }}
    >
      {children}
    </Ctx.Provider>
  );
}