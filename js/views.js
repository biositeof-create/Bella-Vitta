/* ===== Telas do cliente ===== */
function telaCarregando() { setView('<p class="empty">Carregando…</p>', true); }

function banner({ href, ext, t, s, b, img, pos, wa: ehWa, extra }) {
  const alvo = ext ? ' target="_blank" rel="noopener"' : '';
  const estilo = img ? ` style="--img:url('${img}');--pos:${pos || 'center 15%'}"` : '';
  return `<a class="bn mini${img ? '' : ' plain'}" href="${href}"${alvo}${extra || ''}${estilo}>
    <span class="bn-in"><span class="bn-t">${esc(t)}</span>${s ? `<span class="bn-s">${esc(s)}</span>` : ''}<span class="pill${ehWa ? ' wa' : ''}">${esc(b)}</span></span>
  </a>`;
}

const ICO_RELOGIO = svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>');
const ICO_PIN = svg('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>');
const mapaLink = () => urlOk(cfg.mapaUrl) ? cfg.mapaUrl : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cfg.endereco || cfg.marca);
function horariosLista(s) {
  return linhas(s).map(l => { const i = l.lastIndexOf(':'); return i > 0 && /\d/.test(l.slice(i + 1)) ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : [l, '']; });
}
function blocoInfo() {
  const hs = horariosLista(S().horarios);
  return `<section class="info" aria-label="Horário e endereço">
    <div class="info-b">
      <div class="info-h">${ICO_RELOGIO}<h3>Horário de funcionamento</h3></div>
      <ul class="info-hr">${hs.map(([d, h]) => `<li><span>${esc(d)}</span>${h ? `<span>${esc(h)}</span>` : ''}</li>`).join('')}</ul>
    </div>
    <div class="info-sep"></div>
    <div class="info-b">
      <div class="info-h">${ICO_PIN}<h3>Onde estamos</h3></div>
      <p class="info-end">${esc(cfg.endereco).replace(/\n/g, '<br>')}</p>
      <a class="map-btn" href="${esc(mapaLink())}" target="_blank" rel="noopener">${ICO_PIN} Como chegar</a>
    </div>
  </section>`;
}
const ICO_BRILHO = svg('<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>');
function cardQuiz() {
  return `<a class="quiz-card" href="#quiz" style="--img:url('${fotoSlot('quiz')}')" aria-label="Fazer o quiz de estilo">
    <span class="quiz-in">
      <span class="quiz-tag">${ICO_BRILHO} Quiz exclusivo</span>
      <span class="quiz-t">Qual é o <em>seu estilo</em>?</span>
      <span class="quiz-s">Responda 5 perguntas rápidas e veja as peças que combinam com você.</span>
      <span class="quiz-meta"><span>5 perguntas</span><span>1 minuto</span><span>Resultado só seu</span></span>
      <span class="quiz-go">Descobrir meu estilo ${ICO.setaCta}</span>
    </span>
  </a>`;
}

function telaInicio(keep) {
  const capa = fotoSlot('hero');
  const cats = [['blusa', 'Blusas'], ['calca', 'Calças'], ['vestido', 'Vestidos'], ['conjunto', 'Conjuntos']].concat((cfg.cats || []).map(c => [c.k, c.nome]), [['todos', 'Ver tudo']]);
  setView(`
    <header class="hero">
      ${botaoAdm('over')}
      <div class="hero-img" style="background-image:url('${capa}')" role="img" aria-label="Looks da ${esc(cfg.marca)}"></div>
      <div class="brand">
        ${LOGO}
        <h1 data-foco>${esc(cfg.marca)}</h1>
        <p class="seg">${esc(cfg.segmento)}</p>
        <p class="script">${esc(cfg.frase)}</p>
      </div>
    </header>
    <nav class="cards" aria-label="Links">
      ${cardQuiz()}
      ${banner({ href: '#sobre', t: 'Conheça a ' + cfg.marca, s: 'Nossa história e como comprar', b: 'Conhecer', img: fotoSlot('bn1'), pos: '12% 20%' })}
      ${banner({ href: '#catalogo', t: 'Catálogo de peças', s: 'Veja tudo o que temos', b: 'Ver catálogo', img: fotoSlot('bn2'), pos: 'center 4%' })}
      ${banner({ href: wa('Oi! Vim pelo Instagram da ' + cfg.marca + ' e queria conversar.'), ext: true, t: 'Fale com a nossa equipe', s: cfg.whatsappExibir, b: 'Falar no WhatsApp', img: fotoSlot('bn3'), pos: 'center 2%', wa: true })}
      ${(cfg.links || []).filter(l => urlOk(l.url)).map(l => banner({ href: esc(l.url), ext: true, t: l.titulo, s: l.sub, b: 'Acessar', img: fotoLink(l.id) || '', pos: 'center' })).join('')}
    </nav>
    <section class="block" aria-labelledby="cat-t">
      <h3 class="sec-t" id="cat-t">Compre por categoria</h3>
      <div class="cats">
        ${cats.map(([k, t]) => `<a class="cat" href="#catalogo" data-catlink="${k}" style="--img:url('${fotoSlot('cat_' + k) || capaTipo(k)}')"><span>${t}</span></a>`).join('')}
      </div>
    </section>
    ${blocoInfo()}
    <p class="foot">Modelo de demonstração · peças, preços, horário e endereço de exemplo</p>
  `, keep);
}

