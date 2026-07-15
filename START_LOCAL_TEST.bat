@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Aloulou Local Test Server

echo ==============================================
echo   علولو للصناعة - تشغيل الموقع للاختبار المحلي
echo ==============================================
echo.

echo سيتم فتح الموقع على:
echo http://localhost:8000/index.html
echo.

where py >nul 2>&1
if %errorlevel%==0 (
  start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 1; Start-Process 'http://localhost:8000/index.html'"
  py -m http.server 8000
  goto :eof
)

where python >nul 2>&1
if %errorlevel%==0 (
  start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 1; Start-Process 'http://localhost:8000/index.html'"
  python -m http.server 8000
  goto :eof
)

where python3 >nul 2>&1
if %errorlevel%==0 (
  start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 1; Start-Process 'http://localhost:8000/index.html'"
  python3 -m http.server 8000
  goto :eof
)

echo لم يتم العثور على Python على الجهاز.
echo افتح المجلد في VS Code واستخدم إضافة Live Server،
echo أو ارفع الموقع على GitHub Pages لتجربة إنشاء الفاتورة.
echo.
pause
