@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Enviando o site e as fotos para o GitHub...
echo.
git add fotos index.html style.css script.js config.js README.md copiar-fotos.bat copiar-fotos.ps1 subir-git.bat
git status
echo.
git commit -m "Adicionar fotos da Amanda no album surpresa"
if errorlevel 1 (
  echo Se apareceu "nothing to commit", as fotos ja estavam iguais.
)
git push -u origin HEAD
echo.
echo Se nao deu erro, o GitHub ja tem as fotos.
echo.
pause
