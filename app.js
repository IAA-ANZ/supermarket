const app = document.querySelector("#app");
const toastRegion = document.querySelector("#toast-region");
const state = {
  user: null,
  store: { name: "بقالة الحي", whatsapp: "" },
  products: [],
  adminProducts: [],
  orders: [],
  tab: "products",
  category: "all",
  search: "",
  cart: {},
  language: localStorage.getItem("grocery-language") || "ar",
  authMode: "login",
  cartOpen: false,
  checkoutOpen: false,
  assistantOpen: false,
  assistantMessages: [],
  editorOpen: false,
  editingProduct: null,
  productImage: "",
  modal: null,
};
let syncInFlight = false;

const text = {
  ar: {
    store: "بقالة الحي", market: "المتجر", products: "المنتجات", orders: "الطلبات", settings: "إعدادات المتجر",
    search: "ابحث عن منتج أو قسم", all: "كل المنتجات", add: "أضف للسلة", cart: "سلة المشتريات", emptyCart: "سلتك فارغة حالياً",
    total: "الإجمالي", checkout: "إتمام الطلب", continue: "متابعة التسوق", signIn: "تسجيل الدخول", signUp: "إنشاء حساب",
    name: "الاسم الكامل", email: "البريد الإلكتروني", loginIdentifier: "البريد الإلكتروني أو رقم الجوال", phone: "رقم الجوال", password: "كلمة المرور", forgot: "أدخل بياناتك للمتابعة إلى المتجر",
    createAccount: "أنشئ حسابك وابدأ التسوق", switchSignup: "ليس لديك حساب؟ إنشاء حساب", switchLogin: "لديك حساب؟ تسجيل الدخول",
    city: "المدينة", district: "الحي", street: "الشارع", house: "رقم المنزل", note: "ملاحظات للمندوب (اختياري)",
    address: "عنوان التوصيل", chooseLocation: "استخدم موقعي الحالي", locationHint: "يمكنك تحديد موقعك لإرفاقه بطلبك.", locating: "جارٍ تحديد الموقع...", locationSelected: "تم تحديد الموقع", locationUnavailable: "المتصفح لا يدعم تحديد الموقع.", locationError: "تعذر تحديد الموقع. تحقق من إذن المتصفح.", mapLocation: "رابط الموقع", viewLocation: "عرض الموقع", whatsapp: "متابعة عبر واتساب", whatsappHint: "سيتم فتح واتساب برسالة الطلب جاهزة. اضغط إرسال داخل واتساب لتأكيدها.",
    emptyProducts: "لا توجد منتجات متاحة حالياً", emptyProductsHint: "سيضيف المتجر المنتجات المتاحة من لوحة الإدارة.",
    adminLogin: "دخول الإدارة", adminUser: "اسم المستخدم", adminPassword: "كلمة مرور الإدارة", adminHint: "هذه الصفحة مخصصة لصاحب المتجر.",
    logout: "تسجيل الخروج", language: "English", featured: "احتياجات يومك، عند بابك", subtitle: "منتجات بقالتك اليومية بطلب بسيط وتوصيل محلي.",
    categories: "الأقسام", noResults: "لا توجد نتائج لهذا البحث", available: "متوفر", unavailable: "غير متوفر", stock: "المخزون",
    addProduct: "إضافة منتج", editProduct: "تعديل المنتج", productName: "اسم المنتج", description: "وصف مختصر", category: "القسم",
    price: "السعر (ر.س)", quantity: "الكمية", productImage: "صورة المنتج", chooseImage: "اختر صورة من جهازك", visible: "إظهار للزبائن",
    save: "حفظ المنتج", cancel: "إلغاء", delete: "حذف", confirmDelete: "حذف هذا المنتج؟", confirm: "نعم، احذف",
    noOrders: "لا توجد طلبات بعد", order: "طلب", customer: "الزبون", status: "الحالة", new: "جديد", preparing: "قيد التجهيز",
    on_way: "في الطريق", complete: "مكتمل", cancelled: "ملغي", storeName: "اسم المتجر", storeWhatsApp: "رقم واتساب المتجر",
    saveSettings: "حفظ الإعدادات", phoneFormat: "اكتبه مع رمز الدولة، مثال: 9665xxxxxxxx", welcome: "مرحباً",
    aiTitle: "مساعد البقالة", aiIntro: "أساعدك في العثور على المنتجات المتوفرة واقتراح ما يناسب طلبك.", aiPlaceholder: "مثلاً: أحتاج فطوراً سريعاً",
    send: "إرسال", payment: "الدفع عند الاستلام", orderSaved: "تم حفظ طلبك", orderNumber: "رقم الطلب",
    authRequired: "سجّل دخولك أولاً للمتابعة", saving: "جارٍ الحفظ...", saved: "تم الحفظ بنجاح", error: "تعذر إكمال العملية",
    categoryLabels: { "مشروبات ومياه": "مشروبات ومياه", "حلويات وسناك": "حلويات وسناك", "مخبوزات": "مخبوزات", "فواكه وخضار": "فواكه وخضار", "منتجات الألبان": "منتجات الألبان", "مواد غذائية": "مواد غذائية", "منظفات": "منظفات" },
  },
  en: {
    store: "Neighborhood Grocery", market: "Shop", products: "Products", orders: "Orders", settings: "Store settings",
    search: "Search products or categories", all: "All products", add: "Add to cart", cart: "Shopping cart", emptyCart: "Your cart is empty",
    total: "Total", checkout: "Place order", continue: "Continue shopping", signIn: "Sign in", signUp: "Create account",
    name: "Full name", email: "Email address", loginIdentifier: "Email address or mobile number", phone: "Mobile number", password: "Password", forgot: "Sign in to continue to the store",
    createAccount: "Create an account to start shopping", switchSignup: "New here? Create an account", switchLogin: "Already have an account? Sign in",
    city: "City", district: "District", street: "Street", house: "House number", note: "Delivery note (optional)",
    address: "Delivery address", chooseLocation: "Use my current location", locationHint: "Share your location with this order.", locating: "Finding your location...", locationSelected: "Location selected", locationUnavailable: "This browser does not support location access.", locationError: "Could not get your location. Check browser permission.", mapLocation: "Map location", viewLocation: "View location", whatsapp: "Continue to WhatsApp", whatsappHint: "WhatsApp opens with your order ready. Tap Send in WhatsApp to confirm.",
    emptyProducts: "No products available yet", emptyProductsHint: "The store owner can add products from the admin page.",
    adminLogin: "Admin sign in", adminUser: "Username", adminPassword: "Admin password", adminHint: "This page is for the store owner.",
    logout: "Sign out", language: "العربية", featured: "Everyday essentials, delivered", subtitle: "Your neighborhood grocery, ordered in a few simple steps.",
    categories: "Categories", noResults: "No products match your search", available: "In stock", unavailable: "Unavailable", stock: "Stock",
    addProduct: "Add product", editProduct: "Edit product", productName: "Product name", description: "Short description", category: "Category",
    price: "Price (SAR)", quantity: "Quantity", productImage: "Product image", chooseImage: "Choose image", visible: "Visible to customers",
    save: "Save product", cancel: "Cancel", delete: "Delete", confirmDelete: "Delete this product?", confirm: "Yes, delete",
    noOrders: "No orders yet", order: "Order", customer: "Customer", status: "Status", new: "New", preparing: "Preparing",
    on_way: "On the way", complete: "Complete", cancelled: "Cancelled", storeName: "Store name", storeWhatsApp: "Store WhatsApp number",
    saveSettings: "Save settings", phoneFormat: "Include country code, e.g. 9665xxxxxxxx", welcome: "Welcome",
    aiTitle: "Grocery assistant", aiIntro: "I can help find available products and suggest items for your order.", aiPlaceholder: "Try: quick breakfast ideas",
    send: "Send", payment: "Cash on delivery", orderSaved: "Your order is saved", orderNumber: "Order number",
    authRequired: "Sign in first to continue", saving: "Saving...", saved: "Saved successfully", error: "Could not complete the action",
    categoryLabels: { "مشروبات ومياه": "Drinks & water", "حلويات وسناك": "Snacks & sweets", "مخبوزات": "Bakery", "فواكه وخضار": "Fruit & vegetables", "منتجات الألبان": "Dairy", "مواد غذائية": "Pantry", "منظفات": "Cleaning" },
  },
};

