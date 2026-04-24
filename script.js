const products = [
  {
    slug: "hoodie",
    title: "Signature Hoodie",
    price: 330,
    image: "hud1.jpg",
    description: "Heavyweight cotton fleece cut for clean layering, colder nights, and everyday streetwear rotation.",
    sizes: ["S", "M", "L", "XL"],
    highlights: [
      "Heavyweight cotton fleece with a soft brushed interior.",
      "Relaxed silhouette designed for everyday comfort.",
      "Minimal TRUFAGO branding for a refined statement finish.",
    ],
  },
  {
    slug: "tshirt",
    title: "TRUFAGO T-Shirt",
    price: 180,
    image: "T shirt.jpg",
    description: "A breathable logo tee with a structured fit that keeps its shape and works across casual looks.",
    sizes: ["S", "M", "L", "XL"],
    highlights: [
      "Soft cotton feel with lightweight comfort.",
      "Clean logo front for a bold but versatile look.",
      "Easy to style with cargos, denim, or layered outerwear.",
    ],
  },
  {
    slug: "cap",
    title: "Street Cap",
    price: 140,
    image: "tru1.jpg",
    description: "Structured headwear with a clean curved peak, premium embroidery, and an adjustable everyday fit.",
    sizes: ["One Size"],
    highlights: [
      "Adjustable closure for a secure one-size fit.",
      "Structured crown that holds its shape well.",
      "Finished with premium TRUFAGO embroidery.",
    ],
  },
  {
    slug: "beanie",
    title: "Slouchy Beanie",
    price: 150,
    image: "Trufagologo.jpg",
    description: "Warm knit coverage with a relaxed silhouette that adds an effortless edge to cooler weather outfits.",
    sizes: ["One Size"],
    highlights: [
      "Soft knit construction built for everyday wear.",
      "Relaxed slouch profile with a clean streetwear finish.",
      "Easy winter styling with hoodies, jackets, and tracksuits.",
    ],
  },
  {
    slug: "tracksuit",
    title: "Mafia Tracksuit",
    price: 760,
    image: "mafia.jpg",
    description: "A matching set designed to feel premium, sharp, and complete from the first wear.",
    sizes: ["S", "M", "L", "XL"],
    highlights: [
      "Coordinated jacket and jogger set for a polished fit.",
      "Premium zip details and strong visual structure.",
      "Built for standout styling without sacrificing comfort.",
    ],
  },
  {
    slug: "cargo",
    title: "Cargo Pants",
    price: 420,
    image: "hud1.jpg",
    description: "Utility-inspired trousers with a tapered leg, practical storage, and a clean everyday silhouette.",
    sizes: ["S", "M", "L", "XL"],
    highlights: [
      "Tapered fit for a sharper streetwear profile.",
      "Functional pockets with utility-inspired detailing.",
      "Durable enough for daily wear and repeat styling.",
    ],
  },
];

const CART_KEY = "trufagoCart";
const ORDER_KEY = "trufagoOrder";
const PAYMENT_RECEIPT_KEY = "trufagoPaymentReceipt";

