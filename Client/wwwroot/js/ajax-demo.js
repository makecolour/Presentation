// jQuery AJAX Demo JavaScript
const API_BASE = window.API_BASE_URL || 'https://localhost:7147/api';

// Helper functions
function showAjaxLoading() {
  $('#ajaxLoading').removeClass('hidden');
  $('#ajaxError').addClass('hidden');
  $('#ajaxSuccess').addClass('hidden');
}

function hideAjaxLoading() {
  $('#ajaxLoading').addClass('hidden');
}

function showAjaxError(message) {
  $('#ajaxError').text(message).removeClass('hidden');
  hideAjaxLoading();
  console.error('AJAX Error:', message);
}

function showAjaxSuccess(message) {
  $('#ajaxSuccess').text(message).removeClass('hidden');
  hideAjaxLoading();
  console.log('AJAX Success:', message);
}

function displayAjaxResults(data) {
  $('#ajaxResults').text(JSON.stringify(data, null, 2));
}

function displayAjaxProductCards(products) {
  if (!Array.isArray(products) || products.length === 0) {
    $('#ajaxProductsContainer').addClass('hidden');
    return;
  }
  
  $('#ajaxProductCount').text(products.length);
  const html = products.map(product => `
    <div class="breeze-card border rounded-lg p-4">
      <h4 class="font-semibold text-lg">${product.Name || product.name}</h4>
      <p class="text-gray-600 text-sm">${product.Description || product.description || 'No description'}</p>
      <p class="text-indigo-600 font-bold mt-2">$${product.Price || product.price}</p>
      <p class="text-gray-500 text-sm">Stock: ${product.StockQuantity || product.stockQuantity}</p>
      <span class="inline-block mt-2 px-2 py-1 text-xs rounded bg-gray-200">${product.Category || product.category || 'N/A'}</span>
    </div>
  `).join('');
  
  $('#ajaxProductsGrid').html(html);
  $('#ajaxProductsContainer').removeClass('hidden');
}

// Get all products using $.ajax()
$('#ajaxGetAll').on('click', function() {
  showAjaxLoading();
  
  $.ajax({
    url: `${API_BASE}/Products`,
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      console.log('$.ajax() success:', data);
      displayAjaxResults(data);
      displayAjaxProductCards(data);
      showAjaxSuccess(`Successfully fetched ${data.length} products using $.ajax()`);
    },
    error: function(xhr, status, error) {
      console.error('$.ajax() error:', status, error);
      showAjaxError(`Failed to fetch products: ${error}`);
    }
  });
});

// Get all products using $.getJSON()
$('#ajaxGetJSON').on('click', function() {
  showAjaxLoading();
  
  $.getJSON(`${API_BASE}/Products`)
    .done(function(data) {
      console.log('$.getJSON() success:', data);
      displayAjaxResults(data);
      displayAjaxProductCards(data);
      showAjaxSuccess(`Successfully fetched ${data.length} products using $.getJSON()`);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.error('$.getJSON() error:', textStatus, errorThrown);
      showAjaxError(`Failed to fetch products: ${errorThrown}`);
    });
});

// Get one product using $.get()
$('#ajaxGetOne').on('click', function() {
  const productId = $('#ajaxProductId').val();
  
  if (!productId) {
    showAjaxError('Please enter a product ID');
    return;
  }
  
  showAjaxLoading();
  
  $.get(`${API_BASE}/Products/${productId}`)
    .done(function(data) {
      console.log('$.get() success:', data);
      displayAjaxResults([data]);
      showAjaxSuccess(`Successfully fetched product #${productId} using $.get()`);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.error('$.get() error:', textStatus, errorThrown);
      if (jqXHR.status === 404) {
        showAjaxError('Product not found');
      } else {
        showAjaxError(`Failed to fetch product: ${errorThrown}`);
      }
    });
});

// Get categories
$('#ajaxGetCategories').on('click', function() {
  showAjaxLoading();
  
  $.ajax({
    url: `${API_BASE}/Products/categories`,
    method: 'GET',
    dataType: 'json',
    success: function(categories) {
      console.log('Categories:', categories);
      
      const html = `
        <div class="bg-white border rounded-lg p-4">
          <h3 class="font-bold mb-2">Available Categories:</h3>
          <div class="flex flex-wrap gap-2">
            ${categories.map(cat => `
              <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">${cat}</span>
            `).join('')}
          </div>
        </div>
      `;
      
      $('#ajaxResults').html(html);
      showAjaxSuccess(`Found ${categories.length} categories`);
    },
    error: function(xhr, status, error) {
      showAjaxError(`Failed to fetch categories: ${error}`);
    }
  });
});

// Setup global AJAX handlers for better debugging
$(document).ajaxStart(function() {
  console.log('AJAX request started');
});

$(document).ajaxStop(function() {
  console.log('All AJAX requests completed');
});

$(document).ajaxError(function(event, jqXHR, settings, thrownError) {
  console.error('AJAX Error Event:', {
    url: settings.url,
    status: jqXHR.status,
    error: thrownError
  });
});

console.log('jQuery AJAX demo loaded - Global handlers configured!');