const t = (key) => text[state.language][key] || key;
const isEnglish = () => state.language === "en";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const money = (value) => `${Number(value || 0).toFixed(2)} ${isEnglish() ? "SAR" : "ر.س"}`;
const categories = ["مشروبات ومياه", "حلويات وسناك", "مخبوزات", "فواكه وخضار", "منتجات الألبان", "مواد غذائية", "منظفات"];

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || t("error"));
  return payload;
}

function toast(message, kind = "success") {
  const node = document.createElement("div");
  node.className = `toast toast-${kind}`;
  node.textContent = message;
  toastRegion.append(node);
  window.setTimeout(() => node.remove(), 3400);
}

function setLanguage(language) {
  state.language = language;
  localStorage.setItem("grocery-language", language);
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  if (window.location.pathname === "/admin") renderAdmin();
  else if (state.user?.role === "customer") renderStore();
  else renderAuth();
}

function navigate(path) {
  window.location.assign(path);
}

function getCart() {
  try {
    state.cart = JSON.parse(localStorage.getItem(`grocery-cart-${state.user?.id}`) || "{}");
  } catch {
    state.cart = {};
  }
}

function saveCart() {
  localStorage.setItem(`grocery-cart-${state.user?.id}`, JSON.stringify(state.cart));
}

function cartItems() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => {
      const product = state.products.find((item) => String(item.id) === id);
      return product ? { product, quantity } : null;
    })
    .filter(Boolean);
}

function cartCount() {
  return Object.values(state.cart).reduce((sum, quantity) => sum + Number(quantity), 0);
}

