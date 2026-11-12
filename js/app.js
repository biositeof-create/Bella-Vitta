/* ===== Navegação ===== */
const ROTAS = ['inicio', 'sobre', 'quiz', 'resultado', 'catalogo', 'produto', 'adm'];
let rotaAnterior = null;
const rotaAtual = () => { const r = (location.hash || '#inicio').slice(1); return ROTAS.includes(r) ? r : 'inicio'; };

function rotear() {
  const rota = rotaAtual();
  if (rota === 'resultado' && !state.result) { location.hash = '#quiz'; return; }
  if (rota === 'produto' && !carregando && !prodAtual()) { location.hash = '#catalogo'; return; }
  if (rota === 'quiz' && rotaAnterior !== 'quiz') { state.q = 0; state.resp = {}; }
  if (rota === 'catalogo' && rotaAnterior !== 'catalogo') { if (!state.fixar) state.filtro = null; state.fixar = false; }
  if (rota === 'adm' && rotaAnterior !== 'adm') { admin.edit = null; admin.aba = 'produtos'; admin.confirmar = null; admin.linkFoto = undefined; }
  rotaAnterior = rota;
  document.getElementById('barra').hidden = true; document.body.classList.remove('has-barra');
  if (carregando) return telaCarregando();
  ({ inicio: telaInicio, sobre: telaSobre, quiz: telaQuiz, resultado: telaResultado, catalogo: telaCatalogo, produto: telaProduto, adm: telaAdm })[rota]();
}
window.addEventListener('hashchange', rotear);

/* Atualiza a tela quando os dados mudam, sem apagar o que a pessoa está digitando. */
function refrescar() {
  const rota = rotaAtual();
  if (carregando) return;
  if (rota === 'quiz') return;
  if (rota === 'adm') { if (admin.logado && !admin.edit && admin.aba !== 'sobre' && admin.aba !== 'ajustes' && admin.aba !== 'categorias') telaAdm(true); return; }
  if (rota === 'resultado' && !state.result) return;
  if (rota === 'produto' && !prodAtual()) { location.hash = '#catalogo'; return; }
  ({ inicio: telaInicio, sobre: telaSobre, resultado: telaResultado, catalogo: telaCatalogo, produto: telaProduto })[rota](true);
}

