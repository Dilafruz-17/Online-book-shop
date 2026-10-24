import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="w sec">
      <h1>404: Sahifa topilmadi</h1>
      <p>Siz qidirayotgan sahifa mavjud emas.</p>
      <Link to="/" className="btn">Bosh sahifaga qaytish</Link>
    </div>
  );
}