function cartTotal() {
  return cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

function productVisual(product, compact = false) {
  if (product.image) return `<img class="product-photo ${compact ? "compact-photo" : ""}" src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy">`;
  const symbols = { "مشروبات ومياه": "◉", "حلويات وسناك": "✳", "مخبوزات": "⌂", "فواكه وخضار": "✿", "منتجات الألبان": "◌", "مواد غذائية": "▤", "منظفات": "✦" };
  return `<div class="product-placeholder"><span>${symbols[product.category] || "＋"}</span><small>${esc(t("categoryLabels")[product.category] || product.category)}</small></div>`;
}

function renderAuth() {
  const register = state.authMode === "register";
  app.innerHTML = `
    <section class="auth-layout">
      <div class="auth-art">
        <a class="wordmark" href="/auth"><span class="brand-mark">ب</span><span>${esc(state.store.name)}</span></a>
        <div class="art-copy"><p class="eyebrow">${isEnglish() ? "LOCAL GROCERY · DELIVERY" : "بقالة محلية · توصيل"}</p><h1>${esc(t("featured"))}</h1><p>${esc(t("subtitle"))}</p></div>
        <div class="art-stamp"><span>01</span><span>${isEnglish() ? "FRESH PICKS" : "اختيارات يومية"}</span></div>
        <div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div>
      </div>
      <section class="auth-panel">
        <div class="auth-top"><button class="text-button" data-action="language">${esc(t("language"))}</button><a class="admin-entry" href="/admin">${esc(t("adminLogin"))}</a></div>
        <form id="auth-form" class="auth-form">
          <p class="eyebrow">${register ? (isEnglish() ? "YOUR ACCOUNT" : "حسابك") : (isEnglish() ? "WELCOME BACK" : "مرحباً بعودتك")}</p>
          <h2>${esc(register ? t("signUp") : t("signIn"))}</h2><p class="form-subtitle">${esc(register ? t("createAccount") : t("forgot"))}</p>
          ${register ? `<label>${esc(t("name"))}<input name="name" autocomplete="name" required minlength="2" placeholder="${esc(t("name"))}"></label>` : ""}
          <label>${esc(register ? t("email") : t("loginIdentifier"))}<input name="${register ? "email" : "identifier"}" type="${register ? "email" : "text"}" autocomplete="${register ? "email" : "username"}" required placeholder="${register ? "name@example.com" : t("loginIdentifier")}" dir="ltr"></label>
          ${register ? `<label>${esc(t("phone"))}<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required value="+9665" placeholder="+9665xxxxxxxx" dir="ltr"></label>` : ""}
          <label>${esc(t("password"))}<input name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" required minlength="8" placeholder="••••••••" dir="ltr"></label>
          <button class="button button-primary button-wide" type="submit">${esc(register ? t("signUp") : t("signIn"))}<span aria-hidden="true">↗</span></button>
          <button class="text-button auth-switch" type="button" data-action="auth-switch">${esc(register ? t("switchLogin") : t("switchSignup"))}</button>
        </form>
      </section>
    </section>`;
  app.querySelector("[data-action=language]").addEventListener("click", () => setLanguage(isEnglish() ? "ar" : "en"));
  app.querySelector("[data-action=auth-switch]").addEventListener("click", () => { state.authMode = register ? "login" : "register"; renderAuth(); });
  app.querySelector("#auth-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const endpoint = register ? "/api/auth/register" : "/api/auth/login";
    try {
      await api(endpoint, { method: "POST", body: JSON.stringify(values) });
      navigate("/");
    } catch (error) { toast(error.message, "error"); }
  });
}

function renderAdminLogin() {
  app.innerHTML = `
    <section class="admin-login-shell">
      <header class="admin-login-head"><a class="wordmark" href="/"><span class="brand-mark">ب</span><span>${esc(state.store.name)}</span></a><button class="text-button" data-action="language">${esc(t("language"))}</button></header>
      <form id="admin-login-form" class="admin-login-form">
        <span class="admin-symbol">⌘</span><p class="eyebrow">${isEnglish() ? "PRIVATE AREA" : "منطقة خاصة"}</p>
        <h1>${esc(t("adminLogin"))}</h1><p>${esc(t("adminHint"))}</p>
        <label>${esc(t("adminUser"))}<input name="username" autocomplete="username" required dir="ltr"></label>
        <label>${esc(t("adminPassword"))}<input name="password" type="password" autocomplete="current-password" required dir="ltr"></label>
        <button class="button button-primary button-wide" type="submit">${esc(t("signIn"))}<span aria-hidden="true">↗</span></button>
        <a class="back-link" href="/">${isEnglish() ? "Back to shop" : "العودة إلى المتجر"}</a>
      </form>
    </section>`;
  app.querySelector("[data-action=language]").addEventListener("click", () => setLanguage(isEnglish() ? "ar" : "en"));
  app.querySelector("#admin-login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try { await api("/api/admin/login", { method: "POST", body: JSON.stringify(values) }); navigate("/admin"); }
    catch (error) { toast(error.message, "error"); }
  });
}

function header() {
  return `<header class="site-header"><a class="wordmark" href="/"><span class="brand-mark">ب</span><span>${esc(state.store.name)}</span></a>
    <div class="header-actions"><span class="welcome-label">${esc(t("welcome"))}، ${esc(state.user.name.split(" ")[0])}</span>
    <button class="icon-button language-button" data-action="language" aria-label="Change language">${esc(t("language"))}</button>
    <button class="button button-cart" data-action="cart-open"><span class="cart-icon" aria-hidden="true">▱</span><span>${esc(t("cart"))}</span><b>${cartCount()}</b></button>
    <button class="icon-button logout-button" data-action="logout" title="${esc(t("logout"))}" aria-label="${esc(t("logout"))}">↪</button></div>
  </header>`;
}

