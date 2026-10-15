@echo off
rem Starts the B&B outfit studio on this computer and opens it in your browser.
rem It uses the live game's own files, fetched from the game's site the first time they're needed and kept in
rem studio\game-cache (so the first start takes a little longer). Close the small black window to stop it.
rem For the developers' newer copy in the reference folder instead, change "live" below to nothing.
cd /d "%~dp0.."
start "B&B outfit studio (close this window to stop it)" /min node studio\server.mjs live
timeout /t 4 /nobreak >nul
start "" http://localhost:4780/