const paymentProviders = {
  stripe: {
    title: "Stripe Demo",
    badge: "Card checkout demo",
    description:
      "This simulates a Stripe-style hosted card payment experience and confirms instantly once the demo form is submitted.",
    note:
      "Demo mode: use any test details here. A common card number for demo styling is 4242 4242 4242 4242.",
    submitLabel: "Pay with Stripe demo",
    successMessage: "Stripe demo payment completed successfully.",
    renderFields: (order) => `
      <div class="demo-field-grid">
        <div class="form-group">
          <label for="demo-name">Cardholder name</label>
          <input type="text" id="demo-name" name="customerName" value="${order?.fullName || ""}" placeholder="Full name" required>
        </div>
        <div class="form-group">
          <label for="demo-email">Email address</label>
          <input type="email" id="demo-email" name="customerEmail" value="${order?.email || ""}" placeholder="you@example.com" required>
        </div>
      </div>
      <div class="form-group">
        <label for="demo-card-number">Card number</label>
        <input type="text" id="demo-card-number" name="cardNumber" inputmode="numeric" placeholder="4242 4242 4242 4242" required>
      </div>
      <div class="demo-field-grid">
        <div class="form-group">
          <label for="demo-expiry">Expiry</label>
          <input type="text" id="demo-expiry" name="expiry" placeholder="12/34" required>
        </div>
        <div class="form-group">
          <label for="demo-cvc">CVC</label>
          <input type="text" id="demo-cvc" name="cvc" inputmode="numeric" placeholder="123" required>
        </div>
      </div>
    `,
  },
  payfast: {
    title: "PayFast Demo",
    badge: "South African gateway demo",
    description:
      "This simulates a PayFast redirect flow and lets you choose a payment method before completing the local demo payment.",
    note:
      "Demo mode: this does not connect to PayFast yet. It is here to preview how the gateway choice and payment step will feel.",
    submitLabel: "Pay with PayFast demo",
    successMessage: "PayFast demo payment completed successfully.",
    renderFields: (order) => `
      <div class="demo-field-grid">
        <div class="form-group">
          <label for="demo-payfast-name">Customer name</label>
          <input type="text" id="demo-payfast-name" name="customerName" value="${order?.fullName || ""}" placeholder="Full name" required>
        </div>
        <div class="form-group">
          <label for="demo-payfast-email">Email address</label>
          <input type="email" id="demo-payfast-email" name="customerEmail" value="${order?.email || ""}" placeholder="you@example.com" required>
        </div>
      </div>
      <div class="demo-field-grid">
        <div class="form-group">
          <label for="demo-payfast-phone">Phone number</label>
          <input type="tel" id="demo-payfast-phone" name="customerPhone" value="${order?.phone || ""}" placeholder="+27 81 000 0000" required>
        </div>
        <div class="form-group">
          <label for="demo-payfast-method">PayFast method</label>
          <select id="demo-payfast-method" name="payfastMethod" required>
            <option value="">Select method</option>
            <option value="card">Card payment</option>
            <option value="eft">Instant EFT</option>
            <option value="scan">Scan to Pay</option>
          </select>
        </div>
      </div>
    `,
  },
};

const getStoredJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch (error) {
    return fallback;
  }
};

const getCart = () => getStoredJson(CART_KEY, []);
const getOrder = () => getStoredJson(ORDER_KEY, null);
const getPaymentReceipt = () => getStoredJson(PAYMENT_RECEIPT_KEY, null);
const setCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));
const setPaymentReceipt = (receipt) => localStorage.setItem(PAYMENT_RECEIPT_KEY, JSON.stringify(receipt));
const clearPaymentReceipt = () => localStorage.removeItem(PAYMENT_RECEIPT_KEY);

