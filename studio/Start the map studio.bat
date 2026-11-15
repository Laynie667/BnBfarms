@echo off
rem Starts the B&B studio on this computer and opens the MAP studio in your browser (the outfit studio is at
rem http://localhost:4780/ while it runs). It uses the live game's own files, fetched the first time and kept in
rem studio\game-cache. Close the small black window to stop it. If the studio is already running, this just opens the map.
cd /d "%~dp0.."
powershell -NoProfile -Command "try { (Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://localhost:4780/__studio/maps/) | Out-Null; exit 0 } catch { exit 1 }"
if errorlevel 1 (
  start "B&B studio (close this window to stop it)" /min node studio\server.mjs live
  timeout /t 5 /nobreak >nul
)
start "" http://localhost:4780/map
