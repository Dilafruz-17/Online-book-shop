import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store.jsx";

export default function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const err = login(email, password);
    if (err) return setError(err);
    navigate("/");
  };

  return (
    <div className="w sec center">
      <form className="box auth" onSubmit={submit}>
        <h1>Xush kelibsiz</h1>
        <p className="muted">Hisobingizga kiring.</p>
        <label htmlFor="e">Elektron pochta</label>
        <input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="p">Parol</label>
        <input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn full" type="submit">Kirish</button>
        <p className="muted center-text">Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'ting</Link></p>
      </form>
    </div>
  );
}