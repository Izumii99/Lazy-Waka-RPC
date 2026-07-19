@echo off
echo Checking WakaTime Bot status...

powershell -NoProfile -Command "$proc = Get-CimInstance Win32_Process -Filter \"name='node.exe'\"; $k = $false; foreach ($p in $proc) { if ($p.CommandLine -match 'waka-rpc.js' -or $p.CommandLine -match 'wakatime-bot.js') { Stop-Process -Id $p.ProcessId -Force; Write-Host '[SUCCESS] WakaTime Bot has been stopped!'; $k = $true } }; if (-not $k) { Write-Host '[INFO] WakaTime Bot is not currently running.' }"

echo.
pause
