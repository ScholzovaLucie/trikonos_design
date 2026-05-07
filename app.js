
// ---- CART PERSISTENCE across pages ----
function saveCart() {
  try { sessionStorage.setItem('tk_cart', JSON.stringify(cart)); } catch(e) {}
}
function loadCart() {
  try {
    const saved = sessionStorage.getItem('tk_cart');
    if(saved) cart = JSON.parse(saved);
  } catch(e) {}
}

// ---- DATA ----
const PRODUCTS = [
  { id:1, name:'Bestceler', tagline:'nejžádanější kus', price:438, cat:['top','vtipná'], badges:['top'], color:'#0e584d' },
  { id:2, name:'Dobrá duše', tagline:'pro dobráka od kosti', price:436, cat:['top','moudrá'], badges:['top'], color:'#157a6a' },
  { id:3, name:'Bitcoin', tagline:'opravdové kousky zlata', price:450, cat:['top','bitcoin'], badges:['top'], color:'#2596be' },
  { id:4, name:'Celý den', tagline:'a i to je někdy málo', price:430, cat:['vtipná'], badges:['new'], color:'#0e584d' },
  { id:5, name:'Bohunka box', tagline:'vrátila se silnější', price:428, cat:['vtipná'], badges:['new'], color:'#093d35' },
  { id:6, name:'Bolej záda?', tagline:'my favorite memory...', price:438, cat:['vtipná'], badges:['new','top'], color:'#1a7a6a' },
  { id:7, name:'Čáp dvoubarevný', tagline:'bez jména', price:447, cat:['vtipná'], badges:['new'], color:'#3a9e8e' },
  { id:8, name:'Buy buy buy', tagline:'fomo', price:439, cat:['bitcoin','vtipná'], badges:['new'], color:'#2596be' },
  { id:9, name:'Tančící Bukáček', tagline:'z Buků', price:428, cat:['hory','vtipná'], badges:['new'], color:'#0e584d' },
  { id:10, name:'Dvoubarevná Betynka', tagline:'z Buků', price:447, cat:['hory','dámská'], badges:['new'], color:'#3a9e8e' },
  { id:11, name:'Umíš hovno', tagline:'demotivační Lister', price:421, cat:['vtipná','top'], badges:['new','top'], color:'#157a6a' },
  { id:12, name:'Štěstí si nekoupíš', tagline:'ale bitcoin jo', price:462, cat:['bitcoin','moudrá'], badges:[], color:'#093d35' },
];

// Cart state
let cart = [];
let currentProduct = null;
let currentPage = 'home';

// ---- NAVIGATION ----
function showPage(page) {
  const map = {
    home: 'index.html',
    category: 'kategorie.html',
    product: 'produkt.html',
    custom: 'vlastni-potisk.html',
    checkout: 'objednavka.html'
  };
  if(map[page]) {
    // Store cart in sessionStorage before navigating
    sessionStorage.setItem('tk_cart', JSON.stringify(cart));
    window.location.href = map[page];
  }
}

function toggleMobileNav() {
  const nav = document.getElementById('mobile-nav');
  nav.classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
}

