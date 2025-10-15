# 🖥️ PRN232 Server - ASP.NET Core Web API

> RESTful Web API built with ASP.NET Core 8.0, featuring JWT authentication, Entity Framework Core, and comprehensive CORS configuration for cross-origin requests.

---

## 📚 What's This API?

A production-ready ASP.NET Core Web API demonstrating:

- ✅ **RESTful Architecture** - Standard HTTP methods and status codes
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Entity Framework Core** - Code-first database with migrations
- ✅ **CORS Configuration** - Cross-origin resource sharing for JavaScript clients
- ✅ **Swagger/OpenAPI** - Interactive API documentation
- ✅ **Middleware Pipeline** - Request/response processing
- ✅ **Dependency Injection** - Service-based architecture

### 🎯 Learning Objectives

By exploring this API, you'll understand:

✅ **Web API Development**
- RESTful API design principles
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes (200, 201, 400, 401, 404, 500)
- Content negotiation (JSON)

✅ **Authentication & Authorization**
- JWT (JSON Web Token) generation and validation
- Token-based authentication flow
- Protected endpoints with `[Authorize]` attribute
- Claims-based authorization

✅ **CORS & Security**
- Cross-Origin Resource Sharing configuration
- Middleware pipeline order and importance
- HTTPS enforcement
- Security best practices

✅ **Database Integration**
- Entity Framework Core with SQL Server
- Code-First migrations
- DbContext configuration
- LINQ queries and async operations

✅ **ASP.NET Core Features**
- Dependency injection
- Configuration management
- Logging with ILogger
- Exception handling

---

## 🏗️ API Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP/HTTPS Request                        │
│           (Any Client: Browser, Mobile, Postman)             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│            ASP.NET Core Web API (Port 7147)                  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware Pipeline (Program.cs)                      │ │
│  │                                                          │ │
│  │  1️⃣ HTTPS Redirection                                  │ │
│  │           ↓                                              │ │
│  │  2️⃣ CORS Policy (AllowAll/Production)                  │ │
│  │           ↓                                              │ │
│  │  3️⃣ Authentication (JWT Token Validation)              │ │
│  │           ↓                                              │ │
│  │  4️⃣ Authorization (Check Permissions)                  │ │
│  │           ↓                                              │ │
│  │  5️⃣ Route to Controller                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Controllers/                                           │ │
│  │  ├── AuthController.cs                                  │ │
│  │  │   ├── POST /api/Auth/register                        │ │
│  │  │   └── POST /api/Auth/login                           │ │
│  │  │                                                       │ │
│  │  ├── ProductsController.cs [Authorize]                  │ │
│  │  │   ├── GET    /api/Products                           │ │
│  │  │   ├── GET    /api/Products/{id}                      │ │
│  │  │   ├── GET    /api/Products/categories                │ │
│  │  │   ├── POST   /api/Products      [Auth Required]      │ │
│  │  │   ├── PUT    /api/Products/{id} [Auth Required]      │ │
│  │  │   └── DELETE /api/Products/{id} [Auth Required]      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Services/                                              │ │
│  │  └── TokenService.cs                                    │ │
│  │      ├── GenerateToken(User user)                       │ │
│  │      └── ValidateToken(string token)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Data/                                                  │ │
│  │  └── AppDbContext.cs                                    │ │
│  │      ├── DbSet<User> Users                              │ │
│  │      └── DbSet<Product> Products                        │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                  Entity Framework Core
                   (Code-First Approach)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              SQL Server Database (PRN232_Demo)               │
│                                                              │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │  Users Table         │    │  Products Table      │      │
│  ├──────────────────────┤    ├──────────────────────┤      │
│  │ Id (PK, int)         │    │ Id (PK, int)         │      │
│  │ Email (nvarchar)     │    │ Name (nvarchar)      │      │
│  │ Password (nvarchar)  │    │ Price (decimal)      │      │
│  │ FullName (nvarchar)  │    │ Category (nvarchar)  │      │
│  │                      │    │ Description (ntext)  │      │
│  └──────────────────────┘    └──────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Server Structure

