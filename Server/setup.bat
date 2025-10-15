@echo off
echo ========================================
echo PRN232 Demo - Server Setup Script
echo ========================================
echo.

echo Step 1: Restoring NuGet packages...
dotnet restore
if %errorlevel% neq 0 (
    echo ERROR: Failed to restore packages
    pause
    exit /b 1
)
echo ✓ Packages restored successfully
echo.

echo Step 2: Building project...
dotnet build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo ✓ Build successful
echo.

echo Step 3: Checking for existing database...
dotnet ef database drop -f >nul 2>&1
echo ✓ Old database dropped (if existed)
echo.

echo Step 4: Creating database and running migrations...
dotnet ef database update
if %errorlevel% neq 0 (
    echo ERROR: Migration failed
    echo Make sure SQL Server is running
    pause
    exit /b 1
)
echo ✓ Database created and migrations applied
echo.

echo ========================================
echo ✅ Setup completed successfully!
echo ========================================
echo.
echo Database: PRN232_Demo
echo Seeded data: 3 products
echo.
echo To start the server, run:
echo   dotnet run
echo.
echo API will be available at:
echo   - https://localhost:7036 (Swagger UI)
echo   - http://localhost:5001
echo.
pause