function renderStore() {
  const filtered = state.products.filter((product) => {
    const categoryMatch = state.category === "all" || product.category === state.category;
    const term = state.search.trim().toLowerCase();
    return categoryMatch && (!term || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(term));
  });
  const categoryCounts = Object.fromEntries(categories.map((category) => [category, state.products.filter((product) => product.category === category).length]));
  app.innerHTML = `${header()}
    <div class="store-shell">
      <section class="store-hero"><div class="hero-copy"><p class="eyebrow">${isEnglish() ? "YOUR LOCAL GROCERY" : "بقالتك القريبة"}</p><h1>${esc(t("featured"))}</h1><p>${esc(t("subtitle"))}</p><div class="delivery-note"><span class="pin-icon">⌖</span><span>${isEnglish() ? "Choose your delivery address at checkout" : "حدّد عنوان التوصيل عند إتمام الطلب"}</span></div></div><div class="hero-pattern" aria-hidden="true"><span>✳</span><span>◌</span><span>✦</span><i></i></div></section>
      <section class="catalog-section"><div class="catalog-heading"><div><p class="eyebrow">${esc(t("categories"))}</p><h2>${esc(t("market"))}</h2></div><label class="search-box"><span aria-hidden="true">⌕</span><input id="product-search" type="search" value="${esc(state.search)}" placeholder="${esc(t("search"))}"></label></div>
      <nav class="category-strip" aria-label="${esc(t("categories"))}"><button class="category-chip ${state.category === "all" ? "selected" : ""}" data-category="all">${esc(t("all"))}<small>${state.products.length}</small></button>${categories.filter((category) => categoryCounts[category] || state.category === category).map((category) => `<button class="category-chip ${state.category === category ? "selected" : ""}" data-category="${esc(category)}">${esc(t("categoryLabels")[category] || category)}<small>${categoryCounts[category] || 0}</small></button>`).join("")}</nav>
      ${filtered.length ? `<div class="product-grid">${filtered.map((product) => `<article class="product-card">${productVisual(product)}<div class="product-info"><div class="product-category">${esc(t("categoryLabels")[product.category] || product.category)}</div><h3>${esc(product.name)}</h3><p class="product-description">${esc(product.description || "")}</p><div class="product-bottom"><strong>${money(product.price)}</strong><button class="add-button" data-action="add" data-id="${product.id}">＋ <span>${esc(t("add"))}</span></button></div></div></article>`).join("")}</div>` : `<div class="empty-state"><span class="empty-symbol">⌕</span><h3>${esc(state.search ? t("noResults") : t("emptyProducts"))}</h3><p>${esc(state.search ? "" : t("emptyProductsHint"))}</p></div>`}
      </section>
      <footer class="store-footer"><span>${esc(state.store.name)}</span><span>${isEnglish() ? "Local delivery" : "توصيل محلي"}</span><span>${isEnglish() ? "Fresh essentials, close to home" : "احتياجات يومية من بقالتك القريبة"}</span></footer>
    </div>
    ${state.cartOpen ? renderCart() : ""}${state.checkoutOpen ? renderCheckout() : ""}${renderAssistant()}`;
  bindStoreEvents();
}

function renderCart() {
  const items = cartItems();
  return `<div class="overlay" data-action="overlay-close"><aside class="cart-drawer" role="dialog" aria-modal="true" aria-label="${esc(t("cart"))}"><div class="drawer-head"><div><p class="eyebrow">${esc(t("order"))}</p><h2>${esc(t("cart"))}</h2></div><button class="close-button" data-action="cart-close" aria-label="${esc(t("cancel"))}">×</button></div>
    ${items.length ? `<div class="cart-list">${items.map(({ product, quantity }) => `<article class="cart-row"><div class="cart-thumb">${productVisual(product, true)}</div><div class="cart-row-main"><h3>${esc(product.name)}</h3><strong>${money(product.price * quantity)}</strong><div class="quantity-control"><button data-action="quantity" data-id="${product.id}" data-delta="-1" aria-label="minus">−</button><span>${quantity}</span><button data-action="quantity" data-id="${product.id}" data-delta="1" aria-label="plus">+</button></div></div><button class="remove-button" data-action="remove" data-id="${product.id}" aria-label="${esc(t("delete"))}">×</button></article>`).join("")}</div><div class="cart-summary"><div class="summary-line"><span>${esc(t("total"))}</span><strong>${money(cartTotal())}</strong></div><button class="button button-primary button-wide" data-action="checkout-open">${esc(t("checkout"))}<span>↗</span></button></div>` : `<div class="empty-state cart-empty"><span class="empty-symbol">▱</span><h3>${esc(t("emptyCart"))}</h3><button class="button button-outline" data-action="cart-close">${esc(t("continue"))}</button></div>`}
    </aside></div>`;
}

function renderCheckout() {
  return `<div class="overlay checkout-overlay" data-action="checkout-close"><section class="checkout-dialog" role="dialog" aria-modal="true" aria-label="${esc(t("checkout"))}"><div class="drawer-head"><div><p class="eyebrow">${esc(t("address"))}</p><h2>${esc(t("checkout"))}</h2></div><button class="close-button" data-action="checkout-close" aria-label="${esc(t("cancel"))}">×</button></div>
    <form id="checkout-form" class="checkout-form"><div class="checkout-customer"><span class="customer-avatar">${esc(state.user.name.slice(0, 1))}</span><div><strong>${esc(state.user.name)}</strong><small>${esc(state.user.phone)}</small></div><span class="payment-badge">${esc(t("payment"))}</span></div>
      <div class="location-picker"><button class="button button-outline" type="button" data-action="locate">⌖ ${esc(t("chooseLocation"))}</button><p class="location-status" id="location-status">${esc(t("locationHint"))}</p><input type="hidden" name="latitude"><input type="hidden" name="longitude"></div>
      <div class="form-grid"><label>${esc(t("city"))}<input name="city" required></label><label>${esc(t("district"))}<input name="district" required></label><label class="span-two">${esc(t("street"))}<input name="street" required maxlength="120"></label><label>${esc(t("house"))}<input name="house" required maxlength="40"></label><label class="span-two">${esc(t("note"))}<textarea name="note" rows="2" maxlength="300"></textarea></label></div>
      <div class="checkout-total"><span>${esc(t("total"))}</span><strong>${money(cartTotal())}</strong></div><p class="whatsapp-hint">${esc(t("whatsappHint"))}</p><button class="button button-primary button-wide" type="submit">${esc(t("whatsapp"))}<span aria-hidden="true">↗</span></button>
    </form></section></div>`;
}

function renderAssistant() {
  return `<div class="assistant-wrap">${state.assistantOpen ? `<section class="assistant-panel"><header><div><p class="eyebrow">${esc(t("aiTitle"))}</p><strong>${esc(state.store.name)}</strong></div><button class="close-button" data-action="assistant-close">×</button></header><div class="assistant-messages" id="assistant-messages">${state.assistantMessages.length ? state.assistantMessages.map((message) => `<p class="chat-message ${message.role}">${esc(message.content)}</p>`).join("") : `<p class="assistant-intro">${esc(t("aiIntro"))}</p>`}</div><form id="assistant-form"><input name="message" required maxlength="500" placeholder="${esc(t("aiPlaceholder"))}"><button class="button button-primary" type="submit" aria-label="${esc(t("send"))}">↑</button></form></section>` : ""}<button class="assistant-toggle" data-action="assistant-toggle" aria-label="${esc(t("aiTitle"))}"><span>✳</span><b>${esc(t("aiTitle"))}</b></button></div>`;
}

