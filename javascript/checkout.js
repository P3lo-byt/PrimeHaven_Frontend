function submitOrder() {
  // Hide checkout form and show success message
  document.getElementById("checkout-form").style.display = "none";
  document.getElementById("order-success").style.display = "block";

  // Clear the cart
  document.getElementById("cart-items").innerHTML = '';
  document.getElementById("total-price").textContent = '0.00';
  localStorage.removeItem("cart");

  return false; // Prevent form from reloading the page
}