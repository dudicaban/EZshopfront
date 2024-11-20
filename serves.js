const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    // Устанавливаем базовую папку для статики
    const baseDir = path.join(__dirname, 'public');
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(baseDir, filePath);

    // Определяем MIME-типы
    const extname = path.extname(filePath);
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Читаем файл и возвращаем ответ
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`<h1>Server Error: ${err.code}</h1>`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