const ICO_TR = {
  brilho: ICO_BRILHO,
  headset: svg('<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20c0 1-2 2-5 2"/>'),
  escudo: svg('<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>'),
  cartao: svg('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>'),
  caminhao: svg('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>'),
  coracao: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>')
};
function iconeDif(t) {
  t = t.toLowerCase();
  if (t.includes('atend')) return ICO_TR.headset;
  if (t.includes('segur')) return ICO_TR.escudo;
  if (t.includes('pagament')) return ICO_TR.cartao;
  if (t.includes('entrega')) return ICO_TR.caminhao;
  return ICO_TR.brilho;
}

function telaSobre(keep) {
  const s = S();
  const capa = fotoSlot('sobre');
  const nome = esc(cfg.marca);
  const difs = linhas(s.difs).map(l => { const i = l.indexOf(':'); return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : [l, '']; });
  const quem = linhas(s.quem);
  const msg = 'Oi! Vim pela página da ' + cfg.marca + ' e queria conversar com a equipe.';
  const mos = [['vestido', 'Vestidos'], ['blusa', 'Blusas'], ['calca', 'Calças'], ['conjunto', 'Conjuntos'], ['todos', 'Ver tudo']];
  setView(`
    ${topo('<a class="back" href="#inicio">← Início</a>')}
    <header class="lp-hero" style="--img:url('${capa}')">
      <div class="lp-in">
        <span class="lp-eyebrow">${esc(cfg.segmento)}</span>
        <h2 class="lp-h" data-foco>Vista a sua <em>melhor versão</em></h2>
        <p class="lp-sub">${esc(s.chamada)}</p>
        <div class="lp-btns">
          <a class="btn" href="#quiz">Descobrir meu estilo ${ICO.setaCta}</a>
          <a class="btn light" href="#catalogo">Ver o catálogo</a>
        </div>
      </div>
    </header>

    <section class="block" aria-label="Diferenciais">
      <div class="trust">
        ${difs.map(([t, d]) => `<div class="tr"><span class="tr-i">${iconeDif(t)}</span><b>${esc(t)}</b>${d ? `<span>${esc(d)}</span>` : ''}</div>`).join('')}
      </div>
    </section>

    <section class="block" aria-labelledby="lp-quem">
      <div class="lp-head"><span class="lp-k">Quem somos</span><h3 class="lp-t" id="lp-quem">Moda que valoriza o seu jeito de ser</h3></div>
      <div class="lp-quote">
        <p class="q">${esc(quem[0] || '')}</p>
        ${quem.length > 1 ? `<details class="more"><summary><span class="t-abrir">Ler mais</span><span class="t-fechar">Ler menos</span></summary><div class="more-b">${quem.slice(1).map(p => `<p>${esc(p)}</p>`).join('')}</div></details>` : ''}
      </div>
    </section>

    ${cardQuiz()}

    <section class="block" aria-labelledby="lp-cat">
      <div class="lp-head"><span class="lp-k">Nossas categorias</span><h3 class="lp-t" id="lp-cat">Escolha pelo tipo de peça</h3></div>
      <div class="mos">
        ${mos.map(([k, t]) => `<a href="#catalogo" data-catlink="${k}" style="--img:url('${fotoSlot('cat_' + k)}')"><span>${t}</span></a>`).join('')}
      </div>
      <div class="chips">${linhas(s.categorias).map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div>
    </section>

    <section class="block" aria-labelledby="lp-como">
      <div class="lp-head"><span class="lp-k">Como comprar</span><h3 class="lp-t" id="lp-como">Do catálogo à sua casa em ${linhas(s.passos).length} passos</h3></div>
      <ol class="stp">${linhas(s.passos).map(x => `<li><span>${esc(x)}</span></li>`).join('')}</ol>
      <a class="btn ghost" href="${wa(msg)}" target="_blank" rel="noopener">${ICO.zap} Começar pelo WhatsApp</a>
    </section>

    ${blocoInfo()}

    <section class="acc" aria-label="Perguntas frequentes">
      <details><summary>Como funciona a entrega?</summary><div class="acc-b">${paras(s.entrega)}</div></details>
      <details><summary>Quais as formas de pagamento?</summary><div class="acc-b">
        <div class="chips">${linhas(s.pagamentos).map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div>
        ${s.pagamentoNota ? `<p>${esc(s.pagamentoNota)}</p>` : ''}</div></details>
      <details><summary>E fora do horário de atendimento?</summary><div class="acc-b"><p>${esc(s.horariosNota)}</p></div></details>
      <details><summary>Como funciona o atendimento digital?</summary><div class="acc-b">${paras(s.como)}</div></details>
    </section>

    <section class="essencia"><span class="tr-i" style="background:rgba(255,255,255,.12);color:#F2A672;align-self:center">${ICO_TR.coracao}</span><h3>Nossa essência</h3>${paras(s.essencia)}${s.essenciaAssina ? `<p class="script">${esc(s.essenciaAssina)}</p>` : ''}</section>
    <p class="foot">Modelo de demonstração · textos, horário e endereço de exemplo</p>
  `, keep);
  const b = document.getElementById('barra');
  b.innerHTML = `<div class="barra-in"><a class="btn" href="#quiz">Fazer o quiz</a><a class="btn ghost" href="${wa(msg)}" target="_blank" rel="noopener">${ICO.zap} WhatsApp</a></div>`;
  b.hidden = false;
  document.body.classList.add('has-barra');
}

