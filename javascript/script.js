let allProducts = [];

fetch('data/products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    displayProducts(allProducts);
  })
  .catch(error => {
    console.error('Error loading products:', error);
  });

function displayProducts(products) {
  const container = document.getElementById('product-list');
  container.innerHTML = ''; // Clear previous products
  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.setAttribute('data-category', product.category);
    div.innerHTML = `
      <img src="assets/images/${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p><strong>Category:</strong> ${product.category}</p>
      <p>${product.description}</p>
      <p><strong>Price:</strong> R${product.price}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <button onclick="addToCartById(${product.id})">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

function filterProducts(category) {
  if (category === 'all') {
    displayProducts(allProducts);
  } else {
    const filtered = allProducts.filter(p => p.category === category);
    displayProducts(filtered);
  }
}

function addToCartById(productId) {
  // Use allProducts here, not products
  const product = allProducts.find(p => p.id === productId);
  if (!product) {
    alert('Product not found!');
    return;
  }

  // Get existing cart from localStorage or empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if product already in cart
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  if (existingItemIndex > -1) {
    // Increase quantity if already in cart
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new product with quantity 1
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  // Save updated cart back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  alert(`${product.name} added to cart!`);
}