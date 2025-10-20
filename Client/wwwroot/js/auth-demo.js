// Authentication Demo JavaScript
const API_BASE = window.API_BASE_URL || 'https://localhost:7147/api';

// Helper functions
function showAuthLoading() {
  document.getElementById('authLoading').classList.remove('hidden');
  document.getElementById('authError').classList.add('hidden');
  document.getElementById('authSuccess').classList.add('hidden');
}

function hideAuthLoading() {
  document.getElementById('authLoading').classList.add('hidden');
}

function showAuthError(message) {
  const errorDiv = document.getElementById('authError');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  hideAuthLoading();
  console.error('Auth Error:', message);
}

function showAuthSuccess(message) {
  const successDiv = document.getElementById('authSuccess');
  successDiv.textContent = message;
  successDiv.classList.remove('hidden');
  hideAuthLoading();
  console.log('Auth Success:', message);
}

function displayAuthResults(data) {
  const container = document.getElementById('authResults');
  container.textContent = JSON.stringify(data, null, 2);
}

function displayAuthProductCards(products) {
  const productsContainer = document.getElementById('authProductsContainer');
  const productsGrid = document.getElementById('authProductsGrid');
  const productCount = document.getElementById('authProductCount');
  
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

function updateAuthStatus() {
  const token = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');
  
  if (token && username) {
    document.getElementById('loggedOut').classList.add('hidden');
    document.getElementById('loggedIn').classList.remove('hidden');
    document.getElementById('currentUser').textContent = username;
    document.getElementById('tokenInfo').classList.remove('hidden');
    document.getElementById('tokenDisplay').textContent = token;
  } else {
    document.getElementById('loggedOut').classList.remove('hidden');
    document.getElementById('loggedIn').classList.add('hidden');
    document.getElementById('tokenInfo').classList.add('hidden');
  }
}

// Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  showAuthLoading();
  
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const fullName = document.getElementById('regFullName').value;
  
  try {
    const response = await fetch(`${API_BASE}/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Username: username,
        Email: email,
        Password: password,
        FullName: fullName || null
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    const data = await response.json();
    console.log('Registration successful:', data);
    
    // Store token and username
    localStorage.setItem('authToken', data.Token);
    localStorage.setItem('username', data.Username);
    
    updateAuthStatus();
    showAuthSuccess(`Registration successful! Welcome, ${data.Username}`);
    
    // Clear form
    document.getElementById('registerForm').reset();
  } catch (error) {
    showAuthError(`Registration failed: ${error.message}`);
  }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  showAuthLoading();
  
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch(`${API_BASE}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Username: username,
        Password: password
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    console.log('Login successful:', data);
    
    // Store token and username
    localStorage.setItem('authToken', data.Token);
    localStorage.setItem('username', data.Username);
    
    updateAuthStatus();
    showAuthSuccess(`Login successful! Welcome back, ${data.Username}`);
    
    // Clear form
    document.getElementById('loginForm').reset();
  } catch (error) {
    showAuthError(`Login failed: ${error.message}`);
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('username');
  updateAuthStatus();
  showAuthSuccess('Logged out successfully');
  document.getElementById('authResults').innerHTML = '<p class="text-gray-500">Perform an action to see results...</p>';
});

// Create product with authentication
document.getElementById('createProductAuth').addEventListener('click', async () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    showAuthError('Please login first!');
    return;
  }
  
  showAuthLoading();
  
  const newProduct = {
    Name: 'Authenticated Product',
    Price: 199.99,
    StockQuantity: 15,
    Category: 'Demo',
    Description: 'Product created with JWT authentication'
  };
  
  try {
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
        throw new Error('Unauthorized - Please login again');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }
    
    const data = await response.json();
    console.log('Product created:', data);
    
    displayAuthResults([data]);
    showAuthSuccess(`Product created successfully! ID: ${data.Id}`);
  } catch (error) {
    showAuthError(`Failed to create product: ${error.message}`);
  }
});

// Get products with auth header
document.getElementById('getProductsAuth').addEventListener('click', async () => {
  const token = localStorage.getItem('authToken');
  
  showAuthLoading();
  
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}/Products`, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Products fetched with auth:', data);
    
    displayAuthResults(data);
    displayAuthProductCards(data);
    showAuthSuccess(
      `Fetched ${data.length} products ` + 
      (token ? 'with authentication header' : 'without authentication')
    );
  } catch (error) {
    showAuthError(`Failed to fetch products: ${error.message}`);
  }
});

// Initialize auth status on page load
updateAuthStatus();
console.log('Auth demo loaded - JWT authentication ready!');