// ---- RENDER PRODUCTS ----
function productSVG(p, size=160) {
  const colors = [p.color, '#0e584d','#1a7a6a'];
  const c1 = colors[0] || '#0e584d';
  const c2 = colors[1];
  const half = size/2;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#f2f2f2"/>
    <polygon points="${half},${size*0.12} ${size*0.88},${size*0.82} ${size*0.12},${size*0.82}" fill="${c1}" opacity="0.82"/>
    <polygon points="${half},${size*0.28} ${size*0.74},${size*0.82} ${size*0.26},${size*0.82}" fill="${c2}" opacity="0.65"/>
    <polygon points="${half},${size*0.18} ${size*0.56},${size*0.82} ${size*0.44},${size*0.82}" fill="#2596be" opacity="0.22"/>
  </svg>`;
}

function renderProductCard(p) {
  const badgesHTML = p.badges.map(b =>
    `<span class="badge badge-${b}">${b === 'top' ? 'TOP' : 'Nové'}</span>`
  ).join('');
  return `<div class="product-card" onclick="openProduct(${p.id})">
    <div class="product-card-img">
      ${productSVG(p, 180)}
      <div class="product-badges">${badgesHTML}</div>
    </div>
    <div class="product-card-body">
      <div class="product-name">${p.name}</div>
      <div class="product-sub">${p.tagline}</div>
      <div class="product-footer">
        <div class="product-price">${p.price} Kč</div>
        <button class="btn-add-to-cart" onclick="event.stopPropagation();quickAddToCart(${p.id},this)" title="Přidat do košíku">+</button>
      </div>
    </div>
  </div>`;
}

function renderHomeGrids() {
  const topProducts = PRODUCTS.filter(p => p.badges.includes('top'));
  const newProducts = PRODUCTS.filter(p => p.badges.includes('new'));
  document.getElementById('home-grid').innerHTML = topProducts.map(renderProductCard).join('');
  document.getElementById('home-grid-new').innerHTML = newProducts.slice(0,4).map(renderProductCard).join('');
}

function renderCategoryGrid(filter) {
  let list = filter && filter !== 'vše'
    ? PRODUCTS.filter(p => p.cat.includes(filter))
    : PRODUCTS;
  document.getElementById('category-grid').innerHTML = list.map(renderProductCard).join('');
}

function filterCategory(btn, cat) {
  document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCategoryGrid(cat);
  if(currentPage !== 'home') window.location='kategorie.html';
}

// ---- PRODUCT DETAIL ----
function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  currentProduct = p;
  document.getElementById('detail-breadcrumb').textContent = p.name;
  document.getElementById('detail-name').textContent = p.name;
  document.getElementById('detail-tagline').textContent = p.tagline;
  document.getElementById('detail-price').textContent = p.price + ' Kč';
  document.getElementById('detail-visual').innerHTML = productSVG(p, 400);
  const badgesHTML = p.badges.map(b =>
    `<span class="badge badge-${b}">${b === 'top' ? 'TOP' : 'Nové'}</span>`
  ).join('');
  document.getElementById('detail-badges').innerHTML = badgesHTML;
  // reset size
  document.getElementById('selected-size-label').textContent = '— nevybráno';
  document.querySelectorAll('#size-grid .size-btn').forEach(b => b.classList.remove('active'));
  // thumbs
  document.getElementById('detail-thumbs').innerHTML = [p.color,'#3a9e8e','#0e584d'].map((c,i) => {
    const tp = {...p, color:c};
    return `<div class="thumb ${i===0?'active':''}" onclick="swapThumb(this,'${c}')">${productSVG(tp,60)}</div>`;
  }).join('');
  // qty reset
  document.getElementById('detail-qty').value = 1;
  window.location='produkt.html';
}

function swapThumb(el, color) {
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const p = {...currentProduct, color};
  document.getElementById('detail-visual').innerHTML = productSVG(p, 400);
}

function selectSize(btn, size) {
  if(btn.classList.contains('unavailable')) return;
  document.querySelectorAll('#size-grid .size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('selected-size-label').textContent = size;
}

function selectColor(el, name) {
  document.querySelectorAll('#color-grid .color-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

function changeDetailQty(delta) {
  const input = document.getElementById('detail-qty');
  const v = Math.max(1, parseInt(input.value) + delta);
  input.value = v;
}

function addCurrentToCart() {
  if(!currentProduct) return;
  const sizeEl = document.querySelector('#size-grid .size-btn.active:not(.unavailable)');
  const size = sizeEl ? sizeEl.textContent.trim() : 'M';
  addToCart(currentProduct, size);
}

// ---- CART ----
function addToCart(product, size='M', qty=1) {
  saveCart();
  const key = product.id + '-' + size;
  const existing = cart.find(i => i.key === key);
  if(existing) {
    existing.qty += qty;
  } else {
    cart.push({ key, product, size, qty });
  }
  updateCartUI();
  showToast(`${product.name} (${size}) přidán do košíku`, '🏔');
}

function quickAddToCart(id, btn) {
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  addToCart(p, 'M');
  btn.classList.add('added');
  btn.textContent = '✓';
  setTimeout(() => { btn.classList.remove('added'); btn.textContent = '+'; }, 800);
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  updateCartUI();
  if(currentPage === 'checkout') renderCheckout();
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartUI();
  if(currentPage === 'checkout') renderCheckout();
}

function cartTotal() {
  return cart.reduce((s, i) => s + i.product.price * i.qty, 0);
}
function cartCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function updateCartUI() {
  const count = cartCount();
  document.getElementById('cart-count').textContent = count;
  const total = cartTotal();
  document.getElementById('cart-total-price').textContent = total.toLocaleString('cs-CZ') + ' Kč';
  const shippingFree = count >= 2;
  document.getElementById('cart-shipping-note').textContent = shippingFree
    ? '✓ Doprava zdarma!'
    : '+ dopravné 79–95 Kč (zdarma od 2 ks)';

  const listEl = document.getElementById('cart-items-list');
  const footerEl = document.getElementById('cart-footer');

  if(cart.length === 0) {
    listEl.innerHTML = `<div class="cart-empty">
      <div class="cart-empty-icon">🏔</div>
      <p>Košík je prázdný.<br>Naplňte ho horalskými triky!</p>
    </div>`;
    footerEl.style.display = 'none';
  } else {
    listEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${productSVG(item.product, 56)}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.product.name}</div>
          <div class="cart-item-variant">Vel. ${item.size}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty('${item.key}',-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.key}',1)">+</button>
            <button class="btn-remove-item" onclick="removeFromCart('${item.key}')">✕</button>
          </div>
        </div>
        <div class="cart-item-price">${(item.product.price * item.qty).toLocaleString('cs-CZ')} Kč</div>
      </div>
    `).join('');
    footerEl.style.display = 'block';
  }
}

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
}

