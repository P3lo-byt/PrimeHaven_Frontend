function displayCart() {
  const cartContainer = document.getElementById('cart-container');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  // Build HTML table for cart items
  let html = `
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Price (R)</th>
          <th>Quantity</th>
          <th>Total (R)</th>
        </tr>
      </thead>
      <tbody>
  `;

  let grandTotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    grandTotal += itemTotal;
    html += `
      <tr>
        <td>${item.name}</td>
        <td>${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>${itemTotal.toFixed(2)}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <h3>Grand Total: R${grandTotal.toFixed(2)}</h3>
  `;

  cartContainer.innerHTML = html;
}

// Run on page load
window.onload = displayCart;