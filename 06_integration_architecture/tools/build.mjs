// node tools/build.mjs [absolute path to marked package]
// Render PlantUML to adjacent SVG before running this command.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const markedModule = process.argv[2]
  ? await import(pathToFileURL(path.join(process.argv[2], 'lib/marked.esm.js')).href)
  : await import('marked');
const {marked} = markedModule;
const output = path.join(root, 'output');
fs.mkdirSync(output, {recursive:true});
const docs = ['README.md', 'INT-001-target-model.md', 'INT-002-contract-catalog.md', 'INT-003-team-handoff.md', 'INT-004-acceptance.md'];
const ids = new Map(docs.map((name, index) => [path.join(root, name), `document-${index}`]));
const svgFiles = fs.readdirSync(path.join(root,'diagrams')).filter(x=>x.endsWith('.svg')).sort();
const imageData = file => 'data:image/svg+xml;base64,' + fs.readFileSync(file).toString('base64');
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function resolveLink(href, doc) {
  if (/^(https?:|mailto:|#)/.test(href)) return {href};
  const [relative] = href.split('#');
  const target = path.resolve(path.dirname(doc), decodeURIComponent(relative));
  if(ids.has(target)) return {href:'#'+ids.get(target)};
  if(target.endsWith('.svg') && target.startsWith(path.join(root,'diagrams'))) return {href:'#'+path.basename(target,'.svg')};
  if(target.endsWith('.puml') && fs.existsSync(target)) return {href:'data:text/plain;charset=utf-8;base64,'+fs.readFileSync(target).toString('base64'), download:path.basename(target)};
  if(target.endsWith('.json') && fs.existsSync(target)) return {href:'data:application/json;charset=utf-8;base64,'+fs.readFileSync(target).toString('base64'), download:path.basename(target)};
  return {href:path.relative(output,target).split(path.sep).map(encodeURIComponent).join('/')};
}
const sections = docs.map((name,index)=>{
 const doc=path.join(root,name);
 let html=marked.parse(fs.readFileSync(doc,'utf8'),{gfm:true});
 html=html.replace(/<img src="([^"]+)" alt="([^"]*)"[^>]*>/g,(_,src,alt)=>{
  const target=path.resolve(path.dirname(doc),src);
  return `<button class="diagram" aria-label="Увеличить схему: ${alt}"><img src="${imageData(target)}" alt="${alt}" loading="lazy"><span>Нажмите, чтобы увеличить</span></button>`;
 });
 html=html.replace(/<a href="([^"]+)"/g,(_,href)=>{
  const link=resolveLink(href,doc);
  return `<a href="${esc(link.href)}"${link.download?' download="'+esc(link.download)+'"':''}`;
 });
 html=html.replace(/<table>/g,'<div class="table-scroll"><table>').replace(/<\/table>/g,'</table></div>');
 return `<section id="document-${index}">${html}</section>`;
}).join('\n');
const gallery=svgFiles.map(name=>{
 const stem=path.basename(name,'.svg');
 const source=path.join(root,'diagrams',stem+'.puml');
 return `<article id="${stem}"><h2>${esc(stem)}</h2><button class="diagram" aria-label="Увеличить ${stem}"><img src="${imageData(path.join(root,'diagrams',name))}" alt="${stem}" loading="lazy"><span>Увеличить схему</span></button><p><a download="${stem}.svg" href="${imageData(path.join(root,'diagrams',name))}">Скачать SVG</a> · <a download="${stem}.puml" href="data:text/plain;charset=utf-8;base64,${fs.readFileSync(source).toString('base64')}">Скачать PlantUML</a></p></article>`;
}).join('\n');
const html=`<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RetailMax — интеграционная модель To-Be</title>
<style>
:root{--ink:#17263a;--muted:#56677d;--accent:#00695e;--line:#dce5ec;--paper:#fff;--bg:#f2f5f8}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:82px}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}a{color:#00695e;text-underline-offset:3px}nav{position:sticky;top:0;z-index:2;background:#17263a;display:flex;gap:20px;flex-wrap:wrap;padding:14px 28px;font-size:14px}nav a{color:#fff;text-decoration:none}header{max-width:1240px;margin:auto;padding:54px 32px 26px}header .eyebrow{font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);font-weight:700}header h1{font-size:42px;line-height:1.15;margin:12px 0 20px;max-width:850px}header p{max-width:780px;color:var(--muted)}.chips{display:flex;gap:10px;flex-wrap:wrap}.chip{padding:5px 12px;background:#e2eeeb;border-radius:6px;font-size:13px;color:#075a50}main{max-width:1240px;margin:auto;padding:0 24px 60px}section{background:var(--paper);padding:32px;margin:24px 0;border:1px solid var(--line);border-radius:10px}h1{font-size:28px;line-height:1.25}h2{font-size:23px;margin-top:34px;line-height:1.35}h3{font-size:19px}p,li{overflow-wrap:anywhere}table{border-collapse:collapse;width:100%;font-size:14px;line-height:1.5}th,td{padding:11px 12px;border:1px solid var(--line);text-align:left;vertical-align:top;min-width:110px}th{background:#eaf0f4;font-weight:650}tr:nth-child(even) td{background:#fafbfd}.table-scroll{overflow-x:auto;margin:18px 0}code{font:13px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;background:#eef2f5;border-radius:3px;padding:2px 4px;overflow-wrap:anywhere}pre{overflow:auto;padding:16px;background:#eef2f5}blockquote{border-left:4px solid var(--accent);margin-left:0;padding-left:18px}.diagram{display:block;border:1px solid var(--line);border-radius:8px;background:#fff;cursor:zoom-in;width:100%;padding:16px;margin:20px 0;color:var(--muted);text-align:center}.diagram img{display:block;max-width:100%;max-height:850px;margin:auto}.diagram span{display:block;font-size:12px;margin-top:12px}.diagram:focus-visible{outline:3px solid var(--accent)}article{border-top:1px solid var(--line);padding-top:12px;margin-top:36px}dialog{width:96vw;height:94vh;max-width:none;max-height:none;padding:0;border:0;border-radius:8px}dialog::backdrop{background:#142336d9}.modalbar{position:sticky;top:0;background:#17263a;color:white;display:flex;align-items:center;gap:18px;padding:10px 16px;z-index:1}.modalbar button{padding:8px 14px;cursor:pointer;border:0;border-radius:4px}.canvas{overflow:auto;height:calc(100% - 62px);padding:24px;background:#f8fafc}.canvas img{display:block;margin:0 auto;background:white;max-width:100%;height:auto}.canvas.actual img{max-width:none}footer{padding:24px;color:var(--muted);text-align:center;font-size:13px}@media(max-width:700px){nav{gap:12px;padding:12px}header{padding:30px 18px}header h1{font-size:30px}main{padding:0 10px}section{padding:18px}th,td{min-width:140px;padding:8px}.diagram{padding:6px}}@media print{nav,.diagram span,.modalbar{display:none}body{background:white;font-size:11pt}section{border:0;padding:0;break-before:page}header{padding:0}h2,h3{break-after:avoid}tr{break-inside:avoid}.diagram img{max-height:none}table{font-size:9pt}}
</style></head><body>
<nav aria-label="Разделы"><a href="#document-0">Обзор</a><a href="#document-1">Модель</a><a href="#document-2">Контракты</a><a href="#document-3">Командам</a><a href="#document-4">Приёмка</a><a href="#gallery">8 схем</a></nav>
<header><div class="eyebrow">RetailMax / команда интернет-магазина</div><h1>Общая интеграционная модель To-Be</h1><p>Единый маршрут для пяти доменов, границы владельцев данных и правила восстановления. Пакет для включения в архитектуру и планы команд.</p><div class="chips"><span class="chip">Версия 1.0 · 12.11.2026</span><span class="chip">Проект для согласования</span><span class="chip">8 редактируемых схем</span></div></header>
<main>${sections}<section id="gallery"><h1>Схемы для включения в модели команд</h1><p>Нажмите на схему для увеличения. SVG и исходник PlantUML скачиваются прямо из этого файла.</p>${gallery}</section></main>
<dialog id="zoom"><div class="modalbar"><button id="close" type="button">Закрыть</button><button id="scale" type="button">Натуральный размер</button><span>Esc — закрыть</span></div><div class="canvas"><img id="zoom-image" alt="Увеличенная схема"></div></dialog>
<footer>Схемы встроены, интернет для просмотра не требуется. Ссылки на исходные материалы кейса работают в репозитории.</footer>
<script>
const dialog=document.getElementById('zoom'), canvas=document.querySelector('.canvas'), img=document.getElementById('zoom-image'), scale=document.getElementById('scale');
document.querySelectorAll('.diagram').forEach(button=>button.addEventListener('click',()=>{img.src=button.querySelector('img').src;img.alt=button.querySelector('img').alt;canvas.classList.remove('actual');scale.textContent='Натуральный размер';dialog.showModal()}));
document.getElementById('close').addEventListener('click',()=>dialog.close());scale.addEventListener('click',()=>{canvas.classList.toggle('actual');scale.textContent=canvas.classList.contains('actual')?'Вписать по ширине':'Натуральный размер'});
</script></body></html>`;
fs.writeFileSync(path.join(output,'RetailMax_Integration_ToBe.html'),html);
console.log(`Built HTML: ${docs.length} documents, ${svgFiles.length} SVG diagrams, ${Buffer.byteLength(html)} bytes`);
