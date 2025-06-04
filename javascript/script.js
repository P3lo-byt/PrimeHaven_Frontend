const BACKEND_URL = "https://primehaven-backend.onrender.com";

// Add to Cart Function
function addToCart(id) {
  fetch(`${BACKEND_URL}/api/products`)
    .then(res => res.json())
    .then(data => {
      const product = data.find(p => p.id === id);
      if (!product) return alert("Product not found");

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} added to cart`);
    })
    .catch(err => {
      console.error("Error adding to cart:", err);
      alert("Could not add to cart.");
    });
}

// DOMContentLoaded logic
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("product-container");

  // Render products page
  if (container) {
    fetch(`${BACKEND_URL}/api/products`)
      .then(res => res.json())
      .then(products => {
        renderProducts(products);
        setupFiltering(products);
      })
      .catch(error => {
        console.error("Failed to load products:", error);
        container.innerHTML = "<p>Could not load product data.</p>";
      });
  }

  // Handle cart display on cart.html
  const cartContainer = document.getElementById("cart-container");
  if (cartContainer) {
    fetch(`${BACKEND_URL}/api/products`)
      .then(res => res.json())
      .then(products => showCart(products))
      .catch(err => {
        console.error("Failed to load cart:", err);
        cartContainer.innerHTML = "<p>Could not load cart items.</p>";
      });
  }

  const browseBtn = document.getElementById("browseTreatsBtn");
  if (browseBtn) {
    browseBtn.addEventListener("click", function () {
      fetch(`${BACKEND_URL}/api/products`)
        .then(response => response.json())
        .then(data => {
          localStorage.setItem("productsData", JSON.stringify(data));
          window.location.href = "products.html";
        })
        .catch(error => {
          console.error("Failed to fetch products:", error);
          alert("Could not load products. Please try again later.");
        });
    });
  }

  function renderProducts(productList) {
    container.innerHTML = "";
    productList.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>R${product.price.toFixed(2)}</strong></p>
        <button onclick="addToCart('${product.id}')">Add to Cart</button>
      `;
      container.appendChild(card);
    });
  }

  function setupFiltering(products) {
    const tabs = document.querySelectorAll(".tabs button");
    tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        const filtered = category === "all" ? products : products.filter(p => p.category === category);
        renderProducts(filtered);
      });
    });
  }

  function showCart(products) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    let total = 0;

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      const subtotal = product.price * item.quantity;
      total += subtotal;

      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: R${product.price.toFixed(2)}</p>
        <label>
          Quantity:
          <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity('${item.id}', this.value)">
        </label>
        <p>Subtotal: R${subtotal.toFixed(2)}</p>
        <hr>
      `;
      cartContainer.appendChild(div);
    });

    const summary = document.createElement("div");
    summary.innerHTML = `<h2>Total: R${total.toFixed(2)}</h2>`;
    cartContainer.appendChild(summary);
  }
});

// Quantity Update + Utilities
function updateQuantity(id, qty) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = parseInt(qty);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
  }
}

function clearCart() {
  localStorage.removeItem("cart");
  location.reload();
}

function checkout() {
  window.location.href = "checkout.html";
}
