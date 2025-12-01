const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Se a URL for "/", redirecione para index.html
  let filePath = req.url === '/' ? './index.html' : '.' + req.url;
  
  // Verificar se o arquivo existe
  fs.exists(filePath, (exists) => {
    if (!exists) {
      // Se não existir, tentar adicionar .html
      if (!path.extname(filePath)) {
        filePath += '.html';
      }
      
      fs.exists(filePath, (exists2) => {
        if (!exists2) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 - Arquivo não encontrado</h1>');
          return;
        }
        serveFile(filePath, res);
      });
    } else {
      serveFile(filePath, res);
    }
  });
});

function serveFile(filePath, res) {
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Arquivo não encontrado</h1>');
      } else {
        res.writeHead(500);
        res.end(`Erro do servidor: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Pressione Ctrl+C para encerrar`);
});