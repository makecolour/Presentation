// Fetch API Demo JavaScript
const API_BASE = window.API_BASE_URL || 'https://localhost:7147/api';

// Helper functions
function showLoading() {
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('errorMessage').classList.add('hidden');
  document.getElementById('successMessage').classList.add('hidden');
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');
  errorText.textContent = message;
  errorDiv.classList.remove('hidden');
  hideLoading();
  console.error('Error:', message);
}

function showSuccess(message) {
  const successDiv = document.getElementById('successMessage');
  const successText = document.getElementById('successText');
  successText.textContent = message;
  successDiv.classList.remove('hidden');
  hideLoading();
  console.log('Success:', message);
}

function displayResults(data) {
  const container = document.getElementById('resultsContainer');
  container.textContent = JSON.stringify(data, null, 2);
}

function displayProductCards(products) {
  const productsContainer = document.getElementById('productsContainer');
  const productsGrid = document.getElementById('productsGrid');
  const productCount = document.getElementById('productCount');
  
  if (!Array.isArray(products) || products.length === 0) {
    productsContainer.classList.add('hidden');
    return;
  }
  
  productCount.textContent = products.length;
  productsGrid.innerHTML = products.map(product => `
    <div class="breeze-card border rounded-lg p-4">
      <h4 class="font-semibold text-lg">${product.Name || product.name}</h4>
      <p class="text-gray-600 text-sm">${product.Description || product.description || 'No description'}</p>
      <p class="text-indigo-600 font-bold mt-2">$${product.Price || product.price}</p>
      <p class="text-gray-500 text-sm">Stock: ${product.StockQuantity || product.stockQuantity}</p>
      <span class="inline-block mt-2 px-2 py-1 text-xs rounded bg-gray-200">${product.Category || product.category || 'N/A'}</span>
    </div>
  `).join('');
  
  productsContainer.classList.remove('hidden');
}

// Get all products
document.getElementById('fetchAllProducts').addEventListener('click', async () => {
  showLoading();
  try {
    const response = await fetch(`${API_BASE}/Products`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched products:', data);
    
    displayResults(data);
    displayProductCards(data);
    showSuccess(`Successfully fetched ${data.length} products using Fetch API`);
  } catch (error) {
    showError(`Failed to fetch products: ${error.message}`);
  }
});

// Get one product
document.getElementById('fetchOneProduct').addEventListener('click', async () => {
  const productId = document.getElementById('productId').value;
  
  if (!productId) {
    showError('Please enter a product ID');
    return;
  }
  
  showLoading();
  try {
    const response = await fetch(`${API_BASE}/Products/${productId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched product:', data);
    
    displayResults([data]);
    showSuccess(`Successfully fetched product #${productId}`);
  } catch (error) {
    showError(`Failed to fetch product: ${error.message}`);
  }
});

// Create product (requires authentication)
document.getElementById('createProduct').addEventListener('click', async () => {
  const name = document.getElementById('newProductName').value;
  const price = document.getElementById('newProductPrice').value;
  const stock = document.getElementById('newProductStock').value;
  
  if (!name || !price) {
    showError('Please fill in product name and price');
    return;
  }
  
  showLoading();
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      showError('Authentication required! Please login first in the Auth Demo page.');
      return;
    }
    
    const newProduct = {
      Name: name,
      Price: parseFloat(price),
      StockQuantity: parseInt(stock) || 0,
      Category: 'Electronics',
      Description: 'Product created via Fetch API',
      IsAvailable: true
    };
    
    const response = await fetch(`${API_BASE}/Products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newProduct)
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - Token may be invalid or expired');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Created product:', data);
    
    displayResults([data]);
    showSuccess(`Product created successfully! ID: ${data.Id}`);
    
    // Clear form
    document.getElementById('newProductName').value = '';
    document.getElementById('newProductPrice').value = '';
    document.getElementById('newProductStock').value = '';
  } catch (error) {
    showError(`Failed to create product: ${error.message}`);
  }
});

console.log('Fetch demo loaded - Ready to make API calls!');
