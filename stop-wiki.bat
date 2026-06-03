@echo off
chcp 65001 >nul
title 위키 서버 종료

echo.
echo 마인크래프트 위키 서버를 종료합니다...
echo.

taskkill /F /IM node.exe /T 2>nul
if errorlevel 1 (
    echo - 실행 중인 서버가 없습니다.
) else (
    echo - 서버가 종료되었습니다.
)

echo.
timeout /t 2 /nobreak >nul