function bindStoreEvents() {
  app.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", handleStoreAction));
  app.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => { state.category = button.dataset.category; renderStore(); }));
  const search = app.querySelector("#product-search");
  search?.addEventListener("input", () => { state.search = search.value; const selection = search.selectionStart; renderStore(); const updated = app.querySelector("#product-search"); updated.focus(); updated.setSelectionRange(selection, selection); });
  app.querySelector("#checkout-form")?.addEventListener("submit", submitOrder);
  app.querySelector("#assistant-form")?.addEventListener("submit", submitAssistant);
}

function handleStoreAction(event) {
  const action = event.currentTarget.dataset.action;
  const id = event.currentTarget.dataset.id;
  if (action === "language") setLanguage(isEnglish() ? "ar" : "en");
  if (action === "logout") logout();
  if (action === "cart-open") { state.cartOpen = true; renderStore(); }
  if (action === "cart-close" || (action === "overlay-close" && event.target === event.currentTarget)) { state.cartOpen = false; renderStore(); }
  if (action === "add") { state.cart[id] = (state.cart[id] || 0) + 1; saveCart(); renderStore(); toast(isEnglish() ? "Added to cart" : "أضيف المنتج إلى السلة"); }
  if (action === "quantity") {
    const next = (state.cart[id] || 0) + Number(event.currentTarget.dataset.delta);
    if (next < 1) delete state.cart[id]; else state.cart[id] = Math.min(next, 99);
    saveCart(); renderStore();
  }
  if (action === "remove") { delete state.cart[id]; saveCart(); renderStore(); }
  if (action === "checkout-open") { state.checkoutOpen = true; renderStore(); }
  if (action === "locate") locateCustomer();
  if (action === "checkout-close" && (event.target === event.currentTarget || event.currentTarget.tagName === "BUTTON")) { state.checkoutOpen = false; renderStore(); }
  if (action === "assistant-toggle") { state.assistantOpen = !state.assistantOpen; renderStore(); }
  if (action === "assistant-close") { state.assistantOpen = false; renderStore(); }
}

function locateCustomer() {
  const form = app.querySelector("#checkout-form");
  const status = app.querySelector("#location-status");
  const button = app.querySelector('[data-action="locate"]');
  if (!form || !status || !button) return;
  if (!navigator.geolocation) { status.textContent = t("locationUnavailable"); return; }
  button.disabled = true;
  status.textContent = t("locating");
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    form.elements.latitude.value = coords.latitude.toFixed(7);
    form.elements.longitude.value = coords.longitude.toFixed(7);
    status.textContent = `${t("locationSelected")}: ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
    button.disabled = false;
  }, () => {
    status.textContent = t("locationError");
    button.disabled = false;
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
}

async function submitOrder(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const address = Object.fromEntries(new FormData(form));
  const items = cartItems().map(({ product, quantity }) => ({ id: product.id, quantity }));
  const submit = form.querySelector("button[type=submit]");
  submit.disabled = true;
  try {
    const result = await api("/api/orders", { method: "POST", body: JSON.stringify({ items, address }) });
    state.cart = {};
    saveCart();
    state.checkoutOpen = false;
    state.cartOpen = false;
    toast(`${t("orderSaved")} · ${t("orderNumber")} ${result.order.id}`);
    if (result.whatsapp) {
      const lines = result.order.items.map((item) => `• ${item.name} × ${item.quantity} = ${item.subtotal.toFixed(2)} ر.س`).join("\n");
      const mapLink = result.order.latitude == null ? "" : `https://maps.google.com/?q=${result.order.latitude},${result.order.longitude}`;
      const message = `${state.store.name}\n${t("orderNumber")}: ${result.order.id}\n${state.user.name} · ${state.user.phone}\n${address.city}، ${address.district}\n${address.street}، ${address.house}${mapLink ? `\n${t("mapLocation")}: ${mapLink}` : ""}\n${lines}\n${t("total")}: ${result.order.total.toFixed(2)} ر.س${address.note ? `\n${address.note}` : ""}`;
      window.location.href = `https://wa.me/${result.whatsapp}?text=${encodeURIComponent(message)}`;
    } else {
      window.alert(isEnglish() ? "Order saved, but the store has not set its WhatsApp number yet." : "تم حفظ طلبك، لكن المتجر لم يضف رقم واتساب بعد.");
    }
    await loadProducts();
    renderStore();
  } catch (error) { toast(error.message, "error"); submit.disabled = false; }
}

async function submitAssistant(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const input = form.elements.message;
  const message = input.value.trim();
  if (!message) return;
  state.assistantMessages.push({ role: "user", content: message });
  state.assistantMessages.push({ role: "assistant", content: isEnglish() ? "Thinking..." : "أفكر في اقتراح مناسب..." });
  renderStore();
  try {
    const result = await api("/api/assistant", { method: "POST", body: JSON.stringify({ message }) });
    state.assistantMessages[state.assistantMessages.length - 1] = { role: "assistant", content: result.answer };
  } catch (error) { state.assistantMessages[state.assistantMessages.length - 1] = { role: "assistant", content: error.message }; }
  renderStore();
  const messages = app.querySelector("#assistant-messages");
  if (messages) messages.scrollTop = messages.scrollHeight;
  app.querySelector("#assistant-form input")?.focus();
}

