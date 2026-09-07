@echo off
title Servidor Trail Running Portal
echo ==================================================
echo Iniciando servidor de Trail Running Portal...
echo ==================================================
node server.js
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] No se pudo iniciar el servidor. Asegurate de tener Node.js instalado.
    pause
)
