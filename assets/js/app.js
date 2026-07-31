/*
  CONFIGURACIÓN DE WHATSAPP
  Escribe el número con indicativo de país, sin el signo +, espacios ni guiones.
  Ejemplo para Colombia: 573001234567
*/
const STORE_WHATSAPP = "573151063929";

const products = [
  {
    id: "camiseta-urban",
    name: "Camiseta Urban",
    category: "ropa",
    categoryLabel: "Ropa",
    price: 45000,
    image: "assets/images/productos/camiseta-urban.png",
    description: "Camiseta negra de estilo urbano con identidad gráfica de StyleTech Store."
  },
  {
    id: "sudadera-tech",
    name: "Sudadera Tech",
    category: "ropa",
    categoryLabel: "Ropa",
    price: 85000,
    image: "assets/images/productos/sudadera-tech.png",
    description: "Sudadera negra con capota, bolsillo frontal y diseño de uso diario."
  },
  {
    id: "gorra-styletech",
    name: "Gorra StyleTech",
    category: "moda",
    categoryLabel: "Accesorios de moda",
    price: 35000,
    image: "assets/images/productos/gorra-styletech.png",
    description: "Gorra negra ajustable con bordado frontal de StyleTech Store."
  },
  {
    id: "audifonos-bluetooth",
    name: "Audífonos Bluetooth",
    category: "tecnologia",
    categoryLabel: "Tecnología",
    price: 65000,
    image: "assets/images/productos/audifonos-bluetooth.png",
    description: "Audífonos inalámbricos de diadema con diseño cómodo y acabado negro."
  },
  {
    id: "cargador-usb",
    name: "Cargador USB",
    category: "tecnologia",
    categoryLabel: "Tecnología",
    price: 45000,
    image: "assets/images/productos/cargador-usb.png",
    description: "Cargador compacto con puerto USB-C y puerto USB-A."
  },
  {
    id: "funda-premium",
    name: "Funda Premium",
    category: "tecnologia",
    categoryLabel: "Tecnología",
    price: 30000,
    image: "assets/images/productos/funda-premium.png",
    description: "Funda negra de acabado mate, bordes protegidos y diseño discreto."
  },
  {
    id: "smartwatch-fit",
    name: "Smartwatch Fit",
    category: "tecnologia",
    categoryLabel: "Tecnología",
    price: 120000,
    image: "assets/images/productos/smartwatch-fit.png",
    description: "Reloj inteligente con funciones de actividad física y notificaciones."
  },
  {
    id: "cable-reforzado",
    name: "Cable reforzado",
    category: "tecnologia",
    categoryLabel: "Tecnología",
    price: 22000,
    image: "assets/images/productos/cable-reforzado.png",
    description: "Cable trenzado USB-A a USB-C con extremos reforzados."
  }
];

const money = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

const state = {
  filter: "todos",
  search: "",
  cart: JSON.parse(localStorage.getItem("styletech-cart") || "{}")
};

const productGrid = document.querySelector("#product-grid");
const emptyState = document.querySelector("#empty-state");
const cartCount = document.querySelector("#cart-count");
const cartDrawer = document.querySelector("#cart-drawer");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartSubtotal = document.querySelector("#cart-subtotal");
const toast = document.querySelector("#toast");

function getWhatsAppUrl(message) {
  const encoded = encodeURIComponent(message);
  return STORE_WHATSAPP
    ? `https://wa.me/${STORE_WHATSAPP}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}

function openWhatsApp(message) {
  window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
}

function renderProducts() {
  const term = state.search.trim().toLowerCase();
  const visible = products.filter(product => {
    const categoryMatch = state.filter === "todos" || product.category === state.filter;
    const text = `${product.name} ${product.categoryLabel} ${product.description}`.toLowerCase();
    return categoryMatch && text.includes(term);
  });

  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-body">
        <span class="product-category">${product.categoryLabel}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <div class="product-price">
            <strong>${money.format(product.price)}</strong>
            <small>Pago contra entrega</small>
          </div>
          <button class="add-to-cart" type="button" data-add="${product.id}">Agregar</button>
        </div>
      </div>
    </article>
  `).join("");

  emptyState.hidden = visible.length > 0;
}