function telaQuiz() {
  const q = PERGUNTAS[state.q];
  const atual = state.resp[q.chave];
  const pct = Math.round(state.q / PERGUNTAS.length * 100);
  setView(`
    ${topo(`<button class="back" type="button" data-back>← ${state.q === 0 ? 'Início' : 'Voltar'}</button>`)}
    <div class="progress">
      <span class="progress-label">Pergunta ${state.q + 1} de ${PERGUNTAS.length}</span>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>
    </div>
    <h2 class="q-title" data-foco>${q.titulo}</h2>
    <div class="opts">
      ${q.opcoes.map((o, i) => `
        <button class="opt${atual === o.v ? ' on' : ''}" type="button" id="opt-${state.q}-${i}" data-pick="${i}">
          <span><span class="opt-t">${o.t}</span><span class="opt-s">${o.s}</span></span>
          ${o.dots ? `<span class="dots" aria-hidden="true">${o.dots.map(c => `<i style="background:${c}"></i>`).join('')}</span>` : ''}
        </button>`).join('')}
    </div>
  `);
}

function telaResultado(keep) {
  const r = state.result;
  const top = r.ranking.slice(0, 3);
  const msg = `Oi! Fiz o quiz de estilo da ${cfg.marca} e deu: cliente ${r.persona}, que ama ${r.corFrase}. Quero ver as peças que combinam comigo!`;
  setView(`
    ${topo('<a class="back" href="#inicio">← Início</a>')}
    <p class="res-kicker">Seu resultado</p>
    <h2 class="res-title" data-foco>Você é uma cliente <em>${r.persona}</em> e ama <em>${r.corFrase}</em>.</h2>
    <p class="res-text">Separamos as peças que combinam com o que você respondeu. Elas já estão ordenadas no catálogo, da mais parecida com você para a menos.</p>
    <div class="chips">
      <span class="chip">${ROTULOS.estilo[r.a.estilo]}</span>
      <span class="chip">${ROTULOS.ocasiao[r.a.ocasiao]}</span>
      <span class="chip">${ROTULOS.caimento[r.a.caimento]}</span>
    </div>
    ${top.length ? `<h3 class="sec-t">As ${top.length === 1 ? 'peça' : top.length + ' peças'} mais a sua cara</h3>
    <div class="picks">
      ${top.map(({ p, pct }) => `
        <div class="pick">
          <div class="thumb" style="--c:${corOk(p.cor)}">${arte(p)}</div>
          <div><span class="pick-n">${esc(p.nome)}</span><span class="pick-p">${temPreco(p) ? brl(p.preco) + ' · ' : ''}${esc(p.corNome)}</span></div>
          <span class="match">${pct}%</span>
        </div>`).join('')}
    </div>` : ''}
    <div class="btns">
      <a class="btn" href="#catalogo" data-meu>Ver meu catálogo ${ICO.setaCta}</a>
      <a class="btn ghost" href="${wa(msg)}" target="_blank" rel="noopener">${ICO.zap} Falar no WhatsApp</a>
      <a class="btn plain" href="#quiz">Refazer o quiz</a>
    </div>
  `, keep);
}


