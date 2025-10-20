// Axios Demo JavaScript
const API_BASE = window.API_BASE_URL || 'https://localhost:7147/api';

// Configure Axios defaults
axios.defaults.baseURL = API_BASE;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Helper functions
function showAxiosLoading() {
  document.getElementById('axiosLoading').classList.remove('hidden');
  document.getElementById('axiosError').classList.add('hidden');
  document.getElementById('axiosSuccess').classList.add('hidden');
}

function hideAxiosLoading() {
  document.getElementById('axiosLoading').classList.add('hidden');
}

function showAxiosError(message) {
  const errorDiv = document.getElementById('axiosError');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  hideAxiosLoading();
  console.error('Axios Error:', message);
}

function showAxiosSuccess(message) {
  const successDiv = document.getElementById('axiosSuccess');
  successDiv.textContent = message;
  successDiv.classList.remove('hidden');
  hideAxiosLoading();
  console.log('Axios Success:', message);
}

function displayAxiosResults(data) {
  const container = document.getElementById('axiosResults');
  container.textContent = JSON.stringify(data, null, 2);
}

function displayAxiosProductCards(products) {
  const productsContainer = document.getElementById('axiosProductsContainer');
  const productsGrid = document.getElementById('axiosProductsGrid');
  const productCount = document.getElementById('axiosProductCount');
  
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

// Axios request interceptor (for logging)
axios.interceptors.request.use(
  config => {
    console.log('Axios Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Axios response interceptor (for logging and error handling)
axios.interceptors.response.use(
  response => {
    console.log('Axios Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('Axios Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Get all products
document.getElementById('axiosGetAll').addEventListener('click', async () => {
  showAxiosLoading();
  try {
    const response = await axios.get('/Products');
    displayAxiosResults(response.data);
    displayAxiosProductCards(response.data);
    showAxiosSuccess(`Successfully fetched ${response.data.length} products using Axios`);
  } catch (error) {
    showAxiosError(`Failed to fetch products: ${error.message}`);
  }
});

// Get categories
document.getElementById('axiosGetCategories').addEventListener('click', async () => {
  showAxiosLoading();
  try {
    const response = await axios.get('/Products/categories');
    const categories = response.data;
    
    const container = document.getElementById('axiosResults');
    container.innerHTML = `
      <div class="bg-white border rounded-lg p-4">
        <h3 class="font-bold mb-2">Available Categories:</h3>
        <div class="flex flex-wrap gap-2">
          ${categories.map(cat => `
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${cat}</span>
          `).join('')}
        </div>
      </div>
    `;
    showAxiosSuccess(`Found ${categories.length} categories`);
  } catch (error) {
    showAxiosError(`Failed to fetch categories: ${error.message}`);
  }
});

// Get one product
document.getElementById('axiosGetOne').addEventListener('click', async () => {
  const productId = document.getElementById('axiosProductId').value;
  
  if (!productId) {
    showAxiosError('Please enter a product ID');
    return;
  }
  
  showAxiosLoading();
  try {
    const response = await axios.get(`/Products/${productId}`);
    displayAxiosResults([response.data]);
    showAxiosSuccess(`Successfully fetched product #${productId}`);
  } catch (error) {
    if (error.response?.status === 404) {
      showAxiosError('Product not found');
    } else {
      showAxiosError(`Failed to fetch product: ${error.message}`);
    }
  }
});

// Filter products
document.getElementById('axiosFilter').addEventListener('click', async () => {
  showAxiosLoading();
  try {
    const category = document.getElementById('categoryFilter').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    
    // Build query parameters
    const params = {};
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    
    console.log('Filter params:', params);
    
    const response = await axios.get('/Products', { params });
    displayAxiosResults(response.data);
    
    const filterDesc = [];
    if (category) filterDesc.push(`Category: ${category}`);
    if (minPrice) filterDesc.push(`Min: $${minPrice}`);
    if (maxPrice) filterDesc.push(`Max: $${maxPrice}`);
    
    showAxiosSuccess(
      `Found ${response.data.length} products` + 
      (filterDesc.length ? ` (${filterDesc.join(', ')})` : '')
    );
  } catch (error) {
    showAxiosError(`Failed to filter products: ${error.message}`);
  }
});

console.log('Axios demo loaded - Interceptors configured!');