async function renderAdmin() {
  app.innerHTML = `<div class="boot-screen"><span class="loader"></span><p>${esc(t("saving"))}</p></div>`;
  try {
    const [products, orders, settings] = await Promise.all([
      api("/api/admin/products"), api("/api/admin/orders"), api("/api/admin/settings"),
    ]);
    state.adminProducts = products.products;
    state.orders = orders.orders;
    state.store = { ...state.store, ...settings.settings };
  } catch (error) { state.user = null; renderAdminLogin(); return; }
  const tabTitle = { products: t("products"), orders: t("orders"), settings: t("settings") }[state.tab];
  app.innerHTML = `<div class="admin-layout"><aside class="admin-sidebar"><a class="wordmark" href="/admin"><span class="brand-mark">ب</span><span>${esc(state.store.name)}</span></a><div class="admin-profile"><span class="profile-dot">${esc(state.user.name.slice(0, 1))}</span><div><strong>${esc(state.user.name)}</strong><small>${isEnglish() ? "Store manager" : "مدير المتجر"}</small></div></div><nav class="admin-nav"><button class="${state.tab === "products" ? "active" : ""}" data-tab="products"><span>▦</span>${esc(t("products"))}<small>${state.adminProducts.length}</small></button><button class="${state.tab === "orders" ? "active" : ""}" data-tab="orders"><span>↗</span>${esc(t("orders"))}<small>${state.orders.filter((order) => order.status === "new").length}</small></button><button class="${state.tab === "settings" ? "active" : ""}" data-tab="settings"><span>⚙</span>${esc(t("settings"))}</button></nav><div class="sidebar-bottom"><button class="text-button" data-action="language">${esc(t("language"))}</button><button class="logout-link" data-action="logout">↪ ${esc(t("logout"))}</button><a class="back-link" href="/">${isEnglish() ? "Open customer store" : "فتح متجر الزبائن"} ↗</a></div></aside>
      <section class="admin-main"><header class="admin-topbar"><div><p class="eyebrow">${isEnglish() ? "STORE CONTROL" : "إدارة المتجر"}</p><h1>${esc(tabTitle)}</h1></div><span class="admin-date">${new Intl.DateTimeFormat(isEnglish() ? "en" : "ar-SA", { dateStyle: "medium" }).format(new Date())}</span></header><div class="admin-content">${state.tab === "products" ? renderProductManagement() : state.tab === "orders" ? renderOrderManagement() : renderSettings()}</div></section></div>${state.modal ? renderConfirmModal() : ""}`;
  bindAdminEvents();
}

function renderProductManagement() {
  return `<div class="admin-section-head"><div><h2>${esc(t("products"))}<span class="count-tag">${state.adminProducts.length}</span></h2><p>${isEnglish() ? "Manage catalog, prices, availability and stock." : "إدارة المنتجات والأسعار والتوفر والمخزون."}</p></div><button class="button button-primary" data-action="new-product">＋ ${esc(t("addProduct"))}</button></div>
    <form id="product-form" class="product-editor" ${state.editorOpen ? "" : "hidden"}><div class="editor-title"><div><p class="eyebrow">${esc(state.editingProduct ? t("editProduct") : t("addProduct"))}</p><h3>${esc(state.editingProduct ? state.editingProduct.name : t("addProduct"))}</h3></div><button class="close-button" type="button" data-action="close-editor">×</button></div><div class="editor-grid">
      <label>${esc(t("productName"))}<input name="name" required maxlength="120" value="${esc(state.editingProduct?.name || "")}"></label><label>${esc(t("category"))}<select name="category" required>${categories.map((category) => `<option value="${esc(category)}" ${state.editingProduct?.category === category ? "selected" : ""}>${esc(t("categoryLabels")[category] || category)}</option>`).join("")}</select></label>
      <label>${esc(t("price"))}<input name="price" type="text" inputmode="decimal" pattern="[0-9٠-٩۰-۹]+([.,٫][0-9٠-٩۰-۹]{1,2})?" required value="${state.editingProduct ? esc(state.editingProduct.price) : ""}" placeholder="0.00" dir="ltr"></label><label>${esc(t("quantity"))}<input name="stock" type="text" inputmode="numeric" pattern="[0-9٠-٩۰-۹]+" required value="${state.editingProduct ? esc(state.editingProduct.stock) : "0"}" dir="ltr"></label>
      <label class="span-two">${esc(t("description"))}<input name="description" maxlength="500" value="${esc(state.editingProduct?.description || "")}"></label><label class="image-picker span-two"><span>${esc(t("productImage"))}</span><input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp" capture="environment"><small>${esc(t("chooseImage"))} · JPG, PNG, WEBP</small><img id="image-preview" alt="" src="${esc(state.productImage || state.editingProduct?.image || "")}" ${state.productImage || state.editingProduct?.image ? "" : "hidden"}></label>
      <label class="toggle-label"><input name="visible" type="checkbox" ${state.editingProduct?.visible === false ? "" : "checked"}><span>${esc(t("visible"))}</span></label></div><div class="editor-actions"><button class="button button-primary" type="submit">${esc(t("save"))}</button><button class="button button-outline" type="button" data-action="close-editor">${esc(t("cancel"))}</button></div></form>
    ${state.adminProducts.length ? `<div class="admin-product-list"><div class="list-labels"><span>${esc(t("productName"))}</span><span>${esc(t("price"))}</span><span>${esc(t("stock"))}</span><span>${esc(t("status"))}</span><span></span></div>${state.adminProducts.map((product) => `<article class="admin-product-row"><div class="admin-product-name"><span class="admin-thumb">${productVisual(product, true)}</span><div><strong>${esc(product.name)}</strong><small>${esc(t("categoryLabels")[product.category] || product.category)}</small></div></div><strong>${money(product.price)}</strong><span class="stock-cell ${product.stock < 5 ? "low-stock" : ""}">${product.stock}</span><span class="visibility-state ${product.visible && product.stock ? "on" : "off"}">${product.visible && product.stock ? esc(t("available")) : esc(t("unavailable"))}</span><div class="row-actions"><button class="small-action" data-action="edit-product" data-id="${product.id}" title="${esc(t("editProduct"))}">✎</button><button class="small-action danger-action" data-action="delete-product" data-id="${product.id}" title="${esc(t("delete"))}">×</button></div></article>`).join("")}</div>` : `<div class="empty-state admin-empty"><span class="empty-symbol">▦</span><h3>${esc(t("emptyProducts"))}</h3><p>${isEnglish() ? "Add your first real product with its own photo and price." : "أضف أول منتج حقيقي بصورته وسعره من هنا."}</p></div>`}`;
}

