# One-off helper: pushes each line of .env.production.tmp to Vercel as an
# environment variable for production, preview, and development.
#
# Run from the repo root: powershell -File scripts/push-vercel-env.ps1
#
# Re-running is safe — `vercel env add --force` overwrites existing values.

param(
  [string]$EnvFile = '.env.production.tmp'
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $EnvFile)) {
  Write-Error "Env file '$EnvFile' not found."
  exit 1
}

$targets = @('production', 'preview', 'development')

foreach ($line in Get-Content $EnvFile) {
  if ([string]::IsNullOrWhiteSpace($line)) { continue }
  if ($line.StartsWith('#')) { continue }

  $idx = $line.IndexOf('=')
  if ($idx -lt 1) {
    Write-Warning "Skipping malformed line: $line"
    continue
  }
  $name  = $line.Substring(0, $idx).Trim()
  $value = $line.Substring($idx + 1).Trim()

  foreach ($target in $targets) {
    Write-Host "→ $name [$target]"
    & npx -y vercel env add $name $target --value $value --force --yes 2>&1 |
      Out-String |
      Where-Object { $_ -ne '' } |
      Write-Host
  }
}

Write-Host ''
Write-Host '✅ Done. Run `vercel env ls` to verify.'
