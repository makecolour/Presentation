// AngularJS Demo JavaScript
const API_BASE = window.API_BASE_URL || 'https://localhost:7147/api';

// Create AngularJS module
const app = angular.module('productApp', []);

// Create controller
app.controller('ProductController', function($scope, $http) {
  // Initialize scope variables
  $scope.products = [];
  $scope.loading = false;
  $scope.error = false;
  $scope.success = false;
  $scope.errorMessage = '';
  $scope.successMessage = '';
  $scope.selectedProductId = '';
  $scope.searchText = '';
  
  // Helper functions
  function showLoading() {
    $scope.loading = true;
    $scope.error = false;
    $scope.success = false;
  }
  
  function hideLoading() {
    $scope.loading = false;
  }
  
  function showError(message) {
    $scope.error = true;
    $scope.errorMessage = message;
    $scope.success = false;
    hideLoading();
    console.error('AngularJS Error:', message);
  }
  
  function showSuccess(message) {
    $scope.success = true;
    $scope.successMessage = message;
    $scope.error = false;
    hideLoading();
    console.log('AngularJS Success:', message);
  }
  
  // Get all products
  $scope.getAllProducts = function() {
    showLoading();
    
    $http.get(`${API_BASE}/Products`)
      .then(function(response) {
        console.log('$http GET success:', response.data);
        $scope.products = response.data;
        $scope.results = JSON.stringify(response.data, null, 2);
        showSuccess(`Successfully fetched ${response.data.length} products using AngularJS $http`);
      })
      .catch(function(error) {
        console.error('$http GET error:', error);
        $scope.results = `Error: ${error.statusText || error.message}`;
        showError(`Failed to fetch products: ${error.statusText || error.message}`);
      });
  };
  
  // Get categories
  $scope.getCategories = function() {
    showLoading();
    
    $http({
      method: 'GET',
      url: `${API_BASE}/Products/categories`
    }).then(function(response) {
      console.log('Categories:', response.data);
      
      // Convert to products-like format for display
      $scope.products = response.data.map(function(category) {
        return {
          Name: category,
          Description: 'Product Category',
          Category: 'System',
          Price: 0,
          StockQuantity: 0
        };
      });
      
      $scope.results = JSON.stringify(response.data, null, 2);
      showSuccess(`Found ${response.data.length} categories`);
    }).catch(function(error) {
      $scope.results = `Error: ${error.statusText || error.message}`;
      showError(`Failed to fetch categories: ${error.statusText || error.message}`);
    });
  };
  
  // Get one product
  $scope.getOneProduct = function() {
    if (!$scope.selectedProductId) {
      showError('Please enter a product ID');
      $scope.results = '';
      return;
    }
    
    showLoading();
    
    $http.get(`${API_BASE}/Products/${$scope.selectedProductId}`)
      .then(function(response) {
        console.log('Product fetched:', response.data);
        $scope.products = [response.data];
        $scope.results = JSON.stringify(response.data, null, 2);
        showSuccess(`Successfully fetched product #${$scope.selectedProductId}`);
      })
      .catch(function(error) {
        if (error.status === 404) {
          $scope.results = 'Product not found';
          showError('Product not found');
        } else {
          $scope.results = `Error: ${error.statusText || error.message}`;
          showError(`Failed to fetch product: ${error.statusText || error.message}`);
        }
      });
  };
  
  // Configure $http defaults
  $http.defaults.headers.common['Content-Type'] = 'application/json';
  
  // HTTP interceptor for logging
  app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function($q) {
      return {
        request: function(config) {
          console.log('AngularJS Request:', config.method, config.url);
          return config;
        },
        response: function(response) {
          console.log('AngularJS Response:', response.status, response.config.url);
          return response;
        },
        responseError: function(rejection) {
          console.error('AngularJS Response Error:', rejection.status, rejection.config.url);
          return $q.reject(rejection);
        }
      };
    });
  }]);
  
  console.log('AngularJS ProductController initialized');
});

console.log('AngularJS demo loaded - Module and controller registered!');
