@echo off
chcp 65001 >nul
cls
echo ============================================
echo    🍝 João Macarrão - Setup Completo
echo ============================================
echo.
echo Este script vai:
echo  1. Instalar todas as dependências
echo  2. Iniciar o servidor de desenvolvimento
echo  3. Abrir o navegador automaticamente
echo.
echo ============================================
echo.
pause

echo [1/4] Limpando instalações anteriores...
if exist "node_modules\" (
    echo Removendo node_modules antigo...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    echo Removendo package-lock.json antigo...
    del package-lock.json
)
echo ✅ Limpeza concluída!
echo.

echo [2/4] Instalando dependências...
echo (Isso pode demorar 2-3 minutos)
echo.
call npm install

if errorlevel 1 (
    echo.
    echo ❌ Erro na instalação!
    echo.
    echo Possíveis soluções:
    echo  1. Verifique sua conexão com internet
    echo  2. Instale Node.js de https://nodejs.org/
    echo  3. Rode como Administrador
    echo.
    pause
    exit /b 1
)
echo.
echo ✅ Dependências instaladas com sucesso!
echo.

echo [3/4] Iniciando servidor...
echo.
echo 🌐 Servidor: http://localhost:3000
echo 📱 Pressione Ctrl+C para parar
echo.

timeout /t 2 >nul

echo [4/4] Abrindo navegador...
start http://localhost:3000

call npm run dev

