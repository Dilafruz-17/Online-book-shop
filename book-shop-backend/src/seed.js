import db from "./db.js";

const books = [
  ["Buyuk Getsbi", "F. Skott Fitsjerald", 12.99, "Badiiy adabiyot", 4.4, "9780743273565", "1920-yillar Amerikasidagi boylik, muhabbat va xayollar haqidagi hikoya. Voqealar Nik Karrauey nigohi orqali aytiladi.", "#1d4f6b"],
  ["1984", "Jorj Oruell", 11.5, "Badiiy adabiyot", 4.7, "9780451524935", "Jamiyat butunlay nazorat ostida bo'lgan, haqiqatni davlat belgilaydigan qorong'u kelajak haqida roman.", "#7a2e2e"],
  ["Taqlidchi qushni o'ldirish", "Xarper Li", 13.25, "Badiiy adabiyot", 4.8, "9780061120084", "Amerika janubida o'sayotgan qiz adolat, jasorat va xurofot haqida saboq oladi.", "#2f5d3a"],
  ["G'urur va xurofot", "Jeyn Ostin", 9.99, "Badiiy adabiyot", 4.6, "9780141439518", "Odob, oila va birinchi taassurotdan muhabbatgacha bo'lgan yo'l haqidagi hazilga boy klassik asar.", "#8a3b12"],
  ["Kimyogar", "Paulo Koelo", 14.0, "Badiiy adabiyot", 4.3, "9780062315007", "Cho'pon bola xazina izlab sayohatga chiqadi va o'z hayotining ma'nosini topadi.", "#8a5a12"],
  ["Xobbit", "J. R. R. Tolkin", 15.5, "Badiiy adabiyot", 4.8, "9780547928227", "Bilbo Beggins tinch uyini tark etib, mitti odamlar bilan xavfli safarga otlanadi.", "#2f5d3a"],
  ["Garri Potter va Faylasuflar toshi", "J. K. Rouling", 16.75, "Bolalar", 4.9, "9780747532699", "Oddiy bola o'zining sehrgar ekanini bilib, Xogvartsdagi birinchi o'quv yilini boshlaydi.", "#4a2f5e"],
  ["Kichkina shahzoda", "Antuan de Sent-Ekzyuperi", 8.95, "Bolalar", 4.7, "9780156012195", "Uchuvchi boshqa sayyoradan kelgan yosh shahzoda bilan uchrashadi va hayotda nima muhimligini tushunadi.", "#2d3a6b"],
  ["Atom odatlar", "Jeyms Klir", 18.0, "Shaxsiy rivojlanish", 4.8, "9780735211292", "Kichik kundalik o'zgarishlar orqali yaxshi odatlarni shakllantirish va yomonlaridan qutulish bo'yicha amaliy qo'llanma.", "#1f3d36"],
  ["Boy ota, kambag'al ota", "Robert T. Kiyosaki", 12.5, "Biznes", 4.2, "9781612680194", "Pul, aktivlar va moliyaviy mustaqillik haqidagi saboqlar.", "#7a2e2e"],
  ["Sapiens", "Yuval Noy Xarari", 19.99, "Tarix", 4.6, "9780062316097", "Insoniyatning ilk odamlardan to hozirgi zamongacha bo'lgan qisqacha tarixi.", "#8a5a12"],
  ["Vaqtning qisqacha tarixi", "Stiven Xoking", 15.0, "Fan", 4.5, "9780553380163", "Qora tuynuklar, Katta portlash va vaqtning mohiyati haqida tushunarli bayon.", "#2d3a6b"],
];

const { n } = db.prepare("SELECT COUNT(*) AS n FROM books").get();
if (n > 0) {
  console.log(`Bazada ${n} ta kitob bor, seed o'tkazib yuborildi.`);
} else {
  const insert = db.prepare(
    "INSERT INTO books (title, author, price, genre, rating, isbn, description, color) VALUES (?,?,?,?,?,?,?,?)"
  );
  db.transaction(() => books.forEach((b) => insert.run(...b)))();
  console.log(`${books.length} ta kitob bazaga qo'shildi.`);
}