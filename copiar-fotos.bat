@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Copiando fotos de C:\Users\GGABR\Downloads\fotos
echo para a pasta fotos deste projeto...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0copiar-fotos.ps1"
echo.
pause
