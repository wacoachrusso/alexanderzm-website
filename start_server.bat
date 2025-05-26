@echo off
echo Starting server...
start "" http://localhost:8000
python -m http.server 8000
