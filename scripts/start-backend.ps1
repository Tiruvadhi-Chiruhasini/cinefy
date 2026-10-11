# Loads variables from ..\.env into this PowerShell session, then starts the Spring Boot backend.
# Usage (from the project root):   .\scripts\start-backend.ps1
param([string]$EnvFile = (Join-Path $PSScriptRoot '..\.env'))

if (-not (Test-Path $EnvFile)) {
    Write-Error "Missing $EnvFile. Copy .env.example to .env and fill in your values."
    exit 1
}

Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq '' -or $line.StartsWith('#')) { return }
    $i = $line.IndexOf('=')
    if ($i -lt 1) { return }
    $name  = $line.Substring(0, $i).Trim()
    $value = $line.Substring($i + 1).Trim().Trim('"')
    [Environment]::SetEnvironmentVariable($name, $value, 'Process')
}

Set-Location (Join-Path $PSScriptRoot '..\cinefy-backend')
mvn spring-boot:run
