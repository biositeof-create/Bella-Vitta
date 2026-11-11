/* ===== Estado ===== */
let cfg = JSON.parse(JSON.stringify(DEFAULT_CFG));
let produtos = DEFAULT_PRODS.slice();
let prodsDb = [];
let carregando = true;
let semeado = false;
let fotosMap = {};
const store = { db: null };
const state = { q: 0, resp: {}, result: null, filtro: null, fixar: false, prod: null, cor: -2, tam: '' };
const admin = { logado: false, aba: 'produtos', edit: null, confirmar: null, foto: '', fotos: [], cores: [], tams: [], linkFoto: undefined };
const app = document.getElementById('app');
try { admin.logado = sessionStorage.getItem('bella-adm') === '1'; } catch (e) {}

/* ===== Utilidades ===== */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).replace(',00', '');
const temPreco = p => typeof p.preco === 'number' && isFinite(p.preco) && p.preco >= 0;
const precoTxt = p => temPreco(p) ? brl(p.preco) : 'Consulte';
const wa = t => `https://wa.me/${esc(cfg.whatsapp)}?text=${encodeURIComponent(t)}`;
const urlOk = u => /^https?:\/\//i.test(u);
const corOk = c => /^#[0-9a-fA-F]{6}$/.test(c) ? c : '#D9B8A3';
const fotoOk = f => typeof f === 'string' && (f.startsWith('data:image/') || f.startsWith('assets/img/')) ? f : '';
const CAT_IMG = { blusa: 't1', calca: 't2', vestido: 't3', conjunto: 't4', todos: 't5' };
const DEF_SLOT = { hero: 'hero', sobre: 'hero', quiz: 't5', bn1: 'hero', bn2: 't3', bn3: 't2' };
const fotoSlot = k => fotoOk(fotosMap[k]) || (k === 'hero' && fotoOk(cfg.heroFoto)) || (k.startsWith('cat_') ? IMG[CAT_IMG[k.slice(4)]] : IMG[DEF_SLOT[k]]) || '';
const fotoLink = id => fotoOk(fotosMap['link-' + id]);
const TAMS = ['PP', 'P', 'M', 'G', 'GG', 'Plus'];
const MAX_FOTOS = 8;
const tiposAll = () => { const t = { ...TIPOS }; (cfg.cats || []).forEach(c => { if (c && c.k) t[c.k] = c.nome; }); return t; };
const filtrosAll = () => { const f = { ...FILTROS }; (cfg.cats || []).forEach(c => { if (c && c.k) f[c.k] = c.nome; }); return f; };
const fotosGerais = p => (Array.isArray(p.fotos) && p.fotos.length ? p.fotos : (p.foto ? [p.foto] : [])).filter(fotoOk);
const coresProd = p => (Array.isArray(p.cores) ? p.cores : []).filter(c => c && c.nome);
const fotosCor = (p, i) => { const c = coresProd(p)[i]; return c ? (c.fotos || []).filter(fotoOk) : []; };
const capaProd = p => fotosGerais(p)[0] || coresProd(p).map(c => (c.fotos || []).filter(fotoOk)[0]).find(Boolean) || '';
const capaTipo = k => { const p = produtos.find(x => x.tipo === k && capaProd(x)); return p ? capaProd(p) : ''; };
const prodAtual = () => produtos.find(x => x.id === state.prod);
const PROP_PROD = { ar: '4 / 5', prop: '4:5 (vertical)', px: '800 × 1000 px' };
const PROP_LINK = { ar: '3 / 1', prop: '3:1 (faixa horizontal)', px: '1200 × 400 px' };
const CARD_TXT = 'Card pequeno da página inicial. O texto fica no lado direito, então deixe o assunto da foto no lado esquerdo.';
const catSlot = (k, n, onde) => ({ g: 'Categorias', k: 'cat_' + k, t: 'Categoria: ' + n, onde: 'Bolinha "' + n + '" em "Compre por categoria" na página inicial' + onde + '.', ar: '3 / 4', prop: '3:4 (vertical)', px: '600 × 800 px', w: '130px', max: 800, lim: 80000 });
const SLOTS = [  /* g = grupo na aba Fotos */
  { g: 'Página inicial', k: 'hero', t: 'Capa da página inicial', onde: 'Foto grande no topo da página inicial. A parte de baixo some suavemente atrás do nome da loja.', ar: '5 / 4', prop: '5:4 (horizontal, quase quadrada)', px: '1000 × 800 px', w: '260px', max: 1000, lim: 170000 },
  { g: 'Página inicial', k: 'quiz', t: 'Card do quiz', onde: 'Card grande "Qual é o seu estilo?" na página inicial. O texto fica na parte de baixo, então o assunto da foto deve ficar em cima.', ar: '4 / 3', prop: '4:3 (horizontal)', px: '1200 × 900 px', w: '260px', max: 1000, lim: 150000 },
  { g: 'Página inicial', k: 'bn1', t: 'Card "Conheça a loja"', onde: CARD_TXT, ar: '3 / 1', prop: '3:1 (faixa horizontal)', px: '1200 × 400 px', w: '100%', max: 900, lim: 80000 },
  { g: 'Página inicial', k: 'bn2', t: 'Card "Catálogo de peças"', onde: CARD_TXT, ar: '3 / 1', prop: '3:1 (faixa horizontal)', px: '1200 × 400 px', w: '100%', max: 900, lim: 80000 },
  { g: 'Página inicial', k: 'bn3', t: 'Card "WhatsApp"', onde: CARD_TXT, ar: '3 / 1', prop: '3:1 (faixa horizontal)', px: '1200 × 400 px', w: '100%', max: 900, lim: 80000 },
  { g: 'Página Sobre', k: 'sobre', t: 'Capa da página Sobre', onde: 'Topo da página "Conheça a loja". O título e os botões ficam na parte de baixo da foto.', ar: '4 / 5', prop: '4:5 (vertical)', px: '800 × 1000 px', w: '190px', max: 900, lim: 150000 },
  catSlot('blusa', 'Blusas', ' e também na página Sobre'),
  catSlot('calca', 'Calças', ' e também na página Sobre'),
  catSlot('vestido', 'Vestidos', ' e também na página Sobre'),
  catSlot('conjunto', 'Conjuntos', ' e também na página Sobre'),
  catSlot('todos', 'Ver tudo', ' e também na página Sobre')
];
const S = () => ({ ...DEFAULT_SOBRE, ...(cfg.sobre || {}) });
const linhas = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);
const paras = s => linhas(s).map(l => `<p>${esc(l)}</p>`).join('');
const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  setaCta: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  zap: svg('<path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5z"/>'),
  cadeado: svg('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>')
};
const LOGO = `<svg class="logo" viewBox="0 0 120 92" role="img" aria-label="Logo Bella Vitta"><path d="M60 38 V31 C60 26 69 25 69 17 A9 9 0 1 0 51 17" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M60 38 L12 74 Q5 80 14 80 H106 Q115 80 108 74 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><text x="60" y="72" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-size="30" font-weight="600" fill="currentColor">BV</text></svg>`;

