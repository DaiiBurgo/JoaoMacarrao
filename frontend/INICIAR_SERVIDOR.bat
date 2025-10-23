@echo off
chcp 65001 >nul
cls
echo ============================================
echo    🍝 João Macarrão - Iniciando Servidor
echo ============================================
echo.

echo [1/3] Verificando dependências...
if not exist "node_modules\" (
    echo.
    echo ⚠️  Dependências não encontradas!
    echo 📦 Instalando dependências... (pode demorar 2-3 minutos)
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ Erro ao instalar dependências!
        echo.
        pause
        exit /b 1
    )
    echo ✅ Dependências instaladas!
) else (
    echo ✅ Dependências OK!
)

echo.
echo [2/3] Iniciando servidor de desenvolvimento...
echo.
echo 🌐 O servidor abrirá em: http://localhost:3000
echo 📱 Ctrl+C para parar o servidor
echo.
echo ============================================
echo.

echo [3/3] Rodando npm run dev...
call npm run dev

if errorlevel 1 (
    echo.
    echo ❌ Erro ao iniciar servidor!
    echo.
    echo 💡 Tente:
    echo    1. Deletar node_modules e rodar novamente
    echo    2. Verificar se Node.js está instalado
    echo    3. Ver SOLUCAO_ERRO_CAMINHO.md
    echo.
    pause
    exit /b 1
)

