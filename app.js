/**
 * FATEC Diadema - Luigi Papaiz
 * Curso: Desenvolvimento de Software Multiplataforma (DSM) - 3º Semestre
 * Disciplina: Desenvolvimento Web III
 * Docente: Prof. Vinicius Heltai Pacheco
 * Aluno: Deivid da Silva Afonso
 *
 * PROJETO 05 – DESENVOLVIMENTO WEB III
 * Servidor HTTP em Node.js puro (sem frameworks) que recebe as notas P1 e P2 via URL
 * (/media?p1=7.5&p2=5.0), calcula MEDIA = (P1 + P2) / 2 e serve public/aprovado.html
 * (>= 6.0) ou public/reprovado.html (< 6.0).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function enviarArquivoHtmlComDados(res, nomeArquivo, dados = {}, statusCode = 200) {
  const caminhoArquivo = path.join(PUBLIC_DIR, nomeArquivo);
  fs.readFile(caminhoArquivo, 'utf-8', (err, conteudo) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Erro interno ao carregar a página HTML.');
      return;
    }

    let htmlRenderizado = conteudo;
    for (const [chave, valor] of Object.entries(dados)) {
      htmlRenderizado = htmlRenderizado.replaceAll(`{{${chave}}}`, String(valor));
    }

    res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlRenderizado);
  });
}

function enviarArquivoEstatico(res, nomeArquivo, statusCode = 200) {
  const caminhoArquivo = path.join(PUBLIC_DIR, nomeArquivo);
  const ext = path.extname(caminhoArquivo).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';

  fs.readFile(caminhoArquivo, (err, conteudo) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 - Arquivo não encontrado.');
      return;
    }
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(conteudo);
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET' });
    res.end('Método não permitido. Utilize apenas requisições GET.');
    return;
  }

  // Rota Inicial
  if (pathname === '/' || pathname === '/index.html') {
    enviarArquivoEstatico(res, 'index.html');
    return;
  }

  // Folha de estilo externa
  if (pathname === '/style.css') {
    enviarArquivoEstatico(res, 'style.css');
    return;
  }

  // Rota Principal: /media?p1=7.5&p2=5.0
  if (pathname === '/media') {
    const p1Param = requestUrl.searchParams.get('p1');
    const p2Param = requestUrl.searchParams.get('p2');

    if (p1Param === null || p2Param === null || p1Param.trim() === '' || p2Param.trim() === '') {
      enviarArquivoHtmlComDados(
        res,
        'erro400.html',
        {
          MENSAGEM_ERRO:
            'Parâmetros obrigatórios ausentes. Informe p1 e p2 na URL (exemplo: /media?p1=7.5&p2=5.0).'
        },
        400
      );
      return;
    }

    const p1 = Number(p1Param.replace(',', '.'));
    const p2 = Number(p2Param.replace(',', '.'));

    if (Number.isNaN(p1) || Number.isNaN(p2) || p1 < 0 || p1 > 10 || p2 < 0 || p2 > 10) {
      enviarArquivoHtmlComDados(
        res,
        'erro400.html',
        {
          MENSAGEM_ERRO:
            'Valores inválidos para P1 ou P2. As notas devem ser números válidos entre 0.0 e 10.0.'
        },
        400
      );
      return;
    }

    const media = (p1 + p2) / 2;
    const aprovado = media >= 6.0;
    const arquivoDestino = aprovado ? 'aprovado.html' : 'reprovado.html';

    enviarArquivoHtmlComDados(res, arquivoDestino, {
      P1: p1.toFixed(2),
      P2: p2.toFixed(2),
      MEDIA: media.toFixed(2),
      SITUACAO: aprovado ? 'APROVADO(A)' : 'REPROVADO(A)'
    });
    return;
  }

  // Tratamento de rotas inexistentes (404)
  enviarArquivoHtmlComDados(
    res,
    'erro404.html',
    { ROTA: pathname },
    404
  );
});

server.listen(PORT, () => {
  console.log(`Servidor Projeto 05 (DWIII) iniciado em http://localhost:${PORT}`);
  console.log(`Exemplo Aprovado : http://localhost:${PORT}/media?p1=7.5&p2=5.0`);
  console.log(`Exemplo Reprovado: http://localhost:${PORT}/media?p1=4.0&p2=5.5`);
});