function renderOrderManagement() {
  if (!state.orders.length) return `<div class="admin-section-head"><div><h2>${esc(t("orders"))}</h2><p>${isEnglish() ? "Customer orders appear here." : "ستظهر طلبات الزبائن هنا."}</p></div></div><div class="empty-state admin-empty"><span class="empty-symbol">↗</span><h3>${esc(t("noOrders"))}</h3></div>`;
  return `<div class="admin-section-head"><div><h2>${esc(t("orders"))}<span class="count-tag">${state.orders.length}</span></h2><p>${isEnglish() ? "Review the delivery details and update each order." : "راجع بيانات التوصيل وحدّث حالة كل طلب."}</p></div><button class="button button-outline" data-action="refresh-admin">↻ ${isEnglish() ? "Refresh" : "تحديث"}</button></div><div class="orders-list">${state.orders.map((order) => `<article class="order-card"><div class="order-card-head"><div><span class="order-number">#${esc(order.id)}</span><strong>${esc(order.customerName)}</strong><small>${new Date(order.createdAt * 1000).toLocaleString(isEnglish() ? "en" : "ar-SA")}</small></div><select data-order-status="${esc(order.id)}" aria-label="${esc(t("status"))}">${["new", "preparing", "on_way", "complete", "cancelled"].map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${esc(t(status))}</option>`).join("")}</select></div><div class="order-details"><span>${esc(order.phone)}</span><span>${esc(order.city)}، ${esc(order.district)} · ${esc(order.street)} ${esc(order.house)}</span>${order.latitude != null && order.longitude != null ? `<a href="https://maps.google.com/?q=${order.latitude},${order.longitude}" target="_blank" rel="noopener">${esc(t("viewLocation"))}</a>` : ""}${order.note ? `<span>${esc(order.note)}</span>` : ""}</div><div class="order-lines">${order.items.map((item) => `<span>${esc(item.name)} × ${item.quantity}<strong>${money(item.subtotal)}</strong></span>`).join("")}</div><div class="order-total"><span>${esc(t("total"))}</span><strong>${money(order.total)}</strong></div></article>`).join("")}</div>`;
}

function renderSettings() {
  return `<div class="admin-section-head"><div><h2>${esc(t("settings"))}</h2><p>${isEnglish() ? "These details are shown to customers at checkout." : "تظهر هذه البيانات للزبائن في المتجر وإتمام الطلب."}</p></div></div><form id="settings-form" class="settings-form"><label>${esc(t("storeName"))}<input name="name" required maxlength="80" value="${esc(state.store.name)}"></label><label>${esc(t("storeWhatsApp"))}<input name="whatsapp" type="text" inputmode="tel" dir="ltr" value="${esc(state.store.whatsapp || "")}" placeholder="9665xxxxxxxx" pattern="[+0-9 ()-]{8,20}"><small>${esc(t("phoneFormat"))}</small></label><button class="button button-primary" type="submit">${esc(t("saveSettings"))}</button><p class="settings-note">${isEnglish() ? "Product and order records are stored in the server database." : "تحفظ المنتجات والطلبات في قاعدة بيانات الخادم وتظهر على الأجهزة المتصلة به."}</p></form>`;
}

function renderConfirmModal() {
  return `<div class="overlay confirm-overlay"><section class="confirm-dialog" role="alertdialog" aria-modal="true"><span class="confirm-mark">!</span><h2>${esc(t("confirmDelete"))}</h2><p>${esc(state.modal?.name || "")}</p><div><button class="button button-danger" data-action="confirm-delete">${esc(t("confirm"))}</button><button class="button button-outline" data-action="cancel-delete">${esc(t("cancel"))}</button></div></section></div>`;
}

function bindAdminEvents() {
  app.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => { state.tab = button.dataset.tab; state.editorOpen = false; state.editingProduct = null; state.productImage = ""; renderAdmin(); }));
  app.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", handleAdminAction));
  app.querySelector("#product-form")?.addEventListener("submit", saveProduct);
  app.querySelector("#settings-form")?.addEventListener("submit", saveSettings);
  app.querySelectorAll("[data-order-status]").forEach((select) => select.addEventListener("change", updateOrderStatus));
  app.querySelector("input[name=imageFile]")?.addEventListener("change", previewImage);
}

function handleAdminAction(event) {
  const action = event.currentTarget.dataset.action;
  const id = Number(event.currentTarget.dataset.id);
  if (action === "language") setLanguage(isEnglish() ? "ar" : "en");
  if (action === "logout") logout();
  if (action === "new-product") { state.editingProduct = null; state.productImage = ""; state.editorOpen = true; renderAdmin().then(() => app.querySelector("#product-form")?.scrollIntoView({ behavior: "smooth", block: "center" })); }
  if (action === "close-editor") { state.editingProduct = null; state.productImage = ""; state.editorOpen = false; renderAdmin(); }
  if (action === "edit-product") { state.editingProduct = state.adminProducts.find((product) => product.id === id); state.productImage = ""; state.editorOpen = true; renderAdmin().then(() => app.querySelector("#product-form")?.scrollIntoView({ behavior: "smooth", block: "center" })); }
  if (action === "delete-product") { state.modal = state.adminProducts.find((product) => product.id === id); renderAdmin(); }
  if (action === "cancel-delete") { state.modal = null; renderAdmin(); }
  if (action === "confirm-delete") deleteProduct();
  if (action === "refresh-admin") renderAdmin();
}

