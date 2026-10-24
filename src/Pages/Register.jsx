import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store.jsx";

export default function Register() {
  const { register } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim()) return setError("Iltimos, ismingizni kiriting.");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setError("Iltimos, to'g'ri elektron pochta kiriting.");
    if (f.password.length < 8) return setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak.");
    if (f.password !== f.confirm) return setError("Parollar bir xil emas.");
    const err = register(f);
    if (err) return setError(err);
    navigate("/");
  };

  return (
    <div className="w sec center">
      <form className="box auth" onSubmit={submit}>
        <h1>Hisob yaratish</h1>
        <p className="muted">Buyurtmalarni kuzatish va sevimlilarni saqlash uchun Booknest'ga qo'shiling.</p>
        <label htmlFor="n">To'liq ism</label>
        <input id="n" value={f.name} onChange={on("name")} />
        <label htmlFor="e">Elektron pochta</label>
        <input id="e" type="email" value={f.email} onChange={on("email")} />
        <label htmlFor="p">Parol</label>
        <input id="p" type="password" value={f.password} onChange={on("password")} />
        <label htmlFor="c">Parolni takrorlang</label>
        <input id="c" type="password" value={f.confirm} onChange={on("confirm")} />
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn full" type="submit">Ro'yxatdan o'tish</button>
        <p className="muted center-text">Hisobingiz bormi? <Link to="/login">Kirish</Link></p>
      </form>
    </div>
  );
}