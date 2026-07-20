@echo off
echo Starting WakaTime + Discord Bot on Windows...
cd /d "%~dp0"

echo Menunggu koneksi internet...
:cek_internet
ping -n 1 8.8.8.8 >nul
if errorlevel 1 (
    timeout /t 5 >nul
    goto cek_internet
)

echo Internet terhubung! Menjalankan script...
node waka-rpc.js
pause
