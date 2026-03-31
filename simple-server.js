const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // 解析请求路径
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // 处理 CloudBase SDK 代理请求
    if (req.url.startsWith('/cloudbase/')) {
        const sdkPath = req.url.replace('/cloudbase/', '');
        const sdkFilePath = path.join(__dirname, 'cloudbase-sdk', sdkPath);
        
        fs.readFile(sdkFilePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end(`File not found: ${sdkFilePath}`);
            } else {
                res.writeHead(200, {
                    'Content-Type': 'application/javascript'
                });
                res.end(content, 'utf-8');
            }
        });
        return;
    }

    // 处理静态文件请求
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', (error, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
                res.end();
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Game available at http://localhost:${PORT}/index.html`);
});