/* ===== Eventos ===== */
app.addEventListener('click', e => {
  const t = e.target;
  const pr = t.closest('[data-prod]');
  if (pr) { state.prod = pr.dataset.prod; state.cor = -2; state.tam = ''; return; }
  if (t.closest('[data-voltar-cat]')) { state.fixar = true; return; }
  const sc = t.closest('[data-cor]');
  if (sc && !t.closest('form')) { state.cor = Number(sc.dataset.cor); telaProduto(true); return; }
  const st = t.closest('[data-tam]');
  if (st) {
    state.tam = state.tam === st.dataset.tam ? '' : st.dataset.tam;
    app.querySelectorAll('[data-tam]').forEach(b => { const on = b.dataset.tam === state.tam; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    const buy = document.getElementById('pd-buy'), p = prodAtual();
    if (buy && p) buy.href = wa(msgCompra(p));
    return;
  }
  const th = t.closest('[data-thumb]');
  if (th) { const tr = document.getElementById('gal-track'); if (tr) tr.scrollTo({ left: Number(th.dataset.thumb) * tr.clientWidth, behavior: 'smooth' }); return; }
  const rmf = t.closest('[data-rm-foto]');
  if (rmf) { syncCores(); admin.fotos.splice(Number(rmf.dataset.rmFoto), 1); renderMidia(); return; }
  const rmc = t.closest('[data-rm-cor]');
  if (rmc) { syncCores(); admin.cores.splice(Number(rmc.dataset.rmCor), 1); renderMidia(); return; }
  if (t.closest('[data-add-cor]')) { syncCores(); admin.cores.push({ nome: '', hex: '#1E1E22', fotos: [] }); renderMidia(); const n = document.getElementById('c-nome-' + (admin.cores.length - 1)); if (n) n.focus(); return; }
  const rmcf = t.closest('button.mf-x');
  if (rmcf) {
    const at = Array.from(rmcf.attributes).find(a => a.name.startsWith('data-rm-cfoto-'));
    if (at) { syncCores(); const ci = Number(at.name.slice('data-rm-cfoto-'.length)); if (admin.cores[ci]) admin.cores[ci].fotos.splice(Number(at.value), 1); renderMidia(); return; }
  }
  const dcat = t.closest('[data-del-cat]');
  if (dcat) { admin.confirmar = 'cat-' + dcat.dataset.delCat; telaAdm(true); return; }
  const dcats = t.closest('[data-del-cat-sim]');
  if (dcats) {
    const k = dcats.dataset.delCatSim;
    admin.confirmar = null;
    gravarCfg({ ...cfg, cats: (cfg.cats || []).filter(c => c.k !== k) }).then(() => { aviso('Categoria excluída.'); telaAdm(true); }).catch(err => aviso(msgErroGravar(err), true));
    return;
  }
  const pick = t.closest('[data-pick]');
  if (pick) {
    const q = PERGUNTAS[state.q];
    state.resp[q.chave] = q.opcoes[Number(pick.dataset.pick)].v;
    app.querySelectorAll('.opt').forEach(b => b.classList.toggle('on', b === pick));
    setTimeout(() => {
      if (state.q < PERGUNTAS.length - 1) { state.q += 1; telaQuiz(); }
      else { state.result = calcular(state.resp); state.filtro = null; location.hash = '#resultado'; }
    }, 220);
    return;
  }
  if (t.closest('[data-back]')) {
    if (state.q === 0) location.hash = '#inicio'; else { state.q -= 1; telaQuiz(); }
    return;
  }
  const cl = t.closest('[data-catlink]');
  if (cl) { state.filtro = cl.dataset.catlink; state.fixar = true; return; }
  const f = t.closest('[data-filtro]');
  if (f) { state.filtro = f.dataset.filtro; telaCatalogo(true); return; }
  if (t.closest('[data-meu]')) { state.filtro = 'voce'; state.fixar = true; return; }

  /* ADM */
  const aba = t.closest('[data-aba]');
  if (aba) { admin.aba = aba.dataset.aba; admin.confirmar = null; telaAdm(true); return; }
  if (t.closest('[data-sair]')) {
    admin.logado = false; admin.edit = null;
    try { sessionStorage.removeItem('bella-adm'); } catch (x) {}
    location.hash = '#inicio'; return;
  }
  if (t.closest('[data-cancelar]')) { admin.edit = null; admin.foto = ''; admin.fotos = []; admin.cores = []; admin.tams = []; admin.linkFoto = undefined; telaAdm(true); window.scrollTo(0, 0); return; }
  if (t.closest('[data-novo-prod]')) { admin.edit = { tipo: 'produto', id: null }; admin.foto = ''; admin.fotos = []; admin.cores = []; admin.tams = []; telaAdm(); return; }
  const ep = t.closest('[data-edit-prod]');
  if (ep) { const p = produtos.find(x => x.id === ep.dataset.editProd); admin.edit = { tipo: 'produto', id: ep.dataset.editProd }; admin.foto = p ? fotoOk(p.foto) : ''; admin.fotos = p ? fotosGerais(p).slice() : []; admin.cores = p ? coresProd(p).map(c => ({ nome: c.nome, hex: c.hex, fotos: (c.fotos || []).filter(fotoOk) })) : []; admin.tams = p ? (p.tamanhos || []).slice() : []; telaAdm(); return; }
  const dp = t.closest('[data-del-prod]');
  if (dp) { admin.confirmar = dp.dataset.delProd; telaAdm(true); return; }
  if (t.closest('[data-del-nao]')) { admin.confirmar = null; telaAdm(true); return; }
  const ds = t.closest('[data-del-sim]');
  if (ds) {
    excluirProduto(ds.dataset.delSim).then(() => { admin.confirmar = null; aviso('Produto excluído.'); telaAdm(true); })
      .catch(err => aviso(msgErroGravar(err), true));
    return;
  }
  if (t.closest('[data-tirar-foto]')) {
    admin.foto = '';
    const prev = document.getElementById('foto-prev'); if (prev) prev.textContent = 'Sem foto';
    const inp = document.getElementById('f-foto'); if (inp) inp.value = '';
    return;
  }
  if (t.closest('[data-tirar-linkfoto]')) {
    admin.linkFoto = '';
    const prev = document.getElementById('link-prev'); if (prev) prev.textContent = 'Sem foto';
    const inp = document.getElementById('l-foto'); if (inp) inp.value = '';
    return;
  }
  const rf = t.closest('[data-foto-reset]');
  if (rf) {
    const tipo = rf.dataset.fotoReset, fid = rf.dataset.fotoId;
    const feito = () => { aviso('Foto original restaurada.'); telaAdm(true); };
    if (tipo === 'slot') {
      gravarFotoDoc(fid, null)
        .then(() => (fid === 'hero' && cfg.heroFoto) ? gravarCfg({ ...cfg, heroFoto: '' }) : null)
        .then(feito).catch(err => aviso(msgErroGravar(err), true));
    } else if (tipo === 'link') gravarFotoDoc('link-' + fid, null).then(feito).catch(err => aviso(msgErroGravar(err), true));
    else { const p = produtos.find(x => x.id === fid); if (p) gravarProduto({ ...p, foto: '' }).then(feito).catch(err => aviso(msgErroGravar(err), true)); }
    return;
  }
  if (t.closest('[data-restaurar-sobre]')) {
    SOBRE_CAMPOS.forEach(c => { const el = document.getElementById('s-' + c.k); if (el) el.value = DEFAULT_SOBRE[c.k]; });
    aviso('Textos originais carregados. Toque em salvar para aplicar.');
    return;
  }
  if (t.closest('[data-novo-link]')) { admin.edit = { tipo: 'link', id: null }; admin.linkFoto = undefined; telaAdm(); return; }
  const el = t.closest('[data-edit-link]');
  if (el) { admin.edit = { tipo: 'link', id: el.dataset.editLink }; admin.linkFoto = undefined; telaAdm(); return; }
  const dl = t.closest('[data-del-link]');
  if (dl) { admin.confirmar = dl.dataset.delLink; telaAdm(true); return; }
  const dls = t.closest('[data-del-link-sim]');
  if (dls) {
    gravarFotoDoc('link-' + dls.dataset.delLinkSim, null).catch(() => {});
    const novo = { ...cfg, links: (cfg.links || []).filter(l => l.id !== dls.dataset.delLinkSim) };
    gravarCfg(novo).then(() => { admin.confirmar = null; aviso('Link excluído.'); telaAdm(true); })
      .catch(err => aviso(msgErroGravar(err), true));
  }
});

app.addEventListener('change', async e => {
  const id = e.target.id;
  const cf = e.target.dataset && e.target.dataset.corFotos;
  if (id === 'f-fotos' || cf !== undefined) { await addFotos(e.target, cf); return; }
  const ft = e.target.dataset && e.target.dataset.fotoTipo;
  if (!ft && id !== 'f-foto' && id !== 'l-foto') return;
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (ft) {
    const fid = e.target.dataset.fotoId;
    try {
      aviso('Enviando foto…');
      if (ft === 'slot') { const s = SLOTS.find(x => x.k === fid); await gravarFotoDoc(fid, await reduzirFoto(file, s.max, s.lim, razao(s.ar))); }
      else if (ft === 'link') await gravarFotoDoc('link-' + fid, await reduzirFoto(file, 900, 80000, 3));
      else { const p = produtos.find(x => x.id === fid); if (p) { const nova = await reduzirFoto(file, 800, 120000, 0.8); await gravarProduto({ ...p, foto: nova, fotos: [nova, ...fotosGerais(p).slice(1)] }); } }
      aviso('Foto trocada.'); telaAdm(true);
    } catch (x) { aviso(x && x.message === 'imagem' ? 'Não foi possível ler essa imagem. Tente outra foto.' : msgErroGravar(x), true); }
    return;
  }
  try {
    if (id === 'l-foto') {
      admin.linkFoto = await reduzirFoto(file, 900, 80000, 3);
      const prev = document.getElementById('link-prev');
      if (prev) prev.innerHTML = `<img src="${admin.linkFoto}" alt="Foto do card">`;
    } else {
      admin.foto = await reduzirFoto(file, 800, 150000, 0.8);
      const prev = document.getElementById('foto-prev');
      if (prev) prev.innerHTML = `<img src="${admin.foto}" alt="Foto do produto">`;
    }
  } catch (x) { aviso('Não foi possível ler essa imagem. Tente outra foto.', true); }
});

app.addEventListener('submit', async e => {
  e.preventDefault();
  const id = e.target.id;
  const val = k => (document.getElementById(k) || {}).value || '';

  if (id === 'form-login') {
    const erro = document.getElementById('login-erro');
    try {
      const h = await sha(val('adm-senha'));
      if (h === (cfg.senhaHash || SENHA_PADRAO_HASH)) {
        admin.logado = true;
        try { sessionStorage.setItem('bella-adm', '1'); } catch (x) {}
        telaAdm();
      } else { erro.textContent = 'Senha incorreta. Tente de novo.'; erro.hidden = false; }
    } catch (x) { erro.textContent = 'Não foi possível verificar a senha neste navegador.'; erro.hidden = false; }
    return;
  }

  if (id === 'form-cat') {
    const erro = document.getElementById('cat-erro');
    const nome = val('c-nome').trim().replace(/\s+/g, ' ');
    const norm = x => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (!nome) return;
    const existentes = Object.values(filtrosAll()).concat(Object.values(tiposAll()));
    if (existentes.some(x => norm(x) === norm(nome))) { erro.textContent = 'Já existe uma categoria com esse nome.'; erro.hidden = false; return; }
    erro.hidden = true;
    let k = norm(nome).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cat';
    const usadas = Object.keys(filtrosAll()).concat(['voce', 'todos']);
    let n = 2, base = k;
    while (usadas.includes(k)) { k = base + '-' + n++; }
    try {
      await gravarCfg({ ...cfg, cats: (cfg.cats || []).concat([{ k, nome }]) });
      aviso('Categoria adicionada.'); telaAdm(true);
    } catch (err) { aviso(msgErroGravar(err), true); }
    return;
  }

  if (id === 'form-prod') {
    const nome = val('f-nome').trim();
    if (!nome) return;
    const bruto = val('f-preco').trim();
    const preco = bruto === '' ? null : Math.max(0, Number(bruto.replace(',', '.')));
    const existente = admin.edit.id ? produtos.find(x => x.id === admin.edit.id) : null;
    const maxOrdem = produtos.reduce((m, x) => Math.max(m, x.ordem || 0), 0);
    const p = {
      id: existente ? existente.id : 'p' + Date.now().toString(36),
      ordem: existente ? existente.ordem : maxOrdem + 1,
      nome, desc: val('f-desc').trim(), preco: isFinite(preco) ? preco : null,
      tipo: val('f-tipo'), cor: corOk(val('f-cor')), corNome: val('f-cornome').trim() || 'Cor única',
      corCat: val('f-corcat'), estilo: val('f-estilo'), ocasiao: val('f-ocasiao'), caimento: val('f-caimento'),
      fotos: admin.fotos.filter(fotoOk), foto: admin.fotos.filter(fotoOk)[0] || '',
      cores: (syncCores(), admin.cores.map(c => ({ nome: String(c.nome || '').trim(), hex: corOk(c.hex), fotos: c.fotos.filter(fotoOk) })).filter(c => c.nome)),
      tamanhos: TAMS.filter(t => Array.from(document.querySelectorAll('input[name="f-tam"]:checked')).some(x => x.value === t)),
    numeros: NUMS.filter(n => Array.from(document.querySelectorAll('input[name="f-num"]:checked')).some(x => x.value === n))
    };
    const btn = document.getElementById('salvar-prod');
    btn.disabled = true; btn.textContent = 'Salvando…';
    try {
      await gravarProduto(p);
      admin.edit = null; admin.foto = '';
      aviso('Produto salvo.');
      telaAdm();
    } catch (err) {
      btn.disabled = false; btn.textContent = 'Salvar produto';
      aviso(msgErroGravar(err), true);
    }
    return;
  }

  if (id === 'form-link') {
    let url = val('l-url').trim();
    if (url && !/^[a-z]+:\/\//i.test(url)) url = 'https://' + url;
    if (!urlOk(url)) { document.getElementById('link-erro').hidden = false; return; }
    const ls = (cfg.links || []).slice();
    const novo = { id: admin.edit.id || 'l' + Date.now().toString(36), titulo: val('l-titulo').trim(), sub: val('l-sub').trim(), url };
    const i = ls.findIndex(x => x.id === novo.id);
    if (i >= 0) ls[i] = novo; else ls.push(novo);
    try {
      if (admin.linkFoto !== undefined) await gravarFotoDoc('link-' + novo.id, admin.linkFoto || null);
      await gravarCfg({ ...cfg, links: ls });
      admin.edit = null; admin.linkFoto = undefined; aviso('Link salvo.'); telaAdm();
    } catch (err) { aviso(msgErroGravar(err), true); }
    return;
  }

  if (id === 'form-sobre') {
    const novo = {};
    SOBRE_CAMPOS.forEach(c => { novo[c.k] = val('s-' + c.k).trim(); });
    try {
      await gravarCfg({ ...cfg, sobre: novo });
      aviso('Página Sobre salva.');
    } catch (err) { aviso(msgErroGravar(err), true); }
    return;
  }

  if (id === 'form-ajustes') {
    const erro = document.getElementById('aj-erro');
    let d = soDigitos(val('a-whats'));
    if (d.length < 10) { erro.textContent = 'Digite o WhatsApp com DDD, por exemplo (11) 99999-9999.'; erro.hidden = false; return; }
    if (d.length <= 11) d = '55' + d;
    erro.hidden = true;
    let arroba = val('a-arroba').trim();
    if (arroba && !arroba.startsWith('@')) arroba = '@' + arroba;
    let mapaUrl = val('a-mapa').trim();
    if (mapaUrl && !urlOk(mapaUrl)) { erro.textContent = 'O link do mapa precisa começar com https://'; erro.hidden = false; return; }
    try {
      await gravarCfg({
        ...cfg, marca: val('a-marca').trim() || cfg.marca, segmento: val('a-seg').trim(), frase: val('a-frase').trim(),
        arroba, whatsapp: d, whatsappExibir: fmtTel(d), endereco: val('a-end').trim(), mapaUrl
      });
      aviso('Ajustes salvos.'); telaAdm();
    } catch (err) { aviso(msgErroGravar(err), true); }
    return;
  }

  if (id === 'form-senha') {
    const erro = document.getElementById('senha-erro');
    const a = val('s-nova'), b = val('s-rep');
    if (a.length < 6) { erro.textContent = 'A senha precisa ter pelo menos 6 caracteres.'; erro.hidden = false; return; }
    if (a !== b) { erro.textContent = 'As duas senhas não são iguais.'; erro.hidden = false; return; }
    erro.hidden = true;
    try {
      await gravarCfg({ ...cfg, senhaHash: await sha(a) });
      aviso('Senha trocada.'); telaAdm();
    } catch (err) { aviso(msgErroGravar(err), true); }
  }
});

rotear();
iniciarArmazenamento();
