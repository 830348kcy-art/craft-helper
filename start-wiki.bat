@echo off
chcp 65001 >nul
title 마인크래프트 위키 서버 (이 창을 닫으면 서버가 꺼집니다)

cd /d "%~dp0"

echo.
echo ============================================================
echo   마인크래프트 위키 서버를 시작합니다...
echo ============================================================
echo.
echo   주소: http://localhost:3000
echo.
echo   * 잠시 후 브라우저가 자동으로 열립니다
echo   * 이 창을 닫으면 서버가 종료됩니다
echo   * 다시 켜려면 바탕화면 [위키 시작] 아이콘을 누르세요
echo.
echo ============================================================
echo.

REM Node.js PATH 자동 추가 (재부팅 후에도 동작)
set "PATH=C:\Program Files\nodejs;%PATH%"

REM 브라우저 자동 오픈 (3초 후)
start "" /B cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

REM 프로덕션 서버 실행
"C:\Program Files\nodejs\npm.cmd" start

pause