function msgCompra(p) {
  const cores = coresProd(p);
  const cor = state.cor >= 0 && cores[state.cor] ? cores[state.cor].nome : '';
  return 'Oi! Quero a peça *' + p.nome + '*' + (temPreco(p) ? ' (' + brl(p.preco) + ')' : '') + (cor ? ' na cor *' + cor + '*' : '') + (state.tam ? ', tamanho *' + state.tam + '*' : '') + '. Ainda tem disponível?';
}
function telaProduto(keep) {
  const p = prodAtual();
  if (!p) { location.hash = '#catalogo'; return; }
  const cores = coresProd(p);
  const gerais = fotosGerais(p);
  if (state.cor === -2) state.cor = (gerais.length || !cores.length) ? -1 : 0;
  if (state.cor >= cores.length) state.cor = -1;
  let fotos = state.cor >= 0 ? fotosCor(p, state.cor) : [];
  if (!fotos.length) fotos = gerais;
  if (!fotos.length) fotos = cores.map((c, i) => fotosCor(p, i)[0]).filter(Boolean);
  const corSel = state.cor >= 0 ? cores[state.cor] : null;
  const tams = TAMS.filter(t => (p.tamanhos || []).includes(t));
  const nums = NUMS.filter(n => (p.numeros || []).includes(n));
  if (state.tam && !tams.includes(state.tam)) state.tam = '';
  setView(`
    ${topo('<a class="back" href="#catalogo" data-voltar-cat>← Catálogo</a>')}
    <div class="gal">
      <div class="gal-track" id="gal-track" tabindex="0" aria-label="Fotos de ${esc(p.nome)}">
        ${fotos.length ? fotos.map((f, i) => `<img src="${f}" alt="${esc(p.nome)}${corSel ? ' na cor ' + esc(corSel.nome) : ''}, foto ${i + 1} de ${fotos.length}">`).join('') : `<div class="gal-art" style="--c:${corOk(p.cor)}">${arte(p)}</div>`}
      </div>
      ${fotos.length > 1 ? `<div class="gal-th">${fotos.map((f, i) => `<button type="button" class="${i === 0 ? 'on' : ''}" data-thumb="${i}" aria-label="Ver foto ${i + 1}"><img src="${f}" alt=""></button>`).join('')}</div>` : ''}
    </div>
    <div class="pd-h">
      <h2 class="pd-n" data-foco>${esc(p.nome)}</h2>
      <p class="card-p${temPreco(p) ? '' : ' consulte'}">${precoTxt(p)}</p>
      ${p.desc ? `<p class="pd-d">${esc(p.desc)}</p>` : ''}
    </div>
    ${cores.length ? `<section class="pd-s" aria-label="Cores disponíveis">
      <div class="pd-l"><span class="lbl">Cores disponíveis</span><span class="pd-v">${corSel ? esc(corSel.nome) : ''}</span></div>
      <div class="sw">${cores.map((c, i) => `<button type="button" class="swb${i === state.cor ? ' on' : ''}" data-cor="${i}" aria-pressed="${i === state.cor}" aria-label="Cor ${esc(c.nome)}"><i style="background:${corOk(c.hex)}"></i><span>${esc(c.nome)}</span></button>`).join('')}</div>
    </section>` : ''}
    ${tams.length || nums.length ? `<section class="pd-s" aria-label="Tamanhos">
      <div class="pd-l"><span class="lbl">Tamanhos</span></div>
      <div class="tams">${[...(tams.length ? tams : []), ...(nums.length ? nums : [])].map(t => `<button type="button" class="tam${t === state.tam ? ' on' : ''}" data-tam="${t}" aria-pressed="${t === state.tam}">${t}</button>`).join('')}</div>
    </section>` : ''}
    <div class="btns">
      <a class="btn" id="pd-buy" href="${wa(msgCompra(p))}" target="_blank" rel="noopener">${ICO.zap} Quero esta peça</a>
      <a class="btn ghost" href="#catalogo" data-voltar-cat>Ver mais peças</a>
    </div>
  `, keep);
  const tr = document.getElementById('gal-track');
  if (tr) tr.addEventListener('scroll', () => {
    const i = Math.round(tr.scrollLeft / Math.max(1, tr.clientWidth));
    app.querySelectorAll('[data-thumb]').forEach(b => b.classList.toggle('on', Number(b.dataset.thumb) === i));
  }, { passive: true });
}

