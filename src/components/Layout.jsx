import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../store.jsx";

export default function Layout() {
  const { count, user, logout, toast } = useStore();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const goSearch = (value, replace) =>
    navigate(`/shop?q=${encodeURIComponent(value)}`, { replace });

  const onType = (e) => {
    setQ(e.target.value);
    goSearch(e.target.value, true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    goSearch(q, false);
  };

  return (
    <>
      <header className="nav">
        <div className="w nav-row">
          <Link to="/" className="logo serif">Kitob Do'koni</Link>
          <NavLink to="/shop" className={({ isActive }) => (isActive ? "active" : "")}>Do'kon</NavLink>

          <form onSubmit={onSubmit} className="search" role="search">
            <input
              type="search"
              value={q}
              onChange={onType}
              placeholder="Kitob yoki muallifni qidiring"
              aria-label="Qidiruv"
            />
            <button type="submit" className="search-btn" aria-label="Qidirish">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
          </form>

          <Link to="/cart">
            Savat (<span key={count} className="bump">{count}</span>)
          </Link>
          {user ? (
            <>
              <span className="muted">Salom, {user.name}</span>
              <button className="link" onClick={logout}>Chiqish</button>
            </>
          ) : (
            <>
              <Link to="/login">Kirish</Link>
              <Link to="/register">Ro'yxatdan o'tish</Link>
            </>
          )}
        </div>
      </header>

      <main><Outlet /></main>

      <footer className="footer">
        <div className="w">
          <span className="serif logo">Kitob Do'koni</span>
          <span>© {new Date().getFullYear()} Kitob Do'koni. O'quv uchun yaratilgan do'kon.</span>
        </div>
      </footer>

      <div className="toast-zone" role="status" aria-live="polite">
        {toast && (
          <div className="toast" key={toast.key}>
            <span className="toast-icon" aria-hidden="true">✓</span>
            <span>{toast.text}</span>
            {toast.link && <Link to="/cart" className="toast-link">Savatni ko'rish</Link>}
          </div>
        )}
      </div>
    </>
  );
}