@echo off
echo Executando ObjectBuilder em modo debug...
echo.

cd /d "%~dp0"

if not exist "bin\ObjectBuilder.exe\ObjectBuilder.exe" (
    echo ❌ ERRO: ObjectBuilder.exe nao encontrado!
    echo Execute 'npm run build' primeiro.
    pause
    exit /b 1
)

echo 📁 Diretório atual: %CD%
echo 🎯 Executando: bin\ObjectBuilder.exe\ObjectBuilder.exe
echo.

rem Executar com verbose e capturar output
"bin\ObjectBuilder.exe\ObjectBuilder.exe" 2>&1
set EXITCODE=%ERRORLEVEL%

echo.
echo 📊 Exit code: %EXITCODE%

if %EXITCODE% NEQ 0 (
    echo ❌ Aplicação terminou com erro!
) else (
    echo ✅ Aplicação terminou normalmente.
)

echo.
echo Pressione qualquer tecla para continuar...
pause >nul 