import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzgxs4Ci5ufNZNOlc-4a3w_xIj6js-21U",
  authDomain: "vibe-coding-profit-site.firebaseapp.com",
  projectId: "vibe-coding-profit-site",
  storageBucket: "vibe-coding-profit-site.firebasestorage.app",
  messagingSenderId: "232264497938",
  appId: "1:232264497938:web:aa0f099d093e25010c91cb",
  measurementId: "G-2FL1MW529S",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);
$("year").textContent = new Date().getFullYear();

const contactForm = $("contact-form");
const contactMsg = $("contact-msg");
const commentForm = $("comment-form");
const commentList = $("comment-list");

function escapeHtml(str = "") {
  return str.replace(/[&<>'"]/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: $("name").value.trim(),
    email: $("email").value.trim(),
    message: $("message").value.trim(),
    createdAt: serverTimestamp(),
  };

  if (!payload.name || !payload.email || !payload.message) return;

  try {
    await addDoc(collection(db, "contactRequests"), payload);
    contactMsg.textContent = "문의가 등록되었습니다.";
    contactForm.reset();
  } catch (err) {
    console.error(err);
    contactMsg.textContent = "문의 저장에 실패했습니다. Firestore 규칙을 확인해주세요.";
  }
});

commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const author = $("comment-author").value.trim();
  const text = $("comment-text").value.trim();
  if (!author || !text) return;

  try {
    await addDoc(collection(db, "comments"), {
      author,
      text,
      createdAt: serverTimestamp(),
    });
    commentForm.reset();
  } catch (err) {
    console.error(err);
    alert("댓글 저장 실패: Firestore 권한 또는 설정을 확인해주세요.");
  }
});

const commentsQ = query(collection(db, "comments"), orderBy("createdAt", "desc"), limit(100));
onSnapshot(
  commentsQ,
  (snap) => {
    const html = [];
    snap.forEach((doc) => {
      const c = doc.data();
      const date = c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : "방금";
      html.push(`<li><strong>${escapeHtml(c.author || "익명")}</strong> · <small>${date}</small><br/>${escapeHtml(c.text || "")}</li>`);
    });
    commentList.innerHTML = html.join("");
  },
  (err) => {
    console.error(err);
    commentList.innerHTML = "<li>댓글을 불러오지 못했습니다. Firestore 규칙을 확인해주세요.</li>";
  }
);