// ---- CHECKOUT ----
function renderCheckout() {
  const total = cartTotal();
  const shipping = cartCount() >= 2 ? 0 : 89;
  document.getElementById('co-subtotal').textContent = total.toLocaleString('cs-CZ') + ' Kč';
  document.getElementById('co-shipping').textContent = shipping === 0 ? 'Zdarma ✓' : shipping + ' Kč';
  document.getElementById('co-total').textContent = (total + shipping).toLocaleString('cs-CZ') + ' Kč';

  const el = document.getElementById('checkout-items');
  if(cart.length === 0) {
    el.innerHTML = '<p style="font-size:13px;color:var(--muted);padding:12px 0">Košík je prázdný</p>';
  } else {
    el.innerHTML = cart.map(item => `
      <div class="order-summary-item">
        <div class="order-sum-img">${productSVG(item.product,48)}</div>
        <div class="order-sum-info">
          <h5>${item.product.name}</h5>
          <p>Vel. ${item.size} · ${item.qty} ks</p>
        </div>
        <div class="order-sum-price">${(item.product.price * item.qty).toLocaleString('cs-CZ')} Kč</div>
      </div>
    `).join('');
  }
}

// ---- UI HELPERS ----
function toggleFilter(el) {
  el.classList.toggle('checked');
}
function toggleSize(el) {
  el.classList.toggle('active');
}
function selectMethod(btn) {
  btn.closest('.checkout-methods').querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function updatePrice(val) {
  document.getElementById('price-val').textContent = parseInt(val).toLocaleString('cs-CZ') + ' Kč';
}

// ---- TOAST ----
function showToast(msg, icon='🏔') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2900);
}

