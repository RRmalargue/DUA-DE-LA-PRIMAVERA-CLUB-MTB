@echo off
title Servidor Trail Running Portal
echo ==================================================
echo Cerrando otros servidores activos...
echo ==================================================
taskkill /f /im node.exe >nul 2>&1
echo.
echo ==================================================
echo Iniciando servidor para esta carrera...
echo ==================================================
start "" "http://localhost:3000/admin.html"
node server.js
