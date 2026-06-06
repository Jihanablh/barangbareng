@echo off
cd /d "%~dp0"
echo Starting BarangBareng modular app on http://127.0.0.1:4186/index.html?v=20260606-9
start "BarangBareng Server" /min node -e "const http=require('http'),fs=require('fs'),path=require('path');const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml'};http.createServer((req,res)=>{const clean=req.url.split('?')[0];const file=path.join(process.cwd(),clean==='/'?'index.html':decodeURIComponent(clean.slice(1)));fs.readFile(file,(err,data)=>{if(err){res.writeHead(404,{'Cache-Control':'no-store'});res.end('not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'text/plain','Cache-Control':'no-store'});res.end(data);});}).listen(4186,'127.0.0.1');"
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:4186/index.html?v=20260606-9"
