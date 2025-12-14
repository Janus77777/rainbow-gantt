const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist-v2');
const htmlPath = path.join(distDir, 'index-v2.html');
const cssFile = fs.readdirSync(path.join(distDir, 'assets')).find(f => f.endsWith('.css'));
const cssPath = path.join(distDir, 'assets', cssFile);

const html = fs.readFileSync(htmlPath, 'utf-8');
const css = fs.readFileSync(cssPath, 'utf-8');

const newHtml = html.replace(
  /<link rel="stylesheet"[^>]*href="[^"]*">/,
  `<style>${css}</style>`
);

fs.writeFileSync(htmlPath, newHtml);
console.log('Injected CSS into HTML');
