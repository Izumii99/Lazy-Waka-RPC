@echo off
echo ==============================================
echo Waka-RPC - Remove from Startup
echo ==============================================
echo.
echo Removing Waka-RPC from Windows Startup...

set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_FOLDER%\Waka-RPC.lnk"

if exist "%SHORTCUT_PATH%" (
    del "%SHORTCUT_PATH%"
    echo.
    echo [SUCCESS] Waka-RPC will no longer start automatically.
) else (
    echo.
    echo [INFO] Waka-RPC startup shortcut was not found.
)

echo.
pause