```
Server/                                   # ASP.NET Core Web API (.NET 8)
├── 📄 Program.cs                         # Application entry point & middleware config
├── 📄 Server.csproj                      # Project file & dependencies
├── 📄 appsettings.json                   # Configuration (DB, JWT, Logging)
├── 📄 appsettings.Development.json       # Development-specific settings
│
├── 📁 Controllers/                       # API Endpoints
│   ├── AuthController.cs                # Authentication endpoints
│   │   ├── POST /api/Auth/register     # User registration
│   │   └── POST /api/Auth/login        # User login (returns JWT)
│   │
│   └── ProductsController.cs            # Products CRUD with [Authorize]
│       ├── GET    /api/Products         # Get all products
│       ├── GET    /api/Products/{id}    # Get product by ID
│       ├── GET    /api/Products/categories  # Get categories
│       ├── POST   /api/Products         # Create product [Auth Required]
│       ├── PUT    /api/Products/{id}    # Update product [Auth Required]
│       └── DELETE /api/Products/{id}    # Delete product [Auth Required]
│
├── 📁 Data/                              # Database Context
│   └── AppDbContext.cs                  # EF Core DbContext
│       ├── DbSet<User> Users
│       ├── DbSet<Product> Products
│       └── OnModelCreating()            # Fluent API configuration
│
├── 📁 Models/                            # Entity Models
│   ├── User.cs                          # User entity
│   │   ├── Id (int, PK)
│   │   ├── Email (string, unique)
│   │   ├── Password (string)            # ⚠️ Should be hashed in production
│   │   └── FullName (string)
│   │
│   └── Product.cs                       # Product entity
│       ├── Id (int, PK)
│       ├── Name (string, required)
│       ├── Price (decimal)
│       ├── Category (string)
│       └── Description (string, nullable)
│
├── 📁 DTOs/                              # Data Transfer Objects
│   ├── LoginDto.cs                      # Login request model
│   ├── RegisterDto.cs                   # Registration request model
│   └── CreateProductDto.cs              # Product creation model
│
├── 📁 Services/                          # Business Logic
│   └── TokenService.cs                  # JWT Token Management
│       └── GenerateToken(User user)     # Create JWT token
│
├── 📁 Migrations/                        # EF Core Migrations
│   ├── *_InitialCreate.cs               # Initial database schema
│   └── AppDbContextModelSnapshot.cs     # Current model snapshot
│
└── 📁 Properties/                        # Launch Settings
    └── launchSettings.json              # Development server configuration
        ├── HTTPS: https://localhost:7147
        └── HTTP:  http://localhost:5147
```

### 🔑 Key Files Explained

| File | Purpose | Key Configurations |
|------|---------|-------------------|
| **Program.cs** | App startup & middleware | CORS, JWT auth, EF Core, Swagger |
| **appsettings.json** | Configuration | Connection string, JWT secret, logging |
| **AppDbContext.cs** | Database context | DbSets, relationships, seed data |
| **TokenService.cs** | JWT management | Token generation, validation |
| **AuthController.cs** | Authentication | Register, Login endpoints |
| **ProductsController.cs** | CRUD operations | Protected with [Authorize] |

---

## 🚀 Quick Start

### Prerequisites

Ensure you have these installed:

