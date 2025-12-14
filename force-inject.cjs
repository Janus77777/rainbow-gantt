const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist-v2');
const htmlPath = path.join(distDir, 'index-v2.html');
const cssPath = path.join(distDir, 'style.css'); // 使用剛剛手動生成的 css

const html = fs.readFileSync(htmlPath, 'utf-8');
const css = fs.readFileSync(cssPath, 'utf-8');

// 移除所有既有的 <link rel="stylesheet"> 和 <style>，確保乾淨
let newHtml = html.replace(/<link rel="stylesheet"[^>]*>/g, '');
newHtml = newHtml.replace(/<style>[\s\S]*?<\/style>/g, '');

// 在 </head> 之前插入新的 style
newHtml = newHtml.replace('</head>', `<style>${css}</style></head>`);

fs.writeFileSync(htmlPath, newHtml);
console.log('Force injected style.css into HTML');
