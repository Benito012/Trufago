const products = [
  {
    slug: 'hoodie',
    title: 'Signature Hoodie',
    price: 330,
    image: 'hud1.jpg',
    description: 'Soft cotton fleece with bold minimal branding.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    slug: 'tshirt',
    title: 'TRUFAGO T-Shirt',
    price: 180,
    image: 'T shirt.jpg',
    description: 'Lightweight tee in black or white with bold logo print.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    slug: 'cap',
    title: 'Street Cap',
    price: 140,
    image: 'tru1.jpg',
    description: 'Structured fit with premium embroidery and adjustable strap.',
    sizes: ['One Size'],
  },
  {
    slug: 'beanie',
    title: 'Slouchy Beanie',
    price: 150,
    image: 'Trufagologo.jpg',
    description: 'Warm, relaxed fit beanie perfect for cool city nights.',
    sizes: ['One Size'],
  },
  {
    slug: 'tracksuit',
    title: 'Mafia Tracksuit',
    price: 760,
    image: 'mafia.jpg',
    description: 'Matching jacket and jogger set with premium zipper details.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    slug: 'cargo',
    title: 'Cargo Pants',
    price: 420,
    image: 'hud1.jpg',
    description: 'Durable street cargo pants with multiple pockets and tapered fit.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

const CART_KEY = 'trufagoCart';
const ORDER_KEY = 'trufagoOrder';

const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const setCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));

const updateCartCount = () => {
  const count = getCart().reduce((sum, item) => sum + Number(item.quantity), 0);
  document.querySelectorAll('.cart-count').forEach((badge) => {
    badge.textContent = count;
  });
};

const showMessage = (container, message, type = 'success') => {
  if (!container) return;
  container.textContent = message;
  container.className = `form-message ${type}`;
  container.style.display = 'block';
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    cart.push({ slug, size, quantity: Number(quantity), title: product.title, price: product.price });
  }

  setCart(cart);
  updateCartCount();
};

const renderProductPage = () => {
  const productPage = document.querySelector('.product-page');
  if (!productPage) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const product = getProductBySlug(slug);

  const productImage = document.getElementById('product-image');
  const productTitle = document.getElementById('product-title');
  const productPrice = document.getElementById('product-price');
  const productDescription = document.getElementById('product-description');
  const productSize = document.getElementById('product-size');
  const addToCartForm = document.getElementById('product-form');
  const productMessage = document.getElementById('product-message');

  if (!product) {
    productPage.innerHTML = '<div class="empty-state"><h3>Product not found</h3><p>Please return to the shop and select an item.</p><a class="btn btn-primary" href="index.html#products">Back to shop</a></div>';
    return;
  }

  if (productImage) productImage.src = product.image;
  if (productTitle) productTitle.textContent = product.title;
  if (productPrice) productPrice.textContent = `R${product.price}`;
  if (productDescription) productDescription.textContent = product.description;

  if (productSize) {
    productSize.innerHTML = '<option value="">Select size</option>' + product.sizes.map((size) => `<option value="${size}">${size}</option>`).join('');
  }

  if (addToCartForm) {
    addToCartForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const size = addToCartForm.size.value;
      const quantity = addToCartForm.quantity.value;
      if (!size || !quantity) {
        showMessage(productMessage, 'Select size and quantity before adding to cart.', 'error');
        return;
      }
      addToCart(slug, size, quantity);
      showMessage(productMessage, 'Item added to cart.', 'success');
    });
  }
};

