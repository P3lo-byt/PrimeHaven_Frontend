const BACKEND_URL = "https://primehaven-backend.onrender.com";

document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.getElementById("cart-container");
  console.log("🧪 cartContainer:", cartContainer);

  const rawCart = localStorage.getItem("cart");
  console.log("🧾 localStorage cart raw:", rawCart);

  let cart = [];
  try {
    cart = JSON.parse(rawCart) || [];
  } catch (e) {
    console.error("🚫 Failed to parse cart:", e);
  }

  console.log("🛒 Parsed cart:", cart);

  if (!cartContainer) {
    console.warn("⚠️ cart-container not found in DOM");
    return;
  }

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  fetch(`${BACKEND_URL}/api/products`)
    .then(res => {
      console.log("🌐 Fetching products...");
      return res.json();
    })
    .then(products => {
      console.log("📦 Products from backend:", products);

      let total = 0;
      cartContainer.innerHTML = "";

      cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) {
          console.warn(`⚠️ Product with ID ${item.id} not found.`);
          return;
        }

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
    })
    .catch(err => {
      console.error("❌ Failed to load cart products:", err);
      cartContainer.innerHTML = "<p>Could not load cart items.</p>";
    });
});

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
