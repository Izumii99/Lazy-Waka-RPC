@echo off
echo ==============================================
echo Waka-RPC - Auto-Start Setup
echo ==============================================
echo.
echo Configuring the bot to run automatically on PC startup...

set "VBS_PATH=%~dp0waka-run-hidden.vbs"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_FOLDER%\Waka-RPC.lnk"

powershell -NoProfile -Command "$wshell = New-Object -ComObject WScript.Shell; $shortcut = $wshell.CreateShortcut('%SHORTCUT_PATH%'); $shortcut.TargetPath = 'wscript.exe'; $shortcut.Arguments = '\"%VBS_PATH%\"'; $shortcut.WorkingDirectory = '%~dp0'; $shortcut.WindowStyle = 1; $shortcut.Save()"

echo.
echo [SUCCESS] Shortcut created successfully!
echo Waka-RPC will now automatically start in the background
echo every time Windows boots up.
echo.
echo Shortcut Location: %SHORTCUT_PATH%
echo.
pause
