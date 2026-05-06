const fs = require('fs');
const path = require('path');

const ROOT = '/data/.openclaw/workspace';
const OUT = path.join(ROOT, 'site-export');
const cssPath = '/assets/styles.css';
const routeMap = {
  '/': '/index.html',
  '/contacto': '/contacto/index.html',
  '/quienes-somos': '/quienes-somos/index.html',
  '/recursos': '/recursos/index.html',
  '/empieza': '/empieza/index.html',
  '/impuestos': '/impuestos/index.html',
  '/ayudas': '/ayudas/index.html',
  '/asesoria': '/asesoria/index.html',
  '/empieza/como-empezar-a-emprender-en-vitoria-gasteiz-sin-ir-a-ciegas': '/empieza/como-empezar-a-emprender-en-vitoria-gasteiz-sin-ir-a-ciegas.html',
  '/empieza/como-hacerse-autonomo-en-alava': '/empieza/como-hacerse-autonomo-en-alava.html',
  '/empieza/que-necesitas-antes-de-darte-de-alta-como-autonomo': '/empieza/que-necesitas-antes-de-darte-de-alta-como-autonomo.html',
  '/decisiones-clave/autonomo-o-sl-que-te-conviene': '/decisiones-clave/autonomo-o-sl-que-te-conviene.html',
  '/impuestos/que-impuestos-paga-un-autonomo-cuando-empieza': '/impuestos/que-impuestos-paga-un-autonomo-cuando-empieza.html',
  '/impuestos/iva-para-principiantes-que-es-y-cuando-te-afecta': '/impuestos/iva-para-principiantes-que-es-y-cuando-te-afecta.html',
  '/impuestos/irpf-para-autonomos-explicado-sin-jerga': '/impuestos/irpf-para-autonomos-explicado-sin-jerga.html',
  '/impuestos/gastos-deducibles-que-suele-entenderse-mal': '/impuestos/gastos-deducibles-que-suele-entenderse-mal.html',
  '/impuestos/ticketbai-en-alava-lo-que-debes-entender-desde-el-principio': '/impuestos/ticketbai-en-alava-lo-que-debes-entender-desde-el-principio.html',
  '/ayudas/ayudas-para-emprender-en-vitoria-gasteiz-y-alava': '/ayudas/ayudas-para-emprender-en-vitoria-gasteiz-y-alava.html',
  '/ayudas/como-prepararte-para-pedir-ayudas-sin-perder-tiempo': '/ayudas/como-prepararte-para-pedir-ayudas-sin-perder-tiempo.html',
  '/recursos/checklist-para-empezar-sin-ir-a-ciegas': '/recursos/checklist-para-empezar-sin-ir-a-ciegas.html',
  '/recursos/calendario-basico-de-obligaciones-para-quien-empieza': '/recursos/calendario-basico-de-obligaciones-para-quien-empieza.html',
  '/recursos/certificado-digital-por-que-te-conviene-resolverlo-cuanto-antes': '/recursos/certificado-digital-por-que-te-conviene-resolverlo-cuanto-antes.html',
  '/errores/errores-frecuentes-al-empezar-un-negocio': '/errores/errores-frecuentes-al-empezar-un-negocio.html',
  '/errores/errores-frecuentes-al-empezar-un-negocio-que-luego-salen-caros': '/errores/errores-frecuentes-al-empezar-un-negocio.html',
  '/errores/que-pasa-si-empiezas-a-facturar-sin-orden': '/errores/que-pasa-si-empiezas-a-facturar-sin-orden.html',
  '/asesoria/asesoria-para-emprender-en-vitoria-gasteiz-y-alava': '/asesoria/asesoria-para-emprender-en-vitoria-gasteiz-y-alava.html',
  '/asesoria/alta-y-acompanamiento-para-autonomos': '/asesoria/alta-y-acompanamiento-para-autonomos.html',
  '/asesoria/asesoria-para-pequenos-negocios': '/asesoria/asesoria-para-pequenos-negocios.html',
  '/asesoria/cambio-de-asesoria-para-negocios-de-menos-de-3-anos': '/asesoria/cambio-de-asesoria-para-negocios-de-menos-de-3-anos.html',
  '/acompanamiento/en-que-fijarte-para-elegir-una-buena-asesoria-al-empezar': '/acompanamiento/en-que-fijarte-para-elegir-una-buena-asesoria-al-empezar.html',
  '/acompanamiento/que-deberia-darte-una-buena-asesoria-al-empezar-y-cuando-cambiar': '/acompanamiento/que-deberia-darte-una-buena-asesoria-al-empezar-y-cuando-cambiar.html',
  '/asesoria/becas-para-emprender-con-nosotros': '/asesoria/becas-para-emprender-con-nosotros.html'
};

