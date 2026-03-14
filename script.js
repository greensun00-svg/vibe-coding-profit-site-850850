const $ = (id) => document.getElementById(id);
$('year').textContent = new Date().getFullYear();

// 문의하기 (MVP: localStorage)
const contactForm = $('contact-form');
const contactMsg = $('contact-msg');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const payload = {
    name: $('name').value.trim(),
    email: $('email').value.trim(),
    message: $('message').value.trim(),
    at: new Date().toISOString(),
  };
  const items = JSON.parse(localStorage.getItem('contactRequests') || '[]');
  items.push(payload);
  localStorage.setItem('contactRequests', JSON.stringify(items));
  contactMsg.textContent = '문의가 등록되었습니다. (MVP: 로컬 저장)';
  contactForm.reset();
});

// 댓글 기능
const commentForm = $('comment-form');
const commentList = $('comment-list');
function renderComments() {
  const comments = JSON.parse(localStorage.getItem('comments') || '[]');
  commentList.innerHTML = comments
    .slice()
    .reverse()
    .map((c) => `<li><strong>${escapeHtml(c.author)}</strong> · <small>${new Date(c.at).toLocaleString()}</small><br/>${escapeHtml(c.text)}</li>`)
    .join('');
}
function escapeHtml(str='') {
  return str.replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
commentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const author = $('comment-author').value.trim();
  const text = $('comment-text').value.trim();
  if (!author || !text) return;
  const comments = JSON.parse(localStorage.getItem('comments') || '[]');
  comments.push({ author, text, at: new Date().toISOString() });
  localStorage.setItem('comments', JSON.stringify(comments));
  commentForm.reset();
  renderComments();
});

renderComments();