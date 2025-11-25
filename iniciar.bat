@echo off
title Help Desk Launcher 🚀
color 0A

:: ==========================================
:: MENU DE OPCOES
:: ==========================================
cls
echo.
echo ==========================================
echo      GERENCIADOR DO HELPDESK SYSTEM
echo ==========================================
echo.
echo [1] INICIAR TUDO (Start + Navegador)
echo [2] RECONSTRUIR (Forcar update --build)
echo [3] PARAR TUDO (Derrubar containers)
echo.
set /p opcao="Escolha uma opcao: "

if "%opcao%"=="1" goto START
if "%opcao%"=="2" goto BUILD
if "%opcao%"=="3" goto STOP
goto END

:: ==========================================
:: OPCAO 1: START
:: ==========================================
:START
cls
echo [INFO] Subindo containers em background...
docker-compose up -d

echo.
echo [INFO] Aguardando 10 segundos para o sistema carregar...
timeout /t 10 /nobreak >nul

echo.
echo [INFO] Abrindo navegador...
start http://localhost:5173

echo.
echo [INFO] Sistema rodando! Mostrando logs abaixo (CTRL+C para sair dos logs)...
echo =======================================================================
docker-compose logs -f
goto END

:: ==========================================
:: OPCAO 2: REBUILD
:: ==========================================
:BUILD
cls
echo [INFO] Reconstruindo imagens e iniciando...
docker-compose up --build -d
echo.
echo [INFO] Aguardando o sistema...
timeout /t 10 /nobreak >nul
start http://localhost:5173
docker-compose logs -f
goto END

:: ==========================================
:: OPCAO 3: STOP
:: ==========================================
:STOP
cls
echo [INFO] Parando todos os containers...
docker-compose down
echo.
echo [SUCCESS] Sistema desligado com sucesso.
pause
goto END

:END