using Client.Models;
using System.Text.Json;

namespace Client.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ApiService> _logger;
        private readonly string _baseUrl;

        public ApiService(HttpClient httpClient, IConfiguration configuration, ILogger<ApiService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _baseUrl = configuration["ApiSettings:BaseUrl"] ?? "https://localhost:7147/api";
            
            // Configure HttpClient
            _httpClient.BaseAddress = new Uri(_baseUrl);
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(
                new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        /// <summary>
        /// Get all products from the API
        /// </summary>
        public async Task<List<Product>> GetProductsAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/Products");
                response.EnsureSuccessStatusCode();

                var jsonString = await response.Content.ReadAsStringAsync();
                var products = JsonSerializer.Deserialize<List<Product>>(jsonString, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return products ?? new List<Product>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching products from API");
                return new List<Product>();
            }
        }

        /// <summary>
        /// Get a single product by ID
        /// </summary>
        public async Task<Product?> GetProductByIdAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/Products/{id}");
                response.EnsureSuccessStatusCode();

                var jsonString = await response.Content.ReadAsStringAsync();
                var product = JsonSerializer.Deserialize<Product>(jsonString, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching product {Id} from API", id);
                return null;
            }
        }

        /// <summary>
        /// Get product categories
        /// </summary>
        public async Task<List<string>> GetCategoriesAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/Products/categories");
                response.EnsureSuccessStatusCode();

                var jsonString = await response.Content.ReadAsStringAsync();
                var categories = JsonSerializer.Deserialize<List<string>>(jsonString, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return categories ?? new List<string>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching categories from API");
                return new List<string>();
            }
        }
    }
}