const formatCurrency = (amount) => `R${Number(amount || 0).toLocaleString("en-ZA")}`;
const getCartTotal = (items) => items.reduce((sum, item) => sum + item.price * Number(item.quantity), 0);
const buildDemoReference = (provider) =>
  `TRU-${provider.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const updateCartCount = () => {
  const count = getCart().reduce((sum, item) => sum + Number(item.quantity), 0);
  document.querySelectorAll(".cart-count").forEach((badge) => {
    badge.textContent = count;
  });
};

const showMessage = (container, message, type = "success") => {
  if (!container) return;
  container.textContent = message;
  container.className = `form-message ${type}`;
  container.style.display = "block";
  container.scrollIntoView({ behavior: "smooth", block: "center" });
};

const getProductBySlug = (slug) => products.find((product) => product.slug === slug);

const addToCart = (slug, size, quantity) => {
  const product = getProductBySlug(slug);
  if (!product) return;

  const cart = getCart();
  const existingItem = cart.find((item) => item.slug === slug && item.size === size);

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.push({
      slug,
      size,
      quantity: Number(quantity),
      title: product.title,
      price: product.price,
      image: product.image,
    });
  }

  setCart(cart);
  updateCartCount();
};

const renderCartItems = (items) =>
  items
    .map(
      (item) => `
        <div class="order-item">
          <div>
            <strong>${item.title}</strong>
            <p>Size: ${item.size} &middot; Quantity: ${item.quantity}</p>
          </div>
          <span class="price">${formatCurrency(item.price * Number(item.quantity))}</span>
        </div>
      `
    )
    .join("");

const renderProductPage = () => {
  const productPage = document.querySelector(".product-page");
  if (!productPage) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const product = getProductBySlug(slug);

  const productImage = document.getElementById("product-image");
  const productTitle = document.getElementById("product-title");
  const productPrice = document.getElementById("product-price");
  const productDescription = document.getElementById("product-description");
  const productHighlights = document.getElementById("product-highlights");
  const productSize = document.getElementById("product-size");
  const addToCartForm = document.getElementById("product-form");
  const productMessage = document.getElementById("product-message");

  if (!product) {
    productPage.innerHTML =
      '<div class="empty-state"><h3>Product not found</h3><p>Please return to the collection and choose an available item.</p><a class="btn btn-primary" href="index.html#products">Back to collection</a></div>';
    return;
  }

  if (productImage) {
    productImage.src = product.image;
    productImage.alt = product.title;
  }

  if (productTitle) productTitle.textContent = product.title;
  if (productPrice) productPrice.textContent = formatCurrency(product.price);
  if (productDescription) productDescription.textContent = product.description;

  if (productHighlights) {
    productHighlights.innerHTML = product.highlights.map((item) => `<li>${item}</li>`).join("");
  }

  if (productSize) {
    productSize.innerHTML =
      '<option value="">Select size</option>' +
      product.sizes.map((size) => `<option value="${size}">${size}</option>`).join("");
  }

  if (addToCartForm) {
    addToCartForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const size = addToCartForm.size.value;
      const quantity = addToCartForm.quantity.value;

      if (!size || !quantity) {
        showMessage(productMessage, "Select a size and quantity before adding this item.", "error");
        return;
      }

      addToCart(slug, size, quantity);
      showMessage(productMessage, "Added to your bag. You can continue shopping or head to checkout.", "success");
    });
  }
};

const renderCartPage = () => {
  const cartPage = document.querySelector(".cart-page");
  if (!cartPage) return;

  const cartItems = getCart();
  const cartContainer = document.getElementById("cart-container");
  const cartTotal = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");

  if (!cartContainer || !cartTotal || !checkoutButton) return;

  if (cartItems.length === 0) {
    cartContainer.innerHTML =
      '<div class="empty-state"><h3>Your cart is empty</h3><p>Add a few pieces from the collection and they will appear here instantly.</p><a class="btn btn-primary" href="index.html#products">Browse products</a></div>';
    cartTotal.textContent = formatCurrency(0);
    checkoutButton.href = "index.html#products";
    checkoutButton.textContent = "Explore collection";
    return;
  }

  const rows = cartItems
    .map((item, index) => {
      const subtotal = item.price * Number(item.quantity);
      return `
        <tr>
          <td><strong>${item.title}</strong><br><small>${item.size}</small></td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(subtotal)}</td>
          <td><button type="button" data-index="${index}" class="remove-cart-item">Remove</button></td>
        </tr>
      `;
    })
    .join("");

  cartContainer.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Subtotal</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  cartTotal.textContent = formatCurrency(getCartTotal(cartItems));
  checkoutButton.href = "order.html";
  checkoutButton.textContent = "Continue to checkout";

  cartContainer.querySelectorAll(".remove-cart-item").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      const currentCart = getCart();
      currentCart.splice(index, 1);
      setCart(currentCart);
      updateCartCount();
      renderCartPage();
    });
  });
};

const renderOrderFormFromCart = () => {
  const orderPage = document.querySelector(".order-page");
  if (!orderPage) return;

  const cartItems = getCart();
  const cartSummary = document.getElementById("cart-summary");
  const orderForm = document.getElementById("order-form");
  if (!cartSummary || !orderForm) return;

  if (cartItems.length === 0) {
    cartSummary.innerHTML =
      '<div class="empty-state"><h3>Your cart is empty</h3><p>Add products to your bag before entering delivery details.</p><a class="btn btn-primary" href="index.html#products">Shop now</a></div>';
    orderForm.querySelectorAll("input, textarea, select, button").forEach((field) => {
      field.disabled = true;
    });
    return;
  }

  cartSummary.innerHTML = `
    <h3>Your order</h3>
    <p>Review your selected items below. When everything looks right, add your delivery details and continue to the payment provider demo.</p>
    ${renderCartItems(cartItems)}
    <p class="order-total">Total: <span>${formatCurrency(getCartTotal(cartItems))}</span></p>
    <ul class="timeline-list">
      <li>Checkout details are saved securely on this device for the payment step.</li>
      <li>Choose Stripe Demo or PayFast Demo on the next page.</li>
    </ul>
  `;
};

const renderOrderSummary = () => {
  const summaryContainer = document.getElementById("order-summary");
  if (!summaryContainer) return;

  const receipt = getPaymentReceipt();
  const isPaymentPage = Boolean(document.querySelector(".payment-page"));

  if (isPaymentPage && receipt) {
    summaryContainer.innerHTML = `
      <h3>Payment successful</h3>
      <p>Your demo payment has been completed and the order flow is now finished.</p>
      <div class="receipt-card">
        <div class="receipt-row">
          <span>Gateway</span>
          <strong>${receipt.providerTitle}</strong>
        </div>
        <div class="receipt-row">
          <span>Reference</span>
          <strong>${receipt.reference}</strong>
        </div>
        <div class="receipt-row">
          <span>Amount</span>
          <strong>${formatCurrency(receipt.amount)}</strong>
        </div>
        <div class="receipt-row">
          <span>Paid at</span>
          <strong>${new Date(receipt.paidAt).toLocaleString("en-ZA")}</strong>
        </div>
      </div>
      ${renderCartItems(receipt.items)}
      <ul class="detail-list">
        <li><strong>Name:</strong> ${receipt.customerName}</li>
        <li><strong>Email:</strong> ${receipt.customerEmail}</li>
      </ul>
    `;
    return;
  }

  const order = getOrder();
  if (!order || !Array.isArray(order.items) || order.items.length === 0) {
    summaryContainer.innerHTML =
      '<div class="empty-state"><h3>No order details found</h3><p>Complete your checkout details first so your payment demo can be matched to an order.</p><a class="btn btn-primary" href="order.html">Go to checkout</a></div>';
    return;
  }

  summaryContainer.innerHTML = `
    <h3>Order summary</h3>
    <p>Confirm your details, then choose either Stripe Demo or PayFast Demo to complete this sample checkout.</p>
    ${renderCartItems(order.items)}
    <p class="order-total">Order total: <span>${formatCurrency(order.total)}</span></p>
    <ul class="detail-list">
      <li><strong>Name:</strong> ${order.fullName}</li>
      <li><strong>Email:</strong> ${order.email}</li>
      <li><strong>Phone:</strong> ${order.phone}</li>
      <li><strong>Delivery address:</strong> ${order.address}</li>
      ${order.notes ? `<li><strong>Order notes:</strong> ${order.notes}</li>` : ""}
    </ul>
  `;
};

const renderPaymentPageState = () => {
  const paymentPage = document.querySelector(".payment-page");
  if (!paymentPage) return;

  const hasOrder = Boolean(getOrder()?.items?.length);
  const receipt = getPaymentReceipt();
  const triggers = paymentPage.querySelectorAll(".demo-payment-trigger");

  triggers.forEach((button) => {
    if (receipt) {
      button.disabled = true;
      button.textContent = "Payment completed";
      return;
    }

    if (!hasOrder) {
      button.disabled = true;
      button.textContent = "Checkout required first";
      return;
    }

    button.disabled = false;
    button.textContent =
      button.dataset.provider === "stripe" ? "Launch Stripe demo" : "Launch PayFast demo";
  });
};

let activeCheckoutProvider = null;
let activeCheckoutReference = null;

const closeCheckoutModal = () => {
  const modal = document.getElementById("checkout-modal");
  const form = document.getElementById("demo-checkout-form");
  const message = document.getElementById("checkout-form-message");
  if (!modal || modal.hasAttribute("hidden")) return;

  modal.setAttribute("hidden", "");
  document.body.classList.remove("modal-open");
  activeCheckoutProvider = null;
  activeCheckoutReference = null;

  if (form) {
    form.reset();
  }

  if (message) {
    message.className = "form-message";
    message.style.display = "none";
    message.textContent = "";
  }
};

const openCheckoutModal = (providerKey) => {
  const modal = document.getElementById("checkout-modal");
  const title = document.getElementById("checkout-title");
  const description = document.getElementById("checkout-description");
  const badge = document.getElementById("checkout-provider-badge");
  const amount = document.getElementById("checkout-amount");
  const reference = document.getElementById("checkout-reference");
  const note = document.getElementById("checkout-demo-note");
  const fields = document.getElementById("checkout-fields");
  const submitButton = document.getElementById("checkout-submit");
  const order = getOrder();
  const provider = paymentProviders[providerKey];

  if (!modal || !title || !description || !badge || !amount || !reference || !note || !fields || !submitButton) return;

  if (!provider || !order || !Array.isArray(order.items) || order.items.length === 0) {
    showMessage(
      document.getElementById("payment-message"),
      "Complete your checkout details first so the payment demo has an order to use.",
      "error"
    );
    return;
  }

  activeCheckoutProvider = providerKey;
  activeCheckoutReference = buildDemoReference(providerKey);
  title.textContent = provider.title;
  description.textContent = provider.description;
  badge.textContent = provider.badge;
  amount.textContent = formatCurrency(order.total);
  reference.textContent = `Order reference: ${activeCheckoutReference}`;
  note.innerHTML = `<strong>Demo note:</strong> ${provider.note}`;
  fields.innerHTML = provider.renderFields(order);
  submitButton.textContent = provider.submitLabel;

  modal.removeAttribute("hidden");
  document.body.classList.add("modal-open");

  const firstField = fields.querySelector("input, select, textarea");
  if (firstField) {
    firstField.focus();
  }
};

const completeDemoPayment = () => {
  const provider = paymentProviders[activeCheckoutProvider];
  const order = getOrder();
  const paymentMessage = document.getElementById("payment-message");
  const submitButton = document.getElementById("checkout-submit");
  const form = document.getElementById("demo-checkout-form");
  const checkoutMessage = document.getElementById("checkout-form-message");

  if (!provider || !order || !form || !submitButton || !checkoutMessage) return;

  const formData = new FormData(form);
  const customerName = String(formData.get("customerName") || order.fullName || "").trim();
  const customerEmail = String(formData.get("customerEmail") || order.email || "").trim();

  if (!customerName || !customerEmail) {
    showMessage(checkoutMessage, "Please complete the required payment details before continuing.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Processing demo payment...";

  const receipt = {
    providerKey: activeCheckoutProvider,
    providerTitle: provider.title,
    reference: activeCheckoutReference || buildDemoReference(activeCheckoutProvider),
    amount: order.total,
    items: order.items,
    customerName,
    customerEmail,
    paidAt: new Date().toISOString(),
  };

  setTimeout(() => {
    setPaymentReceipt(receipt);
    localStorage.removeItem(ORDER_KEY);
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    closeCheckoutModal();
    renderPaymentPageState();
    renderOrderSummary();
    showMessage(paymentMessage, `${provider.successMessage} Reference: ${receipt.reference}.`, "success");
    submitButton.disabled = false;
    submitButton.textContent = provider.submitLabel;
  }, 900);
};

const setActiveNavigation = () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const target = link.getAttribute("href");
    if (!target) return;
    const isCurrent = target === currentPage;
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    const closeNav = () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", (event) => {
      if (!navLinks.classList.contains("open")) return;
      if (navLinks.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });
  }

  setActiveNavigation();

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const loginMessage = document.getElementById("login-message");
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      if (!email || !password) {
        showMessage(loginMessage, "Please enter both your email address and password.", "error");
        return;
      }

      showMessage(loginMessage, "Welcome back. Your account details look good and you can continue shopping.", "success");
    });
  }

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    const signupMessage = document.getElementById("signup-message");
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = signupForm.name.value.trim();
      const email = signupForm.email.value.trim();
      const password = signupForm.password.value.trim();
      const confirmPassword = signupForm.confirmPassword.value.trim();

      if (!name || !email || !password || !confirmPassword) {
        showMessage(signupMessage, "Please complete every field before creating your account.", "error");
        return;
      }

      if (password !== confirmPassword) {
        showMessage(signupMessage, "The passwords do not match yet. Please review them and try again.", "error");
        return;
      }

      showMessage(signupMessage, "Account created successfully. You can now log in and continue shopping.", "success");
      signupForm.reset();
    });
  }

  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    const orderMessage = document.getElementById("order-message");
    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const cartItems = getCart();
      if (cartItems.length === 0) {
        showMessage(orderMessage, "Your cart is empty. Add products before continuing to checkout.", "error");
        return;
      }

      const fullName = orderForm.fullName.value.trim();
      const email = orderForm.email.value.trim();
      const phone = orderForm.phone.value.trim();
      const address = orderForm.address.value.trim();
      const notes = orderForm.notes.value.trim();

      if (!fullName || !email || !phone || !address) {
        showMessage(orderMessage, "Please complete all required delivery details to continue.", "error");
        return;
      }

      const orderData = {
        items: cartItems,
        total: getCartTotal(cartItems),
        fullName,
        email,
        phone,
        address,
        notes,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(ORDER_KEY, JSON.stringify(orderData));
      clearPaymentReceipt();
      showMessage(orderMessage, "Checkout details saved. Redirecting you to payment confirmation...", "success");

      setTimeout(() => {
        window.location.href = "payment.html";
      }, 1100);
    });
  }

  const checkoutModal = document.getElementById("checkout-modal");
  const checkoutForm = document.getElementById("demo-checkout-form");
  const checkoutClose = document.getElementById("checkout-close");

  document.querySelectorAll(".demo-payment-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      openCheckoutModal(button.dataset.provider);
    });
  });

  document.querySelectorAll("[data-close-checkout]").forEach((element) => {
    element.addEventListener("click", closeCheckoutModal);
  });

  if (checkoutClose) {
    checkoutClose.addEventListener("click", closeCheckoutModal);
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      completeDemoPayment();
    });
  }

  if (checkoutModal) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCheckoutModal();
      }
    });
  }

  renderProductPage();
  renderCartPage();
  renderOrderFormFromCart();
  renderOrderSummary();
  renderPaymentPageState();
  updateCartCount();
});
