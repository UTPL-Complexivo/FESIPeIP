@echo off
echo Ejecutando tests individuales para identificar errores...

echo.
echo ===== Testing Alineacion Service =====
call ng test --include="**/alineacion.service.spec.ts" --watch=false --browsers=ChromeHeadless --single-run

echo.
echo ===== Testing Rol Service =====
call ng test --include="**/rol.service.spec.ts" --watch=false --browsers=ChromeHeadless --single-run

echo.
echo ===== Testing Sector Service =====
call ng test --include="**/sector.service.spec.ts" --watch=false --browsers=ChromeHeadless --single-run

echo.
echo ===== Testing Sub-Sector Service =====
call ng test --include="**/sub-sector.service.spec.ts" --watch=false --browsers=ChromeHeadless --single-run

echo.
echo ===== Testing Tipologia Service =====
call ng test --include="**/tipologia.service.spec.ts" --watch=false --browsers=ChromeHeadless --single-run

echo.
echo ===== Testing Usuario Service =====
call ng test --include="**/usuario.service.spec.ts" --watch=false --browsers=ChromeHeadless --single-run

echo.
echo Tests individuales completados.
