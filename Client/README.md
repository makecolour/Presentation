# Client (ASP.NET MVC) - Product Catalog

This is an ASP.NET Core MVC client application that consumes the Server Web API to display products.

## 🎯 Purpose

Demonstrates:
- ✅ Server-side API calls using HttpClient
- ✅ ASP.NET MVC pattern with Razor views
- ✅ Dependency Injection for services
- ✅ Bootstrap 5 + Font Awesome styling
- ✅ Product listing and detail pages

## 🏗️ Project Structure

```
Client/
├── Controllers/
│   └── HomeController.cs       # MVC Controllers
├── Models/
│   ├── Product.cs              # Product model
│   └── ErrorViewModel.cs       # Error handling
├── Services/
│   └── ApiService.cs           # HttpClient wrapper for API calls
├── Views/
│   ├── Home/
│   │   ├── Index.cshtml        # Product listing page
│   │   ├── Details.cshtml      # Product detail page
│   │   └── Privacy.cshtml      # Privacy page
│   └── Shared/
│       └── _Layout.cshtml      # Main layout with navigation
├── wwwroot/                    # Static files (CSS, JS, images)
├── appsettings.json            # Configuration (includes API URL)
└── Program.cs                  # Application startup
```

## 🚀 How to Run

### Prerequisites
- .NET 8 SDK
- Server project must be running on https://localhost:7147

### Steps

1. **Ensure Server is running:**
   ```cmd
   cd ..\Server
   dotnet run
   ```

2. **Run the Client:**
   ```cmd
   cd Client
   dotnet run
   ```

3. **Open browser:**
   - Navigate to: https://localhost:5000
   - Or: http://localhost:5000

### Run from Visual Studio

1. Open `Presentation.sln`
2. Right-click **Client** project → Debug → Start New Instance
3. Or set multiple startup projects (Server + Client)

## 🔧 Configuration

### appsettings.json

```json
{
  "ApiSettings": {
    "BaseUrl": "https://localhost:7147/api"
  }
}
```

Change the `BaseUrl` if your Server runs on a different port.

## 📋 Features

### 1. Product Listing (Home Page)
- Displays all products from API
- Shows product image, name, description, price
- Category badges
- Stock availability status
- "View Details" button for each product

### 2. Product Details
- Full product information
- Large product image
- Stock quantity
- Created date
- Breadcrumb navigation
- Back to products button

### 3. Server-Side Rendering
- All API calls happen on the server (C#)
- HTML is fully rendered before sending to browser
- No JavaScript API calls needed
- Good for SEO

## 🔌 API Integration

### ApiService.cs

The `ApiService` class wraps HttpClient functionality:

```csharp
public class ApiService
{
    private readonly HttpClient _httpClient;
    
    public async Task<List<Product>> GetProductsAsync()
    {
        var response = await _httpClient.GetAsync("/Products");
        response.EnsureSuccessStatusCode();
        
        var jsonString = await response.Content.ReadAsStringAsync();
        var products = JsonSerializer.Deserialize<List<Product>>(jsonString);
        
        return products ?? new List<Product>();
    }
}
```

### Dependency Injection

Registered in `Program.cs`:

```csharp
builder.Services.AddHttpClient<ApiService>();
```

Used in controllers:

```csharp
public class HomeController : Controller
{
    private readonly ApiService _apiService;
    
    public HomeController(ApiService apiService)
    {
        _apiService = apiService;
    }
    
    public async Task<IActionResult> Index()
    {
        var products = await _apiService.GetProductsAsync();
        return View(products);
    }
}
```

## 🎨 Styling

- **Bootstrap 5** - Responsive grid, cards, buttons
- **Font Awesome 6** - Icons for navigation and features
- **Custom CSS** - Additional styling in `wwwroot/css/site.css`

## 🔄 How It Works

```
User Browser
    ↓
ASP.NET MVC Controller
    ↓
ApiService (HttpClient)
    ↓
Server Web API (localhost:7147)
    ↓
Database
    ↓
JSON Response → Controller
    ↓
Razor View (HTML)
    ↓
User Browser (receives HTML)
```

## 🆚 Comparison with Client_2

| Feature | Client (ASP.NET MVC) | Client_2 (Node.js) |
|---------|---------------------|-------------------|
| **Language** | C# | JavaScript |
| **Framework** | ASP.NET Core MVC | Express.js |
| **Template Engine** | Razor | EJS |
| **API Calls** | Server-side (HttpClient) | Client-side (Fetch/Axios) |
| **Rendering** | Server-side | Client-side |
| **Port** | 5000 | 3001 |
| **Best For** | .NET developers, SEO | JavaScript developers, SPAs |

## 📚 Learning Outcomes

Students will learn:
1. ✅ How to consume REST APIs in ASP.NET MVC
2. ✅ HttpClient usage and configuration
3. ✅ Async/await in C#
4. ✅ JSON deserialization with System.Text.Json
5. ✅ Dependency Injection in ASP.NET Core
6. ✅ MVC pattern (Model-View-Controller)
7. ✅ Razor view syntax
8. ✅ Server-side vs client-side rendering

## 🐛 Troubleshooting

### "Unable to connect to the API"

**Check:**
1. Is Server running? (Should be at https://localhost:7147)
2. Check `appsettings.json` - Is the API URL correct?
3. CORS enabled in Server? (Should allow localhost:5000)

### "Products not showing"

**Check:**
1. Open browser DevTools → Console for errors
2. Check Server database has products (run Server first to seed data)
3. Check API directly: https://localhost:7147/api/Products

### "Port 5000 already in use"

**Solution:**
```cmd
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or change port in `Properties/launchSettings.json`:
```json
{
  "applicationUrl": "https://localhost:5001;http://localhost:5002"
}
```

## 🎓 Teaching Tips

1. **Show the difference** between server-side and client-side API calls
2. **Emphasize** that no JavaScript is needed for API calls here
3. **Demonstrate** type safety with C# models
4. **Compare** with Client_2 to show both approaches
5. **Explain** when to use each approach (SEO, security, performance)

## 📖 Additional Resources

- [ASP.NET Core MVC Documentation](https://learn.microsoft.com/en-us/aspnet/core/mvc/)
- [HttpClient Documentation](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpclient)
- [Razor Syntax Reference](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/razor)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)

---

**Made for PRN232 - FPT University**
