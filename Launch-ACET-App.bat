@echo off
title ACET CodeMentor AI - Launcher
color 0B
echo.
echo   ============================================================
echo    ACET CodeMentor AI - Launching Standalone App...
echo   ============================================================
echo.

:: Determine the folder this script lives in
set APP_DIR=%~dp0
set APP_URL=file:///%APP_DIR:\=/%index.html

:: Remove trailing slash from URL if present
if "%APP_URL:~-1%"=="/" set APP_URL=%APP_URL:~0,-1%

:: Try Microsoft Edge first (most common on Windows 11/10)
echo   Looking for Microsoft Edge...
set EDGE_PATH=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe
if not exist "%EDGE_PATH%" set EDGE_PATH=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe

if exist "%EDGE_PATH%" (
    echo   Found Edge! Launching in App Mode...
    start "" "%EDGE_PATH%" --app="%APP_URL%" --window-size=1400,900 --disable-extensions --no-default-browser-check
    goto :done
)

:: Try Google Chrome
echo   Edge not found. Looking for Google Chrome...
set CHROME_PATH=%ProgramFiles%\Google\Chrome\Application\chrome.exe
if not exist "%CHROME_PATH%" set CHROME_PATH=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe
if not exist "%CHROME_PATH%" set CHROME_PATH=%LocalAppData%\Google\Chrome\Application\chrome.exe

if exist "%CHROME_PATH%" (
    echo   Found Chrome! Launching in App Mode...
    start "" "%CHROME_PATH%" --app="%APP_URL%" --window-size=1400,900 --disable-extensions --no-default-browser-check
    goto :done
)

:: Try Brave Browser
echo   Chrome not found. Looking for Brave...
set BRAVE_PATH=%ProgramFiles%\BraveSoftware\Brave-Browser\Application\brave.exe
if not exist "%BRAVE_PATH%" set BRAVE_PATH=%LocalAppData%\BraveSoftware\Brave-Browser\Application\brave.exe

if exist "%BRAVE_PATH%" (
    echo   Found Brave! Launching in App Mode...
    start "" "%BRAVE_PATH%" --app="%APP_URL%" --window-size=1400,900 --disable-extensions
    goto :done
)

:: Fallback: Open in default browser
echo.
echo   [WARNING] No supported browser found for App Mode.
echo   Opening in your default browser instead...
start "" "%APP_URL%"

:done
echo.
echo   ACET CodeMentor AI launched successfully!
echo.
timeout /t 2 /nobreak >nul
exit