function read(p){return fs.readFileSync(path.join(ROOT,p),'utf8');}
function write(rel, content){ const full = path.join(OUT, rel); fs.mkdirSync(path.dirname(full), {recursive:true}); fs.writeFileSync(full, content); }

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function cleanText(s=''){
  return s
    .replace(/^\s*---\s*$/gm,'')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}
function resolveHref(href=''){
  if(routeMap[href]) return routeMap[href];
  return href.replace(/\.md\b/g,'');
}
function mdInline(s){
  return cleanText(s)
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g,(_,txt,href)=>`<a href="${resolveHref(href)}">${txt}</a>`);
}
function linesToHtml(lines){
  let out=[]; let i=0;
  while(i<lines.length){
    let line=lines[i];
    if(/^\s*---\s*$/.test(line)){ i++; continue; }
    if(!line.trim()){ i++; continue; }
    if(/^### /.test(line)){ out.push(`<h3>${mdInline(line.replace(/^###\s+/,''))}</h3>`); i++; continue; }
    if(/^## /.test(line)){ out.push(`<h2>${mdInline(line.replace(/^##\s+/,''))}</h2>`); i++; continue; }
    if(/^- /.test(line)){
      const items=[];
      while(i<lines.length && /^- /.test(lines[i])){ items.push(`<li>${mdInline(lines[i].replace(/^-\s+/,''))}</li>`); i++; }
      out.push(`<ul>${items.join('')}</ul>`); continue;
    }
    if(/^\d+\. /.test(line)){
      const items=[];
      while(i<lines.length && /^\d+\. /.test(lines[i])){ items.push(`<li>${mdInline(lines[i].replace(/^\d+\.\s+/,''))}</li>`); i++; }
      out.push(`<ol>${items.join('')}</ol>`); continue;
    }
    let para=[line.trim()]; i++;
    while(i<lines.length && lines[i].trim() && !/^(##|###) /.test(lines[i]) && !/^[-]\s+/.test(lines[i]) && !/^\d+\.\s+/.test(lines[i])){ para.push(lines[i].trim()); i++; }
    out.push(`<p>${mdInline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}
function page({title,desc,body}){
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${esc(desc||'')}" /><link rel="stylesheet" href="${cssPath}"></head><body><header class="site-header"><div class="wrap nav"><div class="brand">Emprender en Álava<small>Con la experiencia de Grupo Vadillo</small></div><nav class="menu"><a href="${routeMap['/']}">Inicio</a><a href="${routeMap['/empieza']}">Empieza</a><a href="${routeMap['/impuestos']}">Impuestos</a><a href="${routeMap['/ayudas']}">Ayudas</a><a href="${routeMap['/recursos']}">Recursos</a><a href="${routeMap['/asesoria']}">Acompañamiento</a><a href="${routeMap['/contacto']}">Contacto</a></nav></div></header>${body}<footer class="footer"><div class="wrap foot"><div><strong>Claridad para empezar. Criterio para construir.</strong>Vitoria-Gasteiz · Álava · Euskadi</div><div><a href="${routeMap['/empieza']}">Por dónde empezar</a> · <a href="${routeMap['/recursos']}">Recursos</a> · <a href="${routeMap['/asesoria/asesoria-para-emprender-en-vitoria-gasteiz-y-alava']}">Acompañamiento</a> · <a href="${routeMap['/contacto']}">Contacto</a> · <a href="${routeMap['/quienes-somos']}">Quiénes somos</a></div></div></footer></body></html>`;
}
function extractBetween(text, start, end){ const a=text.indexOf(start); if(a<0) return ''; const b=end? text.indexOf(end,a+start.length) : -1; return text.slice(a+start.length, b<0?undefined:b).trim(); }
function extractField(text, label){ const m=text.match(new RegExp(`## ${label}\\n([\\s\\S]*?)(?:\\n## |$)`)); return m?m[1].trim():''; }
function buildArticle(srcFile, outFile){
  const t = read(srcFile);
  const title = cleanText(extractField(t,'Title SEO').replace(/\*\*/g,'')) || 'Emprender en Álava';
  const meta = cleanText(extractField(t,'Meta description').replace(/\*\*/g,''));
  const h1 = cleanText(extractField(t,'H1').replace(/\*\*/g,''));
  const bodyMd = cleanText(extractBetween(t,'# Artículo completo','## Ideas de enlazado interno') || extractBetween(t,'# Artículo completo','## Firma editorial recomendada') || extractBetween(t,'# Artículo completo',null));
  const cta = `<div class="cta-box"><h2>Si quieres seguir ordenando esto con criterio, aquí tienes el siguiente paso</h2><p>Puedes seguir leyendo y aclarando el recorrido por tu cuenta, o puedes ver cómo sería hacerlo con acompañamiento real desde el principio.</p><div class="actions"><a class="btn btn-primary" href="${routeMap['/asesoria/asesoria-para-emprender-en-vitoria-gasteiz-y-alava']}">Ver acompañamiento</a><a class="btn btn-secondary" href="${routeMap['/contacto']}">Ir a contacto</a></div></div>`;
  const html = `<main><section class="hero"><div class="wrap reading"><div class="eyebrow">Emprender en Álava</div><h1>${mdInline(h1)}</h1><p class="lead">${esc(meta)}</p></div></section><section class="content"><div class="wrap"><article>${linesToHtml(bodyMd.split(/\r?\n/))}${cta}</article></div></section></main>`;
  write(outFile, page({title,desc:meta,body:html}));
}
function buildHome(){
  const t = read('home-emprender-en-alava-adaptada.md');
  const get = (label)=>extractField(t,label).replace(/\*\*/g,'').trim();
  const guides = extractField(t,'Guías destacadas').split(/\n/).filter(Boolean).map(x=>x.replace(/^\d+\.\s*/,'').trim());
  const services = extractField(t,'Lista breve de servicios').split(/\n/).filter(x=>x.startsWith('- ')).map(x=>x.slice(2));
  const body = `<main>
<section class="hero"><div class="wrap hero-grid"><div><div class="eyebrow">${get('Marca / descriptor').split('\n')[0]||'Emprender en Álava'}</div><h1>${get('H1')}</h1><p class="lead">${get('Subtítulo')}</p><div class="actions"><a class="btn btn-primary" href="/empieza/como-empezar-a-emprender-en-vitoria-gasteiz-sin-ir-a-ciegas.html">${get('CTA principal')}</a><a class="btn btn-secondary" href="/asesoria/asesoria-para-emprender-en-vitoria-gasteiz-y-alava.html">${get('CTA secundaria')}</a></div></div><aside class="panel"><h3>${get('Título')}</h3><p>${extractField(t,'Texto').split('\n').slice(0,3).join(' ')}</p></aside></div></section>
<section class="section section-alt"><div class="wrap"><h2>Empieza por donde más falta te hace</h2><p class="intro">No todo el mundo está en el mismo punto. Así que no todo el mundo necesita la misma explicación.</p><div class="grid-3"><div class="card"><h3>Quiero emprender, pero no sé por dónde empezar</h3><p>Primeros pasos, orden lógico y decisiones básicas para no avanzar a ciegas.</p><div class="link-cta">Ver por dónde empezar</div></div><div class="card"><h3>Quiero hacerme autónomo y no meter la pata</h3><p>Alta, impuestos, obligaciones y errores frecuentes explicados desde cero.</p><div class="link-cta">Ver cómo empezar como autónomo</div></div><div class="card"><h3>Quiero entender ayudas y subvenciones sin perderme</h3><p>Qué puedes revisar, cómo prepararte y qué suele fallar cuando se improvisa.</p><div class="link-cta">Ver ayudas para emprender</div></div></div></div></section>
<section class="section"><div class="wrap"><h2>Antes de moverte, de darte de alta o de tomar decisiones, conviene entender bien unas cuantas cosas.</h2><div class="grid-2">${guides.slice(0,8).map(g=>`<div class="card"><h3>${mdInline(g)}</h3></div>`).join('')}</div></div></section>
<section class="section"><div class="wrap"><div class="content cta-box"><h2>Y cuando dejar de hacerlo solo tenga sentido, podemos acompañarte</h2><p>${extractField(t,'Texto').split('\n').slice(-3).join(' ')}</p><ul>${services.map(s=>`<li>${mdInline(s)}</li>`).join('')}</ul><div class="actions"><a class="btn btn-primary" href="/asesoria/asesoria-para-emprender-en-vitoria-gasteiz-y-alava.html">Ver cómo os encargáis del acompañamiento</a><a class="btn btn-secondary" href="/contacto/index.html">Ir a contacto</a></div></div></div></section>
</main>`;
  write('index.html', page({title:'Emprender en Álava | Guías claras y acompañamiento real',desc:get('Subtítulo'),body}));
}
function buildServicePage(sectionTitle, outFile, title, subtitle, bodyStartLabel, cta1, cta2){
  const t = read('sistema-comercial-estructural-final-adaptado.md');
  const sec = extractBetween(t, `# ${sectionTitle}`, '\n---\n\n# ');
  const content = linesToHtml(sec.split(/\r?\n/).filter(l=>!/^## URL recomendada|^## Title SEO|^## H1|^## Subtítulo|^## CTA principal|^## CTA secundaria/.test(l)));
  const body = `<main><section class="hero"><div class="wrap reading"><div class="eyebrow">Acompañamiento</div><h1>${title}</h1><p class="lead">${subtitle}</p></div></section><section class="content"><div class="wrap"><article>${content}<div class="cta-box"><h2>${cta1}</h2><p>${cta2}</p><div class="actions"><a class="btn btn-primary" href="/contacto/index.html">Quiero contaros mi caso</a></div></div></article></div></section></main>`;
  write(outFile, page({title:`${title} | Emprender en Álava`,desc:subtitle,body}));
}

function buildHub(outFile, eyebrow, title, intro, items){
  const body = `<main><section class="hero"><div class="wrap reading"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="lead">${intro}</p></div></section><section class="section"><div class="wrap"><div class="grid-2">${items.map(i=>`<div class="card"><h3><a href="${resolveHref(i.href)}">${i.title}</a></h3><p>${i.text}</p></div>`).join('')}</div></div></section></main>`;
  write(outFile, page({title:`${title} | Emprender en Álava`, desc:intro, body}));
}
function buildSimpleContentPage(outFile, eyebrow, title, subtitle, html){
  const body = `<main><section class="hero"><div class="wrap reading"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="lead">${subtitle}</p></div></section><section class="content"><div class="wrap"><article>${html}</article></div></section></main>`;
  write(outFile, page({title:`${title} | Emprender en Álava`, desc:subtitle, body}));
}

buildHome();
buildArticle('pagina-madre-empezar-emprender-vitoria-adaptada.md','empieza/como-empezar-a-emprender-en-vitoria-gasteiz-sin-ir-a-ciegas.html');
buildArticle('pagina-madre-hacerse-autonomo-alava-adaptada.md','empieza/como-hacerse-autonomo-en-alava.html');
buildArticle('satelite-que-necesitas-antes-del-alta-autonomo-adaptado.md','empieza/que-necesitas-antes-de-darte-de-alta-como-autonomo.html');
buildArticle('pagina-madre-impuestos-autonomo-adaptada.md','impuestos/que-impuestos-paga-un-autonomo-cuando-empieza.html');
buildArticle('pagina-madre-ayudas-emprender-vitoria-alava-adaptada.md','ayudas/ayudas-para-emprender-en-vitoria-gasteiz-y-alava.html');
buildArticle('recurso-checklist-empezar-sin-ir-a-ciegas-adaptado.md','recursos/checklist-para-empezar-sin-ir-a-ciegas.html');
buildArticle('satelite-ticketbai-alava-adaptado.md','impuestos/ticketbai-en-alava-lo-que-debes-entender-desde-el-principio.html');
buildArticle('pagina-madre-autonomo-o-sl-adaptada.md','decisiones-clave/autonomo-o-sl-que-te-conviene.html');
buildArticle('satelite-iva-para-principiantes-adaptado.md','impuestos/iva-para-principiantes-que-es-y-cuando-te-afecta.html');
buildArticle('satelite-irpf-autonomos-adaptado.md','impuestos/irpf-para-autonomos-explicado-sin-jerga.html');
buildArticle('satelite-gastos-deducibles-adaptado.md','impuestos/gastos-deducibles-que-suele-entenderse-mal.html');
buildArticle('satelite-calendario-obligaciones-adaptado.md','recursos/calendario-basico-de-obligaciones-para-quien-empieza.html');
buildArticle('satelite-certificado-digital-adaptado.md','recursos/certificado-digital-por-que-te-conviene-resolverlo-cuanto-antes.html');
buildArticle('pagina-madre-errores-emprender-adaptada.md','errores/errores-frecuentes-al-empezar-un-negocio.html');
buildArticle('satelite-facturar-sin-orden-adaptado.md','errores/que-pasa-si-empiezas-a-facturar-sin-orden.html');
buildArticle('satelite-ayudas-sin-perder-tiempo-adaptado.md','ayudas/como-prepararte-para-pedir-ayudas-sin-perder-tiempo.html');
buildArticle('satelite-elegir-buena-asesoria-adaptado.md','acompanamiento/en-que-fijarte-para-elegir-una-buena-asesoria-al-empezar.html');
buildArticle('satelite-que-deberia-darte-una-buena-asesoria-adaptado.md','acompanamiento/que-deberia-darte-una-buena-asesoria-al-empezar-y-cuando-cambiar.html');
buildServicePage('3. Página principal de asesoría','asesoria/asesoria-para-emprender-en-vitoria-gasteiz-y-alava.html','Asesoría para emprender en Vitoria-Gasteiz y Álava','No te ayudamos solo a presentar papeles. Te ayudamos a empezar con una base bien hecha para que tu negocio no dependa de improvisar desde el primer mes.','','Quiero empezar con criterio y ver si encaja vuestro acompañamiento','Ver cómo me podéis acompañar desde el arranque');
buildServicePage('4. Alta y acompañamiento para autónomos','asesoria/alta-y-acompanamiento-para-autonomos.html','Alta y acompañamiento para autónomos','Darte de alta no debería ser un salto a ciegas. Te ayudamos a resolver el arranque con orden para que no conviertas el primer mes en una suma de dudas.','','Quiero que me ayudéis a resolver el alta sin empezar torcido','Ver cómo me acompañáis antes y después del alta');
buildServicePage('5. Asesoría para pequeños negocios','asesoria/asesoria-para-pequenos-negocios.html','Asesoría para pequeños negocios que necesitan algo más que presentación de impuestos','Si tienes un negocio pequeño, el problema no suele ser solo fiscal. Suele ser la suma de facturación, TicketBAI, calendario, personal, papeles y decisiones pequeñas que te roban foco todos los meses.','','Quiero ver si podéis ayudarme a llevar bien la base del negocio','Ver cómo podéis acompañar a un pequeño negocio');
buildServicePage('6. Cambio de asesoría','asesoria/cambio-de-asesoria-para-negocios-de-menos-de-3-anos.html','Cambio de asesoría para negocios de menos de 3 años','A veces no necesitas una asesoría más sofisticada. Necesitas una asesoría que por fin te responda, te explique y te quite peso de verdad.','','Quiero valorar si tiene sentido cambiar y hacerlo con orden','Ver cómo sería un cambio de asesoría bien acompañado');
buildServicePage('7. Página de becas','asesoria/becas-para-emprender-con-nosotros.html','Becas para ayudarte a empezar o cambiar sin cargar todo el coste desde el primer día','Si ya bastante exige emprender, tiene sentido que el acceso al acompañamiento no añada una barrera más desde el minuto uno.','','Quiero entender si alguna de estas becas encaja conmigo','Ver condiciones de las becas y del acompañamiento');

const contactHtml = `
<h2>Cuéntanos en qué punto estás</h2>
<p>Puedes escribirnos si todavía estás intentando entender por dónde empezar, si vas a darte de alta ya o si ya tienes negocio y quieres que esto deje de pesarte tanto.</p>
<div class="grid-2">
<div class="card"><h3>Contacto directo</h3><p><strong>WhatsApp:</strong> +595 986 294236<br><strong>Teléfono:</strong> 945 22 27 62<br><strong>Email:</strong> info@grupovadillo.com</p><div class="actions"><a class="btn btn-whatsapp" href="https://wa.me/595986294236" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a></div><p><strong>Horario:</strong><br>Lunes a jueves: 09:00–17:00<br>Viernes: 08:00–15:00</p></div>
<div class="card"><h3>Cuéntanos esto en tu mensaje</h3><ul><li>Nombre</li><li>Teléfono o email</li><li>En qué punto estás</li><li>Qué te preocupa ahora mismo</li></ul></div>
</div>
<h2>Oficinas a destacar</h2>
<ul><li>Pintor Díaz de Olano 18 · 01008 Vitoria-Gasteiz</li><li>Paduleta 55 (Polígono Industrial de Júndiz) · 01015 Vitoria-Gasteiz</li><li>Travesía Páganos 45 · 01300 Laguardia</li><li>Calle de la Virgen Blanca 11 · 01320 Oyón</li></ul>
<div class="cta-box"><h2>Quiero contaros mi caso</h2><p>Si prefieres empezar por una guía antes de escribirnos, también puedes hacerlo.</p><div class="actions"><a class="btn btn-primary" href="${routeMap['/empieza/como-empezar-a-emprender-en-vitoria-gasteiz-sin-ir-a-ciegas']}">Ver por dónde empezar</a><a class="btn btn-secondary" href="${routeMap['/asesoria/asesoria-para-emprender-en-vitoria-gasteiz-y-alava']}">Ver acompañamiento</a></div></div>`;
buildSimpleContentPage('contacto/index.html','Contacto','Cuéntanos en qué punto estás y te ayudamos a ordenar el siguiente paso','Puedes escribirnos si todavía estás intentando entender por dónde empezar, si vas a darte de alta ya o si ya tienes negocio y quieres que esto deje de pesarte tanto.',contactHtml);

const quienesHtml = `
<p>Detrás de este proyecto está Grupo Vadillo Asesores, una empresa familiar creada en 1949 que ha evolucionado desde la mediación aseguradora hacia la gestoría, la asesoría y la consultoría.</p>
<p>Eso importa por una razón muy simple: una cosa es saber teoría empresarial. Otra muy distinta es haber acompañado empresas reales, pequeños negocios y autónomos durante años.</p>
<h2>Qué diferencia este enfoque</h2>
<ul><li>traducir el sistema a lenguaje humano,</li><li>ordenar decisiones,</li><li>reducir niebla,</li><li>y ayudar a empezar con criterio antes de hablar de contratar nada.</li></ul>
<h2>Qué hay detrás del equipo</h2>
<ul><li>fiscal-contable,</li><li>laboral,</li><li>jurídica,</li><li>seguros,</li><li>y acompañamiento operativo.</li></ul>
<div class="cta-box"><h2>Por fin alguien me está explicando esto bien</h2><p>Ese es el efecto que debería dejar esta web. Y si quieres llevarlo al terreno práctico, aquí también podemos acompañarte.</p><div class="actions"><a class="btn btn-primary" href="${routeMap['/asesoria/asesoria-para-emprender-en-vitoria-gasteiz-y-alava']}">Quiero ver cómo podéis acompañarme</a></div></div>`;
buildSimpleContentPage('quienes-somos/index.html','Quiénes somos','No venimos de estudiar empresas desde fuera. Venimos de acompañarlas desde dentro.','Emprender en Álava nace desde la experiencia real de Grupo Vadillo para explicar mejor lo que casi nadie traduce bien cuando alguien decide emprender.',quienesHtml);

buildHub('empieza/index.html','Empieza','Si ahora mismo sientes más niebla que claridad, empieza aquí.','Aquí tienes el orden básico, las primeras decisiones y las preguntas que conviene responder antes de mover un papel.',[
  {href:'/empieza/como-empezar-a-emprender-en-vitoria-gasteiz-sin-ir-a-ciegas',title:'Cómo empezar a emprender en Vitoria-Gasteiz sin ir a ciegas',text:'La puerta de entrada principal para ordenar el arranque.'},
  {href:'/empieza/como-hacerse-autonomo-en-alava',title:'Cómo hacerse autónomo en Álava',text:'Alta, orden y errores básicos explicados con claridad.'},
  {href:'/empieza/que-necesitas-antes-de-darte-de-alta-como-autonomo',title:'Qué necesitas antes de darte de alta como autónomo',text:'La pieza previa al paso formal.'},
  {href:'/decisiones-clave/autonomo-o-sl-que-te-conviene',title:'Autónomo o SL: qué te conviene de verdad',text:'Comparativa para una de las decisiones más delicadas del arranque.'},
  {href:'/recursos/checklist-para-empezar-sin-ir-a-ciegas',title:'Checklist para empezar sin ir a ciegas',text:'Recurso práctico para autoevaluarte antes de moverte.'}
]);

buildHub('impuestos/index.html','Impuestos','No necesitas aprender a hablar como Hacienda. Necesitas entender qué te afecta de verdad.','Base fiscal explicada en lenguaje humano para alguien que empieza.',[
  {href:'/impuestos/que-impuestos-paga-un-autonomo-cuando-empieza',title:'Qué impuestos paga un autónomo cuando empieza',text:'La madre fiscal de entrada.'},
  {href:'/impuestos/iva-para-principiantes-que-es-y-cuando-te-afecta',title:'IVA para principiantes',text:'Qué es y cuándo te afecta de verdad.'},
  {href:'/impuestos/irpf-para-autonomos-explicado-sin-jerga',title:'IRPF para autónomos',text:'Explicado sin jerga innecesaria.'},
  {href:'/impuestos/gastos-deducibles-que-suele-entenderse-mal',title:'Gastos deducibles',text:'Lo que más se suele entender mal al empezar.'},
  {href:'/impuestos/ticketbai-en-alava-lo-que-debes-entender-desde-el-principio',title:'TicketBAI en Álava',text:'Lo que debes entender desde el principio.'}
]);

buildHub('ayudas/index.html','Ayudas','El problema no suele ser que no existan ayudas. El problema suele ser llegar a ellas sin proyecto, sin orden o fuera de fase.','Esta sección está pensada para ordenar, no para perseguir convocatorias a ciegas.',[
  {href:'/ayudas/ayudas-para-emprender-en-vitoria-gasteiz-y-alava',title:'Ayudas para emprender en Vitoria-Gasteiz y Álava',text:'La pieza madre para filtrar si realmente te encajan.'},
  {href:'/ayudas/como-prepararte-para-pedir-ayudas-sin-perder-tiempo',title:'Cómo prepararte para pedir ayudas sin perder tiempo',text:'La pieza práctica para llegar mejor preparado.'}
]);

buildHub('recursos/index.html','Recursos','Recursos para que el arranque no dependa solo de tu memoria, de tu intuición o del susto de última hora.','Piezas prácticas de apoyo para ordenar el inicio.',[
  {href:'/recursos/checklist-para-empezar-sin-ir-a-ciegas',title:'Checklist para empezar sin ir a ciegas',text:'Autodiagnóstico y orden antes de moverte.'},
  {href:'/recursos/calendario-basico-de-obligaciones-para-quien-empieza',title:'Calendario básico de obligaciones',text:'Para entender qué ritmo tendrás que sostener.'},
  {href:'/recursos/certificado-digital-por-que-te-conviene-resolverlo-cuanto-antes',title:'Certificado digital',text:'Por qué te conviene resolverlo cuanto antes.'}
]);

buildHub('asesoria/index.html','Acompañamiento','Cuando dejar de hacerlo solo tenga sentido, aquí tienes la parte de acompañamiento explicada sin humo y sin prometerte milagros.','Servicios pensados para emprender con más orden, foco y criterio.',[
  {href:'/asesoria/asesoria-para-emprender-en-vitoria-gasteiz-y-alava',title:'Asesoría para emprender en Vitoria-Gasteiz y Álava',text:'Servicio troncal de conversión templada.'},
  {href:'/asesoria/alta-y-acompanamiento-para-autonomos',title:'Alta y acompañamiento para autónomos',text:'Resolver el alta sin empezar torcido.'},
  {href:'/asesoria/asesoria-para-pequenos-negocios',title:'Asesoría para pequeños negocios',text:'Para cuando el negocio ya tiene operativa real y más peso detrás.'}
]);
console.log('phase1 built');
