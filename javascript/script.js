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
  if (!container) return;

  fetch(`${BACKEND_URL}/api/products`)
    .then(res => res.json())
    .then(products => {
      renderProducts(products);
    })
    .catch(error => {
      console.error("Failed to load products:", error);
      container.innerHTML = "<p>Could not load product data.</p>";
    });

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
});

// Cart and Checkout Utilities
function checkout() {
  alert("Proceeding to checkout...");
  window.location.href = "checkout.html";
}

function clearCart() {
  localStorage.removeItem("cart");
  location.reload();
}


// Handle Browse Treats Button
document.addEventListener("DOMContentLoaded", function () {
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
});


// Category Filtering
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("product-container");
  const tabs = document.querySelectorAll(".tabs button");

  if (tabs.length > 0) {
    fetch(`${BACKEND_URL}/api/products`)
      .then(res => res.json())
      .then(products => {
        renderProducts(products);

        tabs.forEach(btn => {
          btn.addEventListener("click", () => {
            const category = btn.dataset.category;
            const filtered = category === "all" ? products : products.filter(p => p.category === category);
            renderProducts(filtered);
          });
        });
      });
  }

  function renderProducts(productList) {
    if (!container) return;
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
});
