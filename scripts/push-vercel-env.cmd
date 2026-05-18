@echo off
setlocal enabledelayedexpansion

rem One-off helper: pushes each line of .env.production.tmp to Vercel for
rem production, preview, and development. Run from the repo root:
rem   scripts\push-vercel-env.cmd

set "ENVFILE=.env.production.tmp"
if not exist "%ENVFILE%" (
  echo [!] %ENVFILE% not found.
  exit /b 1
)

for /f "usebackq tokens=1* delims==" %%A in ("%ENVFILE%") do (
  set "NAME=%%A"
  set "VALUE=%%B"
  if not "!NAME!"=="" if not "!NAME:~0,1!"=="#" (
    for %%T in (production preview development) do (
      echo --^> !NAME! [%%T]
      call npx -y vercel env add !NAME! %%T --value "!VALUE!" --force --yes
    )
  )
)

echo.
echo Done. Run `npx vercel env ls` to verify.
endlocal
