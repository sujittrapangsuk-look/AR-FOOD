@echo off
title AR NutriQuest: ภารกิจพิชิตสารอาหาร ป.6
echo ========================================================
echo   AR NutriQuest: สารอาหารและโภชนาการ วิทย์ ป.6
echo   กำลังเริ่มต้นระบบเซิร์ฟเวอร์เสมือนจริงและเปิดเว็บเบราว์เซอร์...
echo ========================================================
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