function normalizeDigits(value) {
  return String(value).replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))).replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace("٫", ".").replace(",", ".");
}

function previewImage(event) {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) { toast(isEnglish() ? "Choose a JPG, PNG or WEBP image under 5 MB." : "اختر صورة JPG أو PNG أو WEBP لا يتجاوز حجمها 5 ميغابايت.", "error"); event.currentTarget.value = ""; return; }
  const reader = new FileReader();
  reader.onload = () => { state.productImage = reader.result; const preview = app.querySelector("#image-preview"); preview.src = state.productImage; preview.hidden = false; };
  reader.readAsDataURL(file);
}

async function saveProduct(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const fields = Object.fromEntries(new FormData(form));
  const product = {
    name: fields.name,
    description: fields.description,
    category: fields.category,
    price: normalizeDigits(fields.price),
    stock: normalizeDigits(fields.stock),
    visible: form.elements.visible.checked,
    image: state.productImage || state.editingProduct?.image || "",
  };
  try {
    await api(state.editingProduct ? `/api/admin/products/${state.editingProduct.id}` : "/api/admin/products", { method: state.editingProduct ? "PUT" : "POST", body: JSON.stringify(product) });
    state.editingProduct = null;
    state.productImage = "";
    state.editorOpen = false;
    toast(t("saved"));
    await loadProducts();
    renderAdmin();
  } catch (error) { toast(error.message, "error"); }
}

async function deleteProduct() {
  if (!state.modal) return;
  try {
    await api(`/api/admin/products/${state.modal.id}`, { method: "DELETE" });
    state.modal = null;
    await loadProducts();
    toast(isEnglish() ? "Product deleted" : "تم حذف المنتج");
    renderAdmin();
  } catch (error) { toast(error.message, "error"); }
}

async function saveSettings(event) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  try {
    const result = await api("/api/admin/settings", { method: "PUT", body: JSON.stringify(values) });
    state.store = { ...state.store, ...result.settings };
    toast(t("saved"));
    renderAdmin();
  } catch (error) { toast(error.message, "error"); }
}

async function updateOrderStatus(event) {
  const orderId = event.currentTarget.dataset.orderStatus;
  try {
    await api(`/api/admin/orders/${orderId}/status`, { method: "PUT", body: JSON.stringify({ status: event.currentTarget.value }) });
    toast(t("saved"));
  } catch (error) { toast(error.message, "error"); }
}

async function loadProducts() {
  const result = await api("/api/products");
  state.products = result.products;
  state.store = { ...state.store, ...result.store };
}

async function syncSharedData() {
  if (syncInFlight || document.hidden || !state.user) return;
  syncInFlight = true;
  try {
    if (window.location.pathname === "/admin" && state.user.role === "admin") {
      const active = app.contains(document.activeElement) && ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
      const settingsForm = app.querySelector("#settings-form");
      const settingsDirty = settingsForm && (settingsForm.elements.name.value !== state.store.name || settingsForm.elements.whatsapp.value !== state.store.whatsapp);
      if (state.editorOpen || state.modal || active || settingsDirty) return;
      const [products, orders, settings] = await Promise.all([
        api("/api/admin/products"), api("/api/admin/orders"), api("/api/admin/settings"),
      ]);
      const changed = JSON.stringify([products.products, orders.orders, settings.settings]) !== JSON.stringify([state.adminProducts, state.orders, { name: state.store.name, whatsapp: state.store.whatsapp }]);
      if (!changed) return;
      state.adminProducts = products.products;
      state.orders = orders.orders;
      state.store = { ...state.store, ...settings.settings };
      await renderAdmin();
      return;
    }
    if (state.user.role === "customer") {
      const previous = JSON.stringify([state.products, state.store]);
      await loadProducts();
      if (previous !== JSON.stringify([state.products, state.store]) && !state.cartOpen && !state.checkoutOpen) renderStore();
    }
  } catch {
    // Keep the current view usable while the server is temporarily unavailable.
  } finally {
    syncInFlight = false;
  }
}

function startAutoSync() {
  window.setInterval(syncSharedData, 30000);
  window.addEventListener("focus", syncSharedData);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) syncSharedData(); });
}

async function logout() {
  const role = state.user?.role || (window.location.pathname === "/admin" ? "admin" : "customer");
  try { await api("/api/logout", { method: "POST", body: JSON.stringify({ role }) }); } catch { /* Continue to the signed-out page. */ }
  localStorage.removeItem(`grocery-cart-${state.user?.id}`);
  navigate("/auth");
}

async function start() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = isEnglish() ? "ltr" : "rtl";
  const path = window.location.pathname;
  try {
    const role = path === "/admin" ? "admin" : "customer";
    const session = await api(`/api/session?role=${role}`);
    state.user = session.user;
    state.store = { ...state.store, ...session.store };
  } catch { state.user = null; }
  if (path === "/admin") {
    if (state.user?.role === "admin") { await renderAdmin(); startAutoSync(); }
    else renderAdminLogin();
    return;
  }
  if (state.user?.role === "customer") {
    if (path === "/auth") { navigate("/"); return; }
    getCart();
    try { await loadProducts(); } catch (error) { toast(error.message, "error"); }
    renderStore();
    startAutoSync();
    return;
  }
  if (path !== "/auth") { navigate("/auth"); return; }
  renderAuth();
}

start();
