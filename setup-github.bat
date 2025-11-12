@echo off
echo 🚀 LipLux GitHub Setup Script
echo ================================
echo.

echo 📊 Checking project size...
powershell -Command "Get-ChildItem -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name='Total Size (MB)';Expression={[math]::Round($_.Sum/1MB,2)}}"
echo.

echo 📁 Large files that will be excluded:
powershell -Command "Get-ChildItem *.jpg, *.png | Where-Object {$_.Length -gt 1MB} | Select-Object Name, @{Name='Size(MB)';Expression={[math]::Round($_.Length/1MB,2)}} | Format-Table"
echo.

echo 🔧 Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ❌ Git not found. Please install Git first: https://git-scm.com/
    pause
    exit /b 1
)

echo 📝 Adding files to repository...
git add .

echo 💾 Creating initial commit...
git commit -m "🚀 Initial commit: LipLux mobile app with PWA and APK support"

echo.
echo ✅ Local repository created successfully!
echo.
echo 📋 Next steps:
echo 1. Go to https://github.com and create a new repository
echo 2. Name it: liplux-mobile-app
echo 3. Make it public
echo 4. Copy the repository URL
echo 5. Run this command (replace YOUR_USERNAME):
echo    git remote add origin https://github.com/YOUR_USERNAME/liplux-mobile-app.git
echo 6. Push to GitHub:
echo    git push -u origin main
echo.
echo 🌐 After pushing, enable GitHub Pages in repository settings
echo    Your site will be live at: https://YOUR_USERNAME.github.io/liplux-mobile-app
echo.
pause
