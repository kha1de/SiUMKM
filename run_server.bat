@echo off
cd /d "%~dp0"
echo Memulai Server SiUMKM...
echo Buka browser dan ketik: http://localhost:8000
echo JANGAN TUTUP jendela ini (Tekan Ctrl+C untuk mematikan server).
C:\xampp\php\php.exe -S localhost:8000
pause