// ---- INIT ----
loadCart();
updateCartUI();
// Page-specific init
if(document.getElementById('home-grid')) { renderHomeGrids(); renderIG(); renderReviews(); }
if(document.getElementById('category-grid')) { renderCategoryGrid(); }
if(document.getElementById('checkout-items')) { renderCheckout(); }

// ---- INSTAGRAM GRID ----
const IG_POSTS = [
  { bg:'#0e584d', icon:'⛰', label:'Krkonoše!' },
  { bg:'#282828', icon:'👕', label:'nové kousky' },
  { bg:'#157a6a', icon:'🏔', label:'výstup' },
  { bg:'#2596be', icon:'😄', label:'vtip dne' },
  { bg:'#093d35', icon:'🌲', label:'les & triko' },
  { bg:'#1a7a6a', icon:'₿', label:'hodl' },
];
function renderIG() {
  document.getElementById('ig-grid').innerHTML = IG_POSTS.map((p,i) => `
    <div class="ig-item" onclick="showToast('Otevírám Instagram…','📸')">
      <div class="ig-item-inner" style="background:${p.bg};width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px">
        <span style="font-size:36px">${p.icon}</span>
        <span style="font-size:11px;color:rgba(255,255,255,0.7);font-family:var(--font-body)">${p.label}</span>
      </div>
      <div class="ig-item-overlay">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
      </div>
    </div>
  `).join('');
}

// ---- REVIEWS CAROUSEL ----
const REVIEWS = [
  { name:'Michaela Bláhová', date:'25.4.2026', stars:5, text:'Rychlost odeslání, kvalita výrobku, vše super. :-)' },
  { name:'Jana Růžičková', date:'20.4.2026', stars:5, text:'100% spokojenost' },
  { name:'Tomáš Krejčí', date:'15.4.2026', stars:5, text:'Skvělá kvalita tisku, triko drží tvar i po mnoha praních. Doporučuji!' },
  { name:'Petra Horáčková', date:'10.4.2026', stars:5, text:'Krásný dárek pro mého muže, byl nadšený. Doručení super rychlé.' },
  { name:'Martin Dvořák', date:'5.4.2026', stars:4, text:'Pěkné triko, akorát jsem čekal o den déle než bylo uvedeno. Jinak spokojen.' },
  { name:'Lucie Nováková', date:'1.4.2026', stars:5, text:'Originální design, výborná bavlna. Určitě objednám znovu!' },
];
let reviewPage = 0;
const REVIEWS_PER_PAGE = 2;

function starsHTML(n, cls='star') {
  return Array.from({length:5}, (_,i) =>
    `<span class="${i<n ? cls : cls+' star-empty'}">★</span>`
  ).join('');
}

function renderReviews() {
  const start = reviewPage * REVIEWS_PER_PAGE;
  const visible = REVIEWS.slice(start, start + REVIEWS_PER_PAGE);
  document.getElementById('reviews-carousel').innerHTML = visible.map(r => `
    <div class="review-card">
      <div class="review-card-header">
        <div class="review-name">${r.name}</div>
        <div class="review-date">${r.date}</div>
      </div>
      <div class="review-stars">${starsHTML(r.stars,'star-sm')}</div>
      <div class="review-text">${r.text}</div>
    </div>
  `).join('');

  const totalPages = Math.ceil(REVIEWS.length / REVIEWS_PER_PAGE);
  document.getElementById('carousel-dots').innerHTML = Array.from({length:totalPages}, (_,i) =>
    `<button class="carousel-dot ${i===reviewPage?'active':''}" onclick="goReview(${i})"></button>`
  ).join('');
}

function nextReviews() {
  const total = Math.ceil(REVIEWS.length / REVIEWS_PER_PAGE);
  reviewPage = (reviewPage + 1) % total;
  renderReviews();
}
function prevReviews() {
  const total = Math.ceil(REVIEWS.length / REVIEWS_PER_PAGE);
  reviewPage = (reviewPage - 1 + total) % total;
  renderReviews();
}
function goReview(i) { reviewPage = i; renderReviews(); }

renderIG();
renderReviews();