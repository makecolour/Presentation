using Client.Models;
using Client.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Client.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApiService _apiService;
        private readonly IConfiguration _configuration;

        public HomeController(ILogger<HomeController> logger, ApiService apiService, IConfiguration configuration)
        {
            _logger = logger;
            _apiService = apiService;
            _configuration = configuration;
        }

        private string ApiBaseUrl => _configuration["ApiSettings:BaseUrl"] ?? "https://localhost:7147/api";

        public IActionResult Index()
        {
            ViewBag.ApiBaseUrl = ApiBaseUrl;
            ViewBag.Page = "home";
            return View();
        }

        public IActionResult FetchDemo()
        {
            ViewBag.ApiBaseUrl = ApiBaseUrl;
            ViewBag.Page = "fetch";
            return View();
        }

        public IActionResult AxiosDemo()
        {
            ViewBag.ApiBaseUrl = ApiBaseUrl;
            ViewBag.Page = "axios";
            return View();
        }

        public IActionResult AjaxDemo()
        {
            ViewBag.ApiBaseUrl = ApiBaseUrl;
            ViewBag.Page = "ajax";
            return View();
        }

        public IActionResult AngularDemo()
        {
            ViewBag.ApiBaseUrl = ApiBaseUrl;
            ViewBag.Page = "angular";
            return View();
        }

        public IActionResult AuthDemo()
        {
            ViewBag.ApiBaseUrl = ApiBaseUrl;
            ViewBag.Page = "auth";
            return View();
        }

        public async Task<IActionResult> BackendCallDemo(string? action, int? productId)
        {
            ViewBag.ApiBaseUrl = ApiBaseUrl;
            ViewBag.Page = "backend";
            ViewBag.Action = action;
            
            object? results = null;
            string? error = null;
            string? successMessage = null;
            List<Product> products = new();

            if (!string.IsNullOrEmpty(action))
            {
                try
                {
                    var sw = Stopwatch.StartNew();
                    
                    switch (action)
                    {
                        case "get-all-products":
                            products = await _apiService.GetProductsAsync();
                            results = products;
                            sw.Stop();
                            successMessage = $"Successfully fetched {products.Count} products via backend ({sw.ElapsedMilliseconds}ms)";
                            break;
                            
                        case "get-categories":
                            var categories = await _apiService.GetCategoriesAsync();
                            results = categories;
                            sw.Stop();
                            successMessage = $"Successfully fetched {categories.Count} categories via backend ({sw.ElapsedMilliseconds}ms)";
                            break;
                            
                        case "get-one-product":
                            if (productId.HasValue)
                            {
                                var product = await _apiService.GetProductByIdAsync(productId.Value);
                                if (product != null)
                                {
                                    results = product;
                                    products = new List<Product> { product };
                                    sw.Stop();
                                    successMessage = $"Successfully fetched product #{productId} via backend ({sw.ElapsedMilliseconds}ms)";
                                }
                                else
                                {
                                    error = $"Product #{productId} not found";
                                }
                            }
                            else
                            {
                                error = "Please provide a product ID";
                            }
                            break;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in backend call");
                    error = $"Failed to call API: {ex.Message}";
                }
            }

            ViewBag.Results = results;
            ViewBag.Error = error;
            ViewBag.SuccessMessage = successMessage;
            ViewBag.Products = products;

            return View();
        }

        public IActionResult Privacy()
        {
            ViewBag.ApiBaseUrl = ApiBaseUrl;
            ViewBag.Page = "privacy";
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
