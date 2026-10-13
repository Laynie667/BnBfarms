@echo off
rem Starts the B&B outfit studio on this computer and opens it in your browser.
rem It uses the copy of the game in the reference folder. Close the small black window to stop it.
cd /d "%~dp0.."
start "B&B outfit studio (close this window to stop it)" /min node studio\server.mjs
timeout /t 2 /nobreak >nul
start "" http://localhost:4780/