function arte(p) {
  const f = capaProd(p);
  if (f) return `<img src="${f}" alt="${esc(p.nome)}" loading="lazy">`;
  return `<svg viewBox="0 0 100 120" role="img" aria-label="${esc(p.nome)}"><path d="${FORMAS[p.tipo] || FORMAS.vestido}" fill="${corOk(p.cor)}" stroke="currentColor" stroke-opacity=".35" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
}
function aviso(texto, erro) {
  const t = document.createElement('div');
  t.className = 'toast' + (erro ? ' erro' : '');
  t.setAttribute('role', 'status');
  t.textContent = texto;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3800);
}
async function sha(txt) {
  const b = new TextEncoder().encode('luma-adm:' + txt);
  const h = await crypto.subtle.digest('SHA-256', b);
  return Array.from(new Uint8Array(h)).map(x => x.toString(16).padStart(2, '0')).join('');
}
function soDigitos(s) { return String(s || '').replace(/\D/g, ''); }
function fmtTel(d) {
  d = soDigitos(d);
  if (d.startsWith('55') && d.length >= 12) {
    const n = d.slice(2), ddd = n.slice(0, 2), r = n.slice(2);
    return r.length >= 9 ? `(${ddd}) ${r.slice(0, 5)}-${r.slice(5)}` : `(${ddd}) ${r.slice(0, 4)}-${r.slice(4)}`;
  }
  return d;
}
function reduzirFoto(file, max, limite, ar) {
  return new Promise((ok, falha) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (ar) { /* corta no centro para a proporção do espaço (largura / altura) */
        if (sw / sh > ar) { sw = Math.round(sh * ar); sx = Math.round((img.width - sw) / 2); }
        else { sh = Math.round(sw / ar); sy = Math.round((img.height - sh) / 2); }
      }
      const k = Math.min(1, max / Math.max(sw, sh));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(sw * k));
      c.height = Math.max(1, Math.round(sh * k));
      c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      let q = 0.8, d = c.toDataURL('image/jpeg', q);
      while (d.length > limite && q > 0.4) { q -= 0.1; d = c.toDataURL('image/jpeg', q); }
      ok(d);
    };
    img.onerror = () => { URL.revokeObjectURL(url); falha(new Error('imagem')); };
    img.src = url;
  });
}
const razao = s => { const [a, b] = String(s).split('/').map(Number); return a / b; };

/* ===== Armazenamento: banco compartilhado quando existe; senão, só neste navegador ===== */
const LS = 'bella-bio-demo-v1';
function carregarLocal() {
  try {
    const raw = localStorage.getItem(LS);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d && d.cfg) { cfg = { ...DEFAULT_CFG, ...d.cfg }; semeado = !!cfg.iniciado; }
    if (d && Array.isArray(d.produtos)) produtos = d.produtos;
    if (d && d.fotos && typeof d.fotos === 'object') fotosMap = d.fotos;
  } catch (e) {}
}
function salvarLocal() {
  try { localStorage.setItem(LS, JSON.stringify({ cfg, produtos, fotos: fotosMap })); return true; }
  catch (e) { return false; }
}
function recalcular() {
  produtos = (cfg.iniciado ? prodsDb : DEFAULT_PRODS).slice().sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  if (state.result) state.result = calcular(state.resp);
  refrescar();
}
async function iniciarArmazenamento() {
  let db = null;
  try { db = window.claude && window.claude.use ? await window.claude.use('db') : null; } catch (e) { db = null; }
  if (!db) { carregarLocal(); carregando = false; rotear(); return; }
  store.db = db;
  const limite = setTimeout(() => { if (carregando) { carregando = false; refrescar(); } }, 8000);
  const erro = () => { clearTimeout(limite); if (carregando) { carregando = false; refrescar(); } };
  db.doc('config/site').onSnapshot(s => {
    clearTimeout(limite);
    cfg = s.exists ? { ...DEFAULT_CFG, ...s.data() } : JSON.parse(JSON.stringify(DEFAULT_CFG));
    semeado = !!cfg.iniciado;
    carregando = false;
    recalcular();
  }, erro);
  db.collection('fotos').onSnapshot(s => {
    const m = {};
    s.docs.forEach(d => { const v = d.data() || {}; if (v.data) m[d.id] = v.data; });
    fotosMap = m;
    refrescar();
  }, erro);
  db.collection('produtos').onSnapshot(s => {
    prodsDb = s.docs.map(d => ({ ...d.data(), id: d.id }));
    recalcular();
  }, erro);
}
async function semear() {
  if (!store.db || semeado) return;
  for (const p of DEFAULT_PRODS) await store.db.doc('produtos/' + p.id).set(p);
  await store.db.doc('config/site').set({ ...cfg, iniciado: true });
  semeado = true;
}
async function gravarFotoDoc(k, data) {
  if (store.db) {
    if (data) await store.db.doc('fotos/' + k).set({ data }); else await store.db.doc('fotos/' + k).delete();
    const m = { ...fotosMap }; if (data) m[k] = data; else delete m[k]; fotosMap = m;
    return;
  }
  const antes = fotosMap, m = { ...fotosMap };
  if (data) m[k] = data; else delete m[k];
  fotosMap = m;
  if (!salvarLocal()) { fotosMap = antes; throw new Error('local'); }
}
async function gravarProduto(p) {
  if (store.db) { await semear(); await store.db.doc('produtos/' + p.id).set(p); return; }
  const i = produtos.findIndex(x => x.id === p.id);
  const novo = produtos.slice();
  if (i >= 0) novo[i] = p; else novo.push(p);
  const antes = produtos; produtos = novo;
  if (!salvarLocal()) { produtos = antes; throw new Error('local'); }
}
async function excluirProduto(id) {
  if (store.db) { await semear(); await store.db.doc('produtos/' + id).delete(); return; }
  const antes = produtos;
  produtos = produtos.filter(x => x.id !== id);
  if (!salvarLocal()) { produtos = antes; throw new Error('local'); }
}
async function gravarCfg(novo) {
  if (store.db) { await semear(); await store.db.doc('config/site').set({ ...novo, iniciado: true }); return; }
  const antes = cfg; cfg = { ...novo };
  if (!salvarLocal()) { cfg = antes; throw new Error('local'); }
}
function msgErroGravar() {
  if (store.db) return 'Não foi possível salvar. Neste ambiente de teste só quem tem permissão de edição consegue salvar.';
  return 'Não foi possível salvar neste navegador. Tente uma foto menor.';
}

/* ===== Quiz ===== */
function pontos(p, a) {
  let s = 0;
  if (p.estilo === a.estilo) s += 4;
  if (p.corCat === a.cor) s += 3;
  if (p.ocasiao === a.ocasiao) s += 2;
  if (p.caimento === a.caimento) s += 1.5;
  if (!temPreco(p)) s += 1.5;
  else if (p.preco <= a.orc) s += 1.5;
  else if (p.preco <= a.orc * 1.2) s += 0.5;
  return s;
}
const MAX_PONTOS = 12;
function calcular(a) {
  const ranking = produtos
    .map(p => ({ p, pct: Math.round(pontos(p, a) / MAX_PONTOS * 100) }))
    .sort((x, y) => y.pct - x.pct || (x.p.preco || 0) - (y.p.preco || 0));
  return { a, ranking, persona: PERSONA[a.estilo], corFrase: COR_FRASE[a.cor] };
}

function setView(html, keep) {
  app.innerHTML = `<div class="view"${keep ? ' style="animation:none"' : ''}>${html}</div>`;
  if (keep) return;
  window.scrollTo(0, 0);
  const h = app.querySelector('[data-foco]');
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}
const botaoAdm = (extra) => `<a class="adm${extra ? ' ' + extra : ''}" href="#adm" aria-label="Administração">${ICO.cadeado} ADM</a>`;
const topo = esq => `<div class="topbar">${esq || ''}${botaoAdm()}</div>`;
