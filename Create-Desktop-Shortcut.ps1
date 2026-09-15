# ===========================================================================
# ACET CodeMentor AI - Create Desktop Shortcut
# Run this script once to place a Desktop shortcut for ACET CodeMentor AI.
# ===========================================================================

$AppDir    = $PSScriptRoot
$ShortcutName = "ACET CodeMentor AI"
$DesktopPath  = [System.Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "$ShortcutName.lnk"
$LauncherPath = Join-Path $AppDir "Launch-ACET-App.bat"
$IconPath     = Join-Path $AppDir "assets\icon-512.png"

Write-Host ""
Write-Host "  ==========================================================" -ForegroundColor Cyan
Write-Host "   ACET CodeMentor AI - Desktop Shortcut Creator" -ForegroundColor Cyan
Write-Host "  ==========================================================" -ForegroundColor Cyan
Write-Host ""

# Create WScript Shell COM object for shortcut creation
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut     = $WScriptShell.CreateShortcut($ShortcutPath)

$Shortcut.TargetPath       = $LauncherPath
$Shortcut.WorkingDirectory = $AppDir
$Shortcut.Description      = "Launch ACET CodeMentor AI - AI-Powered Coding & Placement Accelerator"
$Shortcut.WindowStyle      = 1  # Normal window

# Try to set icon from the .bat directly (will use default script icon otherwise)
# Note: .bat files don't carry embedded icons, so we use the launcher as-is
$Shortcut.Save()

if (Test-Path $ShortcutPath) {
    Write-Host "  SUCCESS! Desktop shortcut created:" -ForegroundColor Green
    Write-Host "  --> $ShortcutPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Double-click 'ACET CodeMentor AI' on your Desktop to launch!" -ForegroundColor Cyan
} else {
    Write-Host "  ERROR: Failed to create shortcut. Try running as Administrator." -ForegroundColor Red
}

Write-Host ""
Read-Host "  Press Enter to close"