const renderCartPage = () => {
  const cartPage = document.querySelector('.cart-page');
  if (!cartPage) return;

  const cartItems = getCart();
  const cartContainer = document.getElementById('cart-container');
  const cartTotal = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-button');

  if (!cartContainer || !cartTotal || !checkoutButton) return;

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `<div class="empty-state"><h3>Your cart is empty</h3><p>Add items from the shop and they will appear here.</p><a class="btn btn-primary" href="index.html#products">Browse products</a></div>`;
    cartTotal.textContent = 'R0';
    checkoutButton.href = 'index.html';
    checkoutButton.textContent = 'Start shopping';
    return;
  }

  const rows = cartItems.map((item, index) => {
    const subtotal = item.price * item.quantity;
    return `
      <tr>
        <td><strong>${item.title}</strong><br><small>${item.size}</small></td>
        <td>${item.quantity}</td>
        <td>R${subtotal}</td>
        <td><button type="button" data-index="${index}" class="remove-cart-item">Remove</button></td>
      </tr>
    `;
  }).join('');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartContainer.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr><th>Product</th><th>Qty</th><th>Subtotal</th><th></th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  cartTotal.textContent = `R${total}`;
  checkoutButton.href = 'order.html';
  checkoutButton.textContent = 'Proceed to order';

  cartContainer.querySelectorAll('.remove-cart-item').forEach((button) => {
    button.addEventListener('click', () => {
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
  const orderPage = document.querySelector('.order-page');
  if (!orderPage) return;

  const cartItems = getCart();
  const cartSummary = document.getElementById('cart-summary');
  if (!cartSummary) return;

  if (cartItems.length === 0) {
    cartSummary.innerHTML = '<p class="form-message error">Your cart is empty. Add products before placing an order.</p>';
    return;
  }

  cartSummary.innerHTML = cartItems.map((item) => `
    <div class="order-summary">
      <p><strong>${item.title}</strong> — ${item.size} x ${item.quantity}</p>
    </div>
  `).join('');
};

const renderOrderSummary = () => {
  const summaryContainer = document.getElementById('order-summary');
  if (!summaryContainer) return;

  const orderData = localStorage.getItem(ORDER_KEY);
  if (!orderData) {
    summaryContainer.innerHTML = '<p class="form-message error">No order details found. Please place an order first.</p>';
    return;
  }

  const order = JSON.parse(orderData);
  summaryContainer.innerHTML = `
    <h3>Order summary</h3>
    <p><strong>Product:</strong> ${order.product}</p>
    <p><strong>Size:</strong> ${order.size}</p>
    <p><strong>Quantity:</strong> ${order.quantity}</p>
    <p><strong>Name:</strong> ${order.fullName}</p>
    <p><strong>Phone:</strong> ${order.phone}</p>
    <p><strong>Address:</strong> ${order.address}</p>
  `;
};

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const loginMessage = document.getElementById('login-message');
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      if (!email || !password) {
        showMessage(loginMessage, 'Please enter both email and password.', 'error');
        return;
      }
      showMessage(loginMessage, 'Welcome back! You can now place your order.', 'success');
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    const signupMessage = document.getElementById('signup-message');
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = signupForm.name.value.trim();
      const email = signupForm.email.value.trim();
      const password = signupForm.password.value.trim();
      const confirmPassword = signupForm.confirmPassword.value.trim();

      if (!name || !email || !password || !confirmPassword) {
        showMessage(signupMessage, 'Please complete all fields.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showMessage(signupMessage, 'Passwords must match.', 'error');
        return;
      }

      showMessage(signupMessage, 'Account created successfully. You can now log in.', 'success');
      signupForm.reset();
    });
  }

  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    const orderMessage = document.getElementById('order-message');
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const product = orderForm.product.value;
      const size = orderForm.size.value;
      const quantity = orderForm.quantity.value;
      const fullName = orderForm.fullName.value.trim();
      const phone = orderForm.phone.value.trim();
      const address = orderForm.address.value.trim();

      if (!product || !size || !quantity || !fullName || !phone || !address) {
        showMessage(orderMessage, 'Please complete every field to proceed.', 'error');
        return;
      }

      const orderData = {
        product,
        size,
        quantity,
        fullName,
        phone,
        address,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(ORDER_KEY, JSON.stringify(orderData));
      showMessage(orderMessage, 'Order saved. Redirecting to payment page...', 'success');
      setTimeout(() => {
        window.location.href = 'payment.html';
      }, 1200);
    });
  }

  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    const paymentMessage = document.getElementById('payment-message');
    paymentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const proofFile = paymentForm.proof.files[0];
      const paymentMethod = paymentForm.paymentMethod.value;

      if (!paymentMethod) {
        showMessage(paymentMessage, 'Please choose a payment method.', 'error');
        return;
      }

      if (!proofFile) {
        showMessage(paymentMessage, 'Please upload proof of payment before submitting.', 'error');
        return;
      }

      showMessage(paymentMessage, 'Payment proof received. Thank you for your order!', 'success');
      paymentForm.reset();
      localStorage.removeItem(ORDER_KEY);
    });
  }

  renderProductPage();
  renderCartPage();
  renderOrderFormFromCart();
  renderOrderSummary();
  updateCartCount();
});