function saveCart() {
  localStorage.setItem("styletech-cart", JSON.stringify(state.cart));
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => {
      const product = products.find(item => item.id === id);
      return product ? { product, quantity } : null;
    })
    .filter(Boolean);
}

function updateCart() {
  const entries = cartEntries();
  const totalItems = entries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartSubtotal.textContent = money.format(subtotal);
  cartEmpty.hidden = entries.length > 0;

  cartItems.innerHTML = entries.map(({ product, quantity }) => `
    <article class="cart-item">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <strong>${product.name}</strong>
        <small>${money.format(product.price)}</small>
      </div>
      <div class="cart-item-actions">
        <div class="qty-controls">
          <button type="button" data-decrease="${product.id}">Disminuir</button>
          <span>${quantity}</span>
          <button type="button" data-increase="${product.id}">Aumentar</button>
        </div>
        <button class="remove-item" type="button" data-remove="${product.id}">Eliminar</button>
      </div>
    </article>
  `).join("");

  saveCart();
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  updateCart();
  showToast("Producto agregado al carrito");
}

function changeQuantity(id, amount) {
  const next = (state.cart[id] || 0) + amount;
  if (next <= 0) delete state.cart[id];
  else state.cart[id] = next;
  updateCart();
}

function removeFromCart(id) {
  delete state.cart[id];
  updateCart();
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
  document.body.classList.add("no-scroll");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
  document.body.classList.remove("no-scroll");
}

function buildOrderMessage() {
  const entries = cartEntries();
  if (!entries.length) return "";

  const lines = entries.map(({ product, quantity }) =>
    `${product.name} x${quantity}: ${money.format(product.price * quantity)}`
  );
  const subtotal = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return [
    "Hola, quiero realizar el siguiente pedido en StyleTech Store:",
    "",
    ...lines,
    "",
    `Subtotal: ${money.format(subtotal)}`,
    "Método de pago: efectivo contra entrega.",
    "",
    "Quedo atento para confirmar disponibilidad y lugar de entrega."
  ].join("\\n");
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);

  const increaseButton = event.target.closest("[data-increase]");
  if (increaseButton) changeQuantity(increaseButton.dataset.increase, 1);

  const decreaseButton = event.target.closest("[data-decrease]");
  if (decreaseButton) changeQuantity(decreaseButton.dataset.decrease, -1);

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) removeFromCart(removeButton.dataset.remove);

  const categoryButton = event.target.closest("[data-category-filter]");
  if (categoryButton) {
    state.filter = categoryButton.dataset.categoryFilter;
    document.querySelectorAll("[data-filter]").forEach(button => {
      button.classList.toggle("is-active", button.dataset.filter === state.filter);
    });
    renderProducts();
    document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
  }

  const whatsappButton = event.target.closest(".js-whatsapp");
  if (whatsappButton) {
    event.preventDefault();
    openWhatsApp(whatsappButton.dataset.message || "Hola StyleTech Store.");
  }
});

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(item => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderProducts();
  });
});

document.querySelector("#product-search").addEventListener("input", event => {
  state.search = event.target.value;
  renderProducts();
});

document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);

document.querySelector("#checkout-whatsapp").addEventListener("click", () => {
  const message = buildOrderMessage();
  if (!message) {
    showToast("Agrega al menos un producto");
    return;
  }
  openWhatsApp(message);
});

document.querySelector("#contact-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.querySelector("#contact-name").value.trim();
  const product = document.querySelector("#contact-product").value.trim();
  const message = document.querySelector("#contact-message").value.trim();

  const text = [
    `Hola, soy ${name}.`,
    `Quiero información sobre: ${product}.`,
    message ? `Consulta: ${message}` : ""
  ].filter(Boolean).join("\\n");

  openWhatsApp(text);
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

document.querySelector("#year").textContent = new Date().getFullYear();

renderProducts();
updateCart();
