import { useState } from "react";

export default function Cover({ book, size = "" }) {
  const [failed, setFailed] = useState(false);
  const cls = `cover ${size}`.trim();

  if (!book.isbn || failed) {
    return <div className={cls} style={{ background: book.color }}>{book.title}</div>;
  }

  return (
    <img
      className={`${cls} img`}
      src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`}
      alt={`"${book.title}" kitobining muqovasi`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}