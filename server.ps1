# Robust Local Static HTTP Server for ACET CodeMentor AI
param([int]$Port = 5500)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
    Write-Host "=================================================="
    Write-Host "🚀 ACET CodeMentor AI Server is Running!" -ForegroundColor Cyan
    Write-Host "👉 Localhost: http://localhost:$Port/" -ForegroundColor Green
    Write-Host "👉 LAN (Wi-Fi): http://192.168.1.3:$Port/" -ForegroundColor Yellow
    Write-Host "=================================================="

    $root = $PSScriptRoot
    if (-not $root) { $root = Get-Location }

    $mimeTypes = @{
        ".html" = "text/html; charset=utf-8"
        ".htm"  = "text/html; charset=utf-8"
        ".css"  = "text/css; charset=utf-8"
        ".js"   = "application/javascript; charset=utf-8"
        ".json" = "application/json; charset=utf-8"
        ".png"  = "image/png"
        ".jpg"  = "image/jpeg"
        ".jpeg" = "image/jpeg"
        ".svg"  = "image/svg+xml"
        ".ico"  = "image/x-icon"
    }

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            # Enable CORS for external devices
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD")
            $response.AddHeader("Access-Control-Allow-Headers", "*")

            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 200
                $response.Close()
                continue
            }

            $rawPath = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($rawPath)) {
                $rawPath = "index.html"
            }

            $filePath = Join-Path $root $rawPath
            $fullPath = [System.IO.Path]::GetFullPath($filePath)
            $rootFullPath = [System.IO.Path]::GetFullPath($root)

            if (-not $fullPath.StartsWith($rootFullPath)) {
                $response.StatusCode = 403
                $response.Close()
                continue
            }

            if (Test-Path $fullPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                $mime = "application/octet-stream"
                if ($mimeTypes.ContainsKey($ext)) {
                    $mime = $mimeTypes[$ext]
                }

                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $response.ContentType = $mime
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200

                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawPath")
                $response.ContentType = "text/plain"
                $response.ContentLength64 = $notFoundBytes.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
                }
            }

            $response.Close()
        } catch {
            Write-Host "Warning on request: $_" -ForegroundColor DarkYellow
            try { $context.Response.Close() } catch {}
        }
    }
} catch {
    Write-Host "Fatal server error: $_" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