- ✅ **.NET 8.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- ✅ **SQL Server** (Express/Developer/LocalDB) - [Download here](https://www.microsoft.com/sql-server/sql-server-downloads)
- ✅ **Visual Studio 2022** or **VS Code** (optional, recommended)

**Verify .NET installation:**
```cmd
dotnet --version
```
Should show `8.0.x` or higher.

---

### ⚡ 2-Step Setup

#### **Step 1️⃣: Create Database**

Open Command Prompt in the `Server` folder:

```cmd
cd Server
dotnet ef database update
```

**✅ Expected output:**
```
Build started...
Build succeeded.
Done.
```

**✨ Database created:** `PRN232_Demo` with `Users` and `Products` tables.

---

#### **Step 2️⃣: Run the API**

```cmd
dotnet run
```

**✅ Server running at:**
- 🔒 **HTTPS:** `https://localhost:7147`
- 📄 **Swagger UI:** `https://localhost:7147/swagger`

---

### 🎉 You're Ready!

**Test the API:**

**Option 1: Swagger UI (Recommended)**
- Open browser: `https://localhost:7147/swagger`
- Try the endpoints directly
- See request/response examples

**Option 2: cURL**
```bash
# Get all products
curl https://localhost:7147/api/Products

# Register new user
curl -X POST https://localhost:7147/api/Auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test123!\",\"fullName\":\"Test User\"}"

# Login
curl -X POST https://localhost:7147/api/Auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test123!\"}"
```

**Option 3: JavaScript Client**
- Any HTTP client (Postman, Insomnia, Thunder Client) can consume this API

---

## 🔑 API Endpoints Reference

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/Auth/register` | Register new user | ❌ No |
| POST | `/api/Auth/login` | Login and get JWT token | ❌ No |

#### Register User
**POST** `/api/Auth/register`

**Request Body:**
```json
{
  "email": "student@fpt.edu.vn",
  "password": "Password123!",
  "fullName": "Student Name"
}
```

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Email already exists"
}
```

---

#### Login User
**POST** `/api/Auth/login`

**Request Body:**
```json
{
  "email": "student@fpt.edu.vn",
  "password": "Password123!"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJzdHVkZW50QGZwdC5lZHUudm4iLCJuYW1lIjoiU3R1ZGVudCBOYW1lIiwibmJmIjoxNzAzNTIwMDAwLCJleHAiOjE3MDM2MDY0MDAsImlhdCI6MTcwMzUyMDAwMH0.abc123xyz",
  "expiration": "2024-12-26T10:30:00Z"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

---

### 📦 Products Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/Products` | Get all products (with optional filters) | ❌ No |
| GET | `/api/Products/{id}` | Get product by ID | ❌ No |
| GET | `/api/Products/categories` | Get all unique categories | ❌ No |
| POST | `/api/Products` | Create new product | ✅ **Yes** |
| PUT | `/api/Products/{id}` | Update existing product | ✅ **Yes** |
| DELETE | `/api/Products/{id}` | Delete product | ✅ **Yes** |

---

#### Get All Products
**GET** `/api/Products`

**Query Parameters:**
- `category` (optional) - Filter by category (e.g., `?category=Electronics`)
- `minPrice` (optional) - Minimum price (e.g., `?minPrice=100`)
- `maxPrice` (optional) - Maximum price (e.g., `?maxPrice=1000`)

**Example Requests:**
```bash
# Get all products
GET https://localhost:7147/api/Products

# Get electronics under $500
GET https://localhost:7147/api/Products?category=Electronics&maxPrice=500

# Get products between $100-$1000
GET https://localhost:7147/api/Products?minPrice=100&maxPrice=1000
```

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 899.99,
    "category": "Electronics",
    "description": "High-performance laptop"
  },
  {
    "id": 2,
    "name": "Mouse",
    "price": 29.99,
    "category": "Electronics",
    "description": "Wireless mouse"
  }
]
```

---

#### Get Product by ID
**GET** `/api/Products/{id}`

**Example:**
```bash
GET https://localhost:7147/api/Products/1
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 899.99,
  "category": "Electronics",
  "description": "High-performance laptop"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Product not found"
}
```

---

#### Get Categories
**GET** `/api/Products/categories`

**Success Response (200 OK):**
```json
[
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden"
]
```

---

#### Create Product (🔐 Auth Required)
**POST** `/api/Products`

**Headers:**
```
Authorization: Bearer {your-jwt-token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Laptop",
  "price": 1299.99,
  "category": "Electronics",
  "description": "Latest model with amazing features"
}
```

**Success Response (201 Created):**
```json
{
  "id": 10,
  "name": "New Laptop",
  "price": 1299.99,
  "category": "Electronics",
  "description": "Latest model with amazing features"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

---

#### Update Product (🔐 Auth Required)
**PUT** `/api/Products/{id}`

**Headers:**
```
Authorization: Bearer {your-jwt-token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Laptop",
  "price": 1099.99,
  "category": "Electronics",
  "description": "Price reduced!"
}
```

**Success Response (200 OK):**
```json
{
  "id": 10,
  "name": "Updated Laptop",
  "price": 1099.99,
  "category": "Electronics",
  "description": "Price reduced!"
}
```

---

#### Delete Product (🔐 Auth Required)
**DELETE** `/api/Products/{id}`

**Headers:**
```
Authorization: Bearer {your-jwt-token}
```

**Success Response (204 No Content)**

**Error Response (404 Not Found):**
```json
{
  "error": "Product not found"
}
```

---

## ⚙️ Configuration

### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PRN232_Demo;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "ThisIsAVerySecretKeyForJWTTokenGeneration12345678",
    "Issuer": "https://localhost:7147",
    "Audience": "https://localhost:7147",
    "ExpirationInHours": 24
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

**Key Settings:**
- `ConnectionString` - SQL Server database connection
- `Jwt.Key` - Secret key for JWT signing (minimum 32 characters)
- `Jwt.ExpirationInHours` - Token validity period (default: 24 hours)

---

### CORS Configuration

In `Program.cs`:

```csharp
// Development: Allow specific origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5173"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Production: More restrictive
builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", policy =>
    {
        policy.WithOrigins("https://yourdomain.com")
              .WithMethods("GET", "POST")
              .WithHeaders("Content-Type", "Authorization");
    });
});
```

---

## 📚 Key Technologies Explained

### 🔐 JWT (JSON Web Token)

**What it is:**
- Self-contained token for authentication
- Contains user information and expiration
- Signed with secret key to prevent tampering

**Structure:**
```
eyJhbGci... (Header) . eyJzdWIi... (Payload) . SflKxwRJ... (Signature)
```

**How it works:**
1. User logs in with credentials
2. Server validates and generates JWT
3. Client stores token (localStorage, memory, cookie)
4. Client sends token with each request in Authorization header
5. Server validates token signature and expiration

**View/Debug your token:** Paste it at [jwt.io](https://jwt.io)

**Token Payload Example:**
```json
{
  "sub": "1",
  "email": "student@fpt.edu.vn",
  "name": "Student Name",
  "nbf": 1703520000,
  "exp": 1703606400,
  "iat": 1703520000
}
```

---

### 🌐 CORS (Cross-Origin Resource Sharing)

**Why needed:**
- Browser security feature (Same-Origin Policy)
- Prevents malicious websites from accessing your API
- Required when client and API are on different origins

**What's an origin?**
- Protocol + Domain + Port
- `http://localhost:3001` ≠ `https://localhost:7147` (different origins)

**CORS Flow:**
```
1. Browser: "Can I access https://localhost:7147 from http://localhost:3001?"
2. Browser sends preflight OPTIONS request
3. Server responds with CORS headers (Access-Control-Allow-Origin)
4. If allowed, browser makes actual request
5. If denied, browser blocks request (CORS error)
```

**CORS Headers:**
```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

### 🔄 Middleware Pipeline

**What it is:**
- Series of components that process HTTP requests/responses
- Each middleware can modify request, call next middleware, or stop pipeline

**Order matters:**
```csharp
app.UseHttpsRedirection();   // 1. Force HTTPS first
app.UseCors();              // 2. Handle CORS early
app.UseAuthentication();    // 3. Identify user (WHO?)
app.UseAuthorization();     // 4. Check permissions (WHAT?)
app.MapControllers();       // 5. Route to controllers
```

**Why order matters:**
- Authorization needs authentication data first
- CORS headers must be added before authentication
- HTTPS redirection should be first for security

**Request Flow:**
```
Incoming Request
     ↓
HTTPS Redirection → Converts HTTP to HTTPS
     ↓
CORS → Adds CORS headers, handles preflight
     ↓
Authentication → Validates JWT token, sets User identity
     ↓
Authorization → Checks [Authorize] attributes
     ↓
Controller → Executes endpoint logic
     ↓
Response
```

---

## 🛠️ Troubleshooting

### ❌ Issue: "dotnet command not found"

**Cause:** .NET SDK not installed

**Solution:**
```cmd
# Download and install .NET 8 SDK
# https://dotnet.microsoft.com/download/dotnet/8.0

# Verify installation
dotnet --version
```

---

### ❌ Issue: "Cannot open database PRN232_Demo"

**Cause:** Database not created or SQL Server not running

**Solution:**
```cmd
# Check SQL Server status
sc query MSSQL$SQLEXPRESS

# Create/update database
cd Server
dotnet ef database update

# If issues persist, try dropping and recreating
dotnet ef database drop
dotnet ef database update
```

---

### ❌ Issue: "CORS policy blocked" error from client

**Cause:** Client origin not in CORS allowed origins

**Check:**
1. Is server running at `https://localhost:7147`?
2. Is client origin added to CORS policy?
3. Check browser console for exact error

**Solution:**
```csharp
// In Server/Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:3001",  // <-- Add your client URL
            "http://localhost:5173"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});
```

---

### ❌ Issue: "401 Unauthorized" for protected endpoints

**Cause:** Missing or invalid JWT token

**Debug Steps:**
1. Get token from `/api/Auth/login`
2. Verify token at [jwt.io](https://jwt.io)
3. Check expiration time
4. Ensure Authorization header format: `Bearer {token}`

**Solution:**
```bash
# First, login to get token
curl -X POST https://localhost:7147/api/Auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test123!\"}"

# Use token in subsequent requests
curl https://localhost:7147/api/Products ^
  -X POST ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Product\",\"price\":99.99,\"category\":\"Test\"}"
```

---

### ❌ Issue: SSL Certificate warning

**Cause:** Development certificate not trusted

**Solution:**
```cmd
# Clean and trust certificate
dotnet dev-certs https --clean
dotnet dev-certs https --trust

# Restart application
```

---

## 📝 Common Commands

### Development Commands

```cmd
# Navigate to Server directory
cd Server

# Restore NuGet packages
dotnet restore

# Build project
dotnet build

# Run in development mode
dotnet run

# Run with watch (auto-reload on file changes)
dotnet watch run

# Clean build artifacts
dotnet clean
```

---

### Database Commands (EF Core)

```cmd
# Create new migration
dotnet ef migrations add MigrationName

# Update database with latest migration
dotnet ef database update

# Remove last migration (if not applied)
dotnet ef migrations remove

# List all migrations
dotnet ef migrations list

# Drop database (start fresh)
dotnet ef database drop

# Generate SQL script from migrations
dotnet ef migrations script
```

---

### Production Commands

```cmd
# Publish for production
dotnet publish -c Release -o ./publish

# Run published application
cd publish
dotnet Server.dll
```

---

## 🎓 Best Practices Demonstrated

### ✅ Code Organization
- **Controllers** - Handle HTTP requests/responses
- **Services** - Business logic (TokenService)
- **DTOs** - Data transfer objects for API contracts
- **Models** - Database entities
- **Data** - DbContext for database access

### ✅ Security
- JWT token authentication
- HTTPS enforcement
- CORS configuration
- `[Authorize]` attribute for protected endpoints
- ⚠️ **Note:** Passwords should be hashed in production (use BCrypt or ASP.NET Identity)

### ✅ API Design
- RESTful endpoints
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Appropriate status codes (200, 201, 400, 401, 404)
- JSON response format
- Query parameters for filtering

### ✅ Database
- Code-First approach with migrations
- Entity Framework Core
- Async operations (`await`)
- LINQ queries

### ✅ Configuration
- appsettings.json for configuration
- Environment-specific settings
- Dependency injection

---

## 📊 Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| **ASP.NET Core** | 8.0 | Web API framework |
| **Entity Framework Core** | 8.0 | ORM for database access |
| **SQL Server** | 2019+ | Relational database |
| **JWT Bearer** | - | Authentication |
| **Swagger/OpenAPI** | - | API documentation |
| **C#** | 12.0 | Programming language |

---

## 🔗 Important Links

**Documentation:**
- [ASP.NET Core Docs](https://docs.microsoft.com/aspnet/core)
- [EF Core Docs](https://docs.microsoft.com/ef/core)
- [JWT.io](https://jwt.io/) - JWT decoder/debugger
- [REST API Tutorial](https://restfulapi.net/)

**Tools:**
- [Swagger UI](https://localhost:7147/swagger) - Interactive API docs (when running)
- [Postman](https://www.postman.com/) - API testing tool
- [Visual Studio 2022](https://visualstudio.microsoft.com/)
- [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/)

---

## 📞 Support

**For Students:**
- Check troubleshooting section above
- Review [HOW_TO_USE.md](../HOW_TO_USE.md) for complete guide
- Use Swagger UI to test endpoints
- Check server logs for errors

**For Teachers:**
- See [HOW_TO_USE.md](../HOW_TO_USE.md) for teaching guide
- Complete lesson plans included
- Demo scripts for each concept

---

## 🎓 Course Information

- **Course Code:** PRN232
- **Course Name:** Web Application Development with .NET
- **Institution:** FPT University
- **Purpose:** Educational demonstration of Web API development
- **Topics:** ASP.NET Core, JWT Authentication, CORS, EF Core, REST API Design

---

## 📝 Version History

- **v1.0** - Initial API setup with basic CRUD
- **v1.1** - Added JWT authentication
- **v1.2** - Implemented CORS policies
- **v1.3** - Added Swagger documentation
- **v2.0** - Production-ready with comprehensive error handling

---

## 📄 License

This project is created for educational purposes at FPT University.  
Free to use for learning and teaching.

---

<div align="center">

**Built for PRN232 Students**

🎓 FPT University | 2024

---

**Happy Coding! 🚀**

</div>