function telaCatalogo(keep) {
  const r = state.result;
  if (!state.filtro) state.filtro = r ? 'voce' : 'todos';
  const abas = (r ? [['voce', 'Para você']] : []).concat(Object.entries(filtrosAll()));
  let lista;
  if (state.filtro === 'voce' && r) lista = r.ranking;
  else {
    const base = r ? r.ranking : produtos.map(p => ({ p, pct: null }));
    lista = base.filter(x => state.filtro === 'todos' || state.filtro === 'voce' || x.p.tipo === state.filtro);
  }
  setView(`
    ${topo('<a class="back" href="#inicio">← Início</a>')}
    <h2 class="cat-h" data-foco>Catálogo</h2>
    ${r ? '' : `<div class="banner"><span>Quer ver as peças ordenadas para você?</span><a href="#quiz">Fazer o quiz</a></div>`}
    <div class="filters" role="tablist" aria-label="Filtrar peças">
      ${abas.map(([k, t]) => `<button class="f${state.filtro === k ? ' on' : ''}" type="button" role="tab" aria-selected="${state.filtro === k}" data-filtro="${k}">${t}</button>`).join('')}
    </div>
    ${lista.length ? `<div class="grid">
      ${lista.map(({ p, pct }) => `
        <article class="card">
          <a class="art" href="#produto" data-prod="${esc(p.id)}" aria-label="Ver ${esc(p.nome)}" style="--c:${corOk(p.cor)}">
            ${arte(p)}
            ${pct !== null && pct >= 70 ? `<span class="badge">${pct}% a sua cara</span>` : ''}
          </a>
          <div>
            <h3 class="card-n"><a href="#produto" data-prod="${esc(p.id)}">${esc(p.nome)}</a></h3>
            <p class="card-m">${esc(p.desc || p.corNome)}</p>
          </div>
          <p class="card-p${temPreco(p) ? '' : ' consulte'}">${precoTxt(p)}</p>
          ${medidasTxt(p)}
          <a class="buy" href="${wa('Oi! Quero a peça *' + p.nome + '*' + (temPreco(p) ? ' (' + brl(p.preco) + ')' : '') + '. Ainda tem disponível?')}" target="_blank" rel="noopener">Quero esta peça</a>
        </article>`).join('')}
    </div>` : '<p class="empty">Ainda não há peças nesta categoria.</p>'}
    <a class="btn ghost" href="${wa('Oi! Estou vendo o catálogo da ' + cfg.marca + ' e queria ajuda para escolher.')}" target="_blank" rel="noopener">${ICO.zap} Prefiro conversar no WhatsApp</a>
    <p class="foot">Modelo de demonstração · peças e preços de exemplo</p>
  `, keep);
}

