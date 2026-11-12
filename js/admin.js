/* ===== Administração ===== */
const opcoes = (obj, atual) => Object.entries(obj).map(([k, t]) => `<option value="${k}"${k === atual ? ' selected' : ''}>${t}</option>`).join('');

function telaAdm(keep) {
  if (!admin.logado) return telaLogin();
  const cab = `
    ${topo('<a class="back" href="#inicio">← Ver o site</a>')}
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
      <h2 class="adm-h" data-foco>Administração</h2>
      <button class="btn plain small" type="button" data-sair>Sair</button>
    </div>`;
  if (admin.edit && admin.edit.tipo === 'produto') return setView(cab + formProduto(), keep);
  if (admin.edit && admin.edit.tipo === 'link') return setView(cab + formLink(), keep);
  const abas = [['produtos', 'Produtos'], ['categorias', 'Categorias'], ['fotos', 'Fotos'], ['links', 'Links'], ['sobre', 'Página Sobre'], ['ajustes', 'Ajustes']];
  const tabs = `<div class="filters" role="tablist" aria-label="Seções">${abas.map(([k, t]) => `<button class="f${admin.aba === k ? ' on' : ''}" type="button" role="tab" aria-selected="${admin.aba === k}" data-aba="${k}">${t}</button>`).join('')}</div>`;
  const corpo = admin.aba === 'produtos' ? listaProdutos() : admin.aba === 'categorias' ? listaCategorias() : admin.aba === 'fotos' ? listaFotos() : admin.aba === 'links' ? listaLinks() : admin.aba === 'sobre' ? formSobre() : formAjustes();
  setView(cab + tabs + corpo, keep);
}

function telaLogin() {
  setView(`
    ${topo('<a class="back" href="#inicio">← Voltar</a>')}
    <h2 class="adm-h" data-foco>Área da <em>administração</em></h2>
    <p class="res-text">Acesso somente da dona da loja. Digite a senha para cadastrar produtos, editar os links e a página Sobre.</p>
    <form class="box" id="form-login" autocomplete="off">
      <div class="field">
        <label for="adm-senha">Senha</label>
        <input type="password" id="adm-senha" autocomplete="current-password" required>
      </div>
      <p class="msg erro" id="login-erro" role="alert" hidden>Senha incorreta. Tente de novo.</p>
      <button class="btn" type="submit">Entrar</button>
    </form>
  `);
}

function listaProdutos() {
  return `
    <button class="btn" type="button" data-novo-prod>+ Novo produto</button>
    ${produtos.length ? `<div class="alist">
      ${produtos.map(p => `
        <div class="arow">
          <div class="athumb" style="--c:${corOk(p.cor)}">${arte(p)}</div>
          <div class="arow-b">
            <div><div class="arow-n">${esc(p.nome)}</div><div class="arow-m">${tiposAll()[p.tipo] || ''} · ${temPreco(p) ? brl(p.preco) : 'Sem preço (mostra "Consulte")'}</div></div>
            <div class="arow-a">
              ${admin.confirmar === p.id
                ? `<span class="msg">Excluir este produto?</span>
                   <button class="btn small danger" type="button" data-del-sim="${esc(p.id)}">Sim, excluir</button>
                   <button class="btn small ghost" type="button" data-del-nao>Cancelar</button>`
                : `<button class="btn small ghost" type="button" data-edit-prod="${esc(p.id)}">Editar</button>
                   <button class="btn small plain" type="button" data-del-prod="${esc(p.id)}">Excluir</button>`}
            </div>
          </div>
        </div>`).join('')}
    </div>` : '<p class="empty">Nenhum produto cadastrado. Toque em "Novo produto" para começar.</p>'}
  `;
}


function midiaHtml() {
  const fotosHtml = (arr, attr) => arr.map((f, i) => `<div class="mf"><img src="${f}" alt="Foto ${i + 1}"><button type="button" class="mf-x" ${attr}="${i}" aria-label="Remover foto ${i + 1}">×</button></div>`).join('');
  const total = admin.fotos.length + admin.cores.reduce((n, c) => n + c.fotos.length, 0);
  return `
    <div class="field">
      <span class="lbl">Fotos do produto</span>
      ${admin.fotos.length ? `<div class="mfotos">${admin.fotos.map((f, i) => `<div class="mf"><img src="${f}" alt="Foto ${i + 1}"><button type="button" class="mf-x" data-rm-foto="${i}" aria-label="Remover foto ${i + 1}">×</button></div>`).join('')}</div>` : '<div class="foto-prev" style="width:88px;height:110px">Sem foto</div>'}
      <div class="slot-a"><label class="btn small ghost filebtn">+ Adicionar fotos<input class="sr" type="file" accept="image/*" multiple id="f-fotos"></label></div>
      <small>Proporção 4:5 (vertical), tamanho sugerido 800 × 1000 px. Você pode escolher várias fotos de uma vez. A primeira aparece no catálogo. Limite de ${MAX_FOTOS} fotos no total (${total} usadas). Sem foto, aparece o desenho da peça.</small>
    </div>
    <div class="group">
      <div class="group-t">Cores disponíveis</div>
      <p class="group-s">Cada cor tem as próprias fotos. Quando a cliente toca na cor, ela vê as fotos daquela cor.</p>
      ${admin.cores.map((c, ci) => `
        <div class="cor-box">
          <div class="two">
            <div class="field"><label for="c-nome-${ci}">Nome da cor</label><input type="text" id="c-nome-${ci}" maxlength="30" value="${esc(c.nome)}" placeholder="Ex.: Azul" data-cor-campo="nome" data-ci="${ci}"></div>
            <div class="field"><label for="c-hex-${ci}">Cor</label><input type="color" id="c-hex-${ci}" value="${corOk(c.hex)}" data-cor-campo="hex" data-ci="${ci}"></div>
          </div>
          ${c.fotos.length ? `<div class="mfotos">${fotosHtml(c.fotos, 'data-rm-cfoto-' + ci)}</div>` : ''}
          <div class="slot-a">
            <label class="btn small ghost filebtn">+ Fotos desta cor<input class="sr" type="file" accept="image/*" multiple data-cor-fotos="${ci}"></label>
            <button class="btn small plain" type="button" data-rm-cor="${ci}">Remover cor</button>
          </div>
        </div>`).join('')}
      <button class="btn small ghost" type="button" data-add-cor style="align-self:flex-start">+ Adicionar cor</button>
    </div>`;
}
function renderMidia() { const el = document.getElementById('midia'); if (el) el.innerHTML = midiaHtml(); }
function syncCores() {
  document.querySelectorAll('[data-cor-campo]').forEach(el => {
    const c = admin.cores[Number(el.dataset.ci)];
    if (c) c[el.dataset.corCampo] = el.value;
  });
}
async function addFotos(input, ci) {
  syncCores();
  const alvo = ci === undefined ? admin.fotos : (admin.cores[Number(ci)] || {}).fotos;
  if (!alvo) return;
  const total = () => admin.fotos.length + admin.cores.reduce((n, c) => n + c.fotos.length, 0);
  const files = Array.from(input.files || []);
  input.value = '';
  if (!files.length) return;
  if (total() >= MAX_FOTOS) { aviso('Limite de ' + MAX_FOTOS + ' fotos por produto. Remova alguma para adicionar outra.', true); return; }
  aviso('Enviando fotos…');
  let erro = false, cortou = false;
  for (const f of files) {
    if (total() >= MAX_FOTOS) { cortou = true; break; }
    try { alvo.push(await reduzirFoto(f, 700, 70000, 0.8)); } catch (x) { erro = true; }
  }
  renderMidia();
  if (erro) aviso('Alguma imagem não pôde ser lida. Tente outra foto.', true);
  else if (cortou) aviso('Limite de ' + MAX_FOTOS + ' fotos por produto. As demais foram ignoradas.', true);
}

function formProduto() {
  const p = admin.edit.id ? produtos.find(x => x.id === admin.edit.id) : null;
  const v = p || { nome: '', desc: '', preco: null, tipo: 'blusa', cor: '#C4551E', corNome: '', corCat: 'neutro', estilo: 'minimal', ocasiao: 'dia', caimento: 'solto', foto: '' };
  const foto = fotoOk(admin.foto);
  return `
    <h3 class="sec-t">${p ? 'Editar produto' : 'Novo produto'}</h3>
    <form class="box" id="form-prod" autocomplete="off">
      <div id="midia">${midiaHtml()}</div>
      <div class="field">
        <span class="lbl">Tamanhos disponíveis</span>
        <div class="ck-row">${TAMS.map(t => `<label class="ck"><input type="checkbox" name="f-tam" value="${t}"${admin.tams.includes(t) ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div>
        <small>Marque os tamanhos que você tem. A cliente vê estes tamanhos na página da peça.</small>
      </div>
      <div class="field">
        <span class="lbl">Números do sapato</span>
        <div class="ck-row">${NUMS.map(n => `<label class="ck"><input type="checkbox" name="f-num" value="${n}"${admin.nums.includes(n) ? ' checked' : ''}><span>${n}</span></label>`).join('')}</div>
        <small>Marque os números que você tem. A cliente vê estes números na página da peça.</small>
      </div>
      <div class="field"><label for="f-nome">Nome do produto</label><input type="text" id="f-nome" maxlength="80" value="${esc(v.nome)}" required></div>
      <div class="field"><label for="f-desc">Descrição (opcional)</label><textarea id="f-desc" maxlength="200">${esc(v.desc)}</textarea></div>
      <div class="field">
        <label for="f-preco">Preço em reais (opcional)</label>
        <input type="number" id="f-preco" inputmode="decimal" min="0" step="0.01" value="${temPreco(v) ? v.preco : ''}" placeholder="Deixe vazio para mostrar &quot;Consulte&quot;">
      </div>
      <div class="two">
        <div class="field"><label for="f-tipo">Tipo de peça</label><select id="f-tipo">${opcoes(tiposAll(), v.tipo)}</select></div>
        <div class="field"><label for="f-cornome">Nome da cor</label><input type="text" id="f-cornome" maxlength="30" value="${esc(v.corNome)}" placeholder="Ex.: Terracota"></div>
      </div>
      <div class="field"><label for="f-cor">Cor para o desenho (quando não há foto)</label><input type="color" id="f-cor" value="${corOk(v.cor)}"></div>
      <div class="group">
        <div class="group-t">Para o quiz recomendar</div>
        <p class="group-s">Estas escolhas fazem a peça aparecer para quem combina com ela.</p>
        <div class="two">
          <div class="field"><label for="f-estilo">Estilo</label><select id="f-estilo">${opcoes(ESTILOS, v.estilo)}</select></div>
          <div class="field"><label for="f-corcat">Cor predominante</label><select id="f-corcat">${opcoes(CORES, v.corCat)}</select></div>
          <div class="field"><label for="f-ocasiao">Ocasião</label><select id="f-ocasiao">${opcoes(OCASIOES, v.ocasiao)}</select></div>
          <div class="field"><label for="f-caimento">Caimento</label><select id="f-caimento">${opcoes(CAIMENTOS, v.caimento)}</select></div>
        </div>
      </div>
      <button class="btn" type="submit" id="salvar-prod">Salvar produto</button>
      <button class="btn plain" type="button" data-cancelar>Cancelar</button>
    </form>`;
}

function botaoFoto(tipo, id, tem, rotulo) {
  return `<div class="slot-a">
    <label class="btn small filebtn">${rotulo || 'Trocar foto'}<input class="sr" type="file" accept="image/*" data-foto-tipo="${tipo}" data-foto-id="${esc(id)}"></label>
    ${tem ? `<button class="btn small plain" type="button" data-foto-reset="${tipo}" data-foto-id="${esc(id)}">Voltar à original</button>` : ''}
  </div>`;
}
function listaFotos() {
  const ls = cfg.links || [];
  return `
    <p class="note">Aqui você troca todas as fotos do site. Cada bloco mostra <b>onde a foto aparece</b> e a <b>proporção ideal</b>. A troca vale na hora, sem precisar salvar. Se a foto tiver outra proporção, o site corta as bordas e mantém o centro.</p>
    ${[...new Set(SLOTS.map(s => s.g))].map(g => `<h3 class="sec-t">${g}</h3>` + SLOTS.filter(s => s.g === g).map(s => `
      <div class="box slot">
        <div class="slot-h">${s.t}</div>
        <div class="slot-meta"><span><b>Onde aparece:</b> ${s.onde}</span><span><b>Tamanho sugerido:</b> ${s.px}</span></div>
        <span class="badge-prop">Proporção ${s.prop}</span>
        <div class="slot-prev" style="--ar:${s.ar};--w:${s.w}"><img src="${fotoSlot(s.k)}" alt="${esc(s.t)}"></div>
        ${botaoFoto('slot', s.k, !!fotosMap[s.k] || (s.k === 'hero' && !!fotoOk(cfg.heroFoto)))}
      </div>`).join('')).join('')}
    <h3 class="sec-t">Fotos dos produtos</h3>
    <p class="note">Cada foto de produto aparece no catálogo e no resultado do quiz. Proporção ${PROP_PROD.prop}, tamanho sugerido ${PROP_PROD.px}. Sem foto, o site mostra o desenho da peça.</p>
    <div class="alist">
      ${produtos.map(p => `
        <div class="arow">
          <div class="athumb">${arte(p)}</div>
          <div class="arow-b">
            <div><div class="arow-n">${esc(p.nome)}</div><div class="arow-m">${tiposAll()[p.tipo] || ''} · proporção ${PROP_PROD.prop}</div></div>
            ${botaoFoto('prod', p.id, !!fotoOk(p.foto))}
          </div>
        </div>`).join('') || '<p class="empty">Nenhum produto cadastrado.</p>'}
    </div>
    <h3 class="sec-t">Fotos dos links extras</h3>
    ${ls.length ? `<p class="note">Aparecem como card na página inicial. Proporção ${PROP_LINK.prop}, tamanho sugerido ${PROP_LINK.px}. O texto do card fica à direita, então deixe o assunto da foto à esquerda.</p>
    ${ls.map(l => `
      <div class="box slot">
        <div class="slot-h">${esc(l.titulo)}</div>
        <span class="badge-prop">Proporção ${PROP_LINK.prop}</span>
        <div class="slot-prev" style="--ar:${PROP_LINK.ar}">${fotoLink(l.id) ? `<img src="${fotoLink(l.id)}" alt="${esc(l.titulo)}">` : 'Sem foto: o card aparece simples'}</div>
        ${botaoFoto('link', l.id, !!fotoLink(l.id), fotoLink(l.id) ? 'Trocar foto' : 'Adicionar foto')}
      </div>`).join('')}` : '<p class="empty">Nenhum link extra cadastrado. Cadastre na aba Links e escolha a foto do card.</p>'}
  `;
}


function listaCategorias() {
  const extras = cfg.cats || [];
  const usos = k => produtos.filter(p => p.tipo === k).length;
  return `
    <p class="note">As categorias separam as peças no catálogo e aparecem em "Compre por categoria" na página inicial. Depois de criar, escolha a categoria ao cadastrar o produto. A foto da categoria nova é a foto da primeira peça dela.</p>
    <form class="box" id="form-cat" autocomplete="off">
      <h3 class="sec-t">Nova categoria</h3>
      <div class="field"><label for="c-nome">Nome da categoria</label><input type="text" id="c-nome" maxlength="30" placeholder="Ex.: Shorts" required></div>
      <p class="msg erro" id="cat-erro" role="alert" hidden></p>
      <button class="btn" type="submit">Adicionar categoria</button>
    </form>
    <h3 class="sec-t">Categorias que você criou</h3>
    ${extras.length ? `<div class="alist">${extras.map(c => `
      <div class="arow link">
        <div class="arow-b">
          <div><div class="arow-n">${esc(c.nome)}</div><div class="arow-m">${usos(c.k)} ${usos(c.k) === 1 ? 'produto' : 'produtos'}</div></div>
          <div class="arow-a">
            ${admin.confirmar === 'cat-' + c.k
              ? `<span class="msg">Excluir esta categoria?</span>
                 <button class="btn small danger" type="button" data-del-cat-sim="${esc(c.k)}">Sim, excluir</button>
                 <button class="btn small ghost" type="button" data-del-nao>Cancelar</button>`
              : usos(c.k) ? `<span class="arow-m">Mude os produtos para outra categoria para poder excluir.</span>`
              : `<button class="btn small plain" type="button" data-del-cat="${esc(c.k)}">Excluir</button>`}
          </div>
        </div>
      </div>`).join('')}</div>` : '<p class="empty">Você ainda não criou nenhuma categoria.</p>'}
    <h3 class="sec-t">Categorias padrão</h3>
    <div class="chips">${Object.values(TIPOS).map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
  `;
}

function listaLinks() {
  const ls = cfg.links || [];
  return `
    <p class="note">O quiz, a página Sobre, o catálogo e o WhatsApp já aparecem na página inicial. Aqui você cadastra os outros links, como Instagram, TikTok, YouTube ou um mapa.</p>
    <button class="btn" type="button" data-novo-link>+ Novo link</button>
    ${ls.length ? `<div class="alist">
      ${ls.map(l => `
        <div class="arow link">
          <div class="arow-b">
            <div><div class="arow-n">${esc(l.titulo)}</div><div class="arow-m">${esc(l.url)}</div></div>
            <div class="arow-a">
              ${admin.confirmar === l.id
                ? `<span class="msg">Excluir este link?</span>
                   <button class="btn small danger" type="button" data-del-link-sim="${esc(l.id)}">Sim, excluir</button>
                   <button class="btn small ghost" type="button" data-del-nao>Cancelar</button>`
                : `<button class="btn small ghost" type="button" data-edit-link="${esc(l.id)}">Editar</button>
                   <button class="btn small plain" type="button" data-del-link="${esc(l.id)}">Excluir</button>`}
            </div>
          </div>
        </div>`).join('')}
    </div>` : '<p class="empty">Nenhum link extra cadastrado.</p>'}
  `;
}

const linkFotoAtual = () => admin.linkFoto === undefined ? (admin.edit && admin.edit.id ? fotoLink(admin.edit.id) : '') : fotoOk(admin.linkFoto);
function formLink() {
  const l = admin.edit.id ? (cfg.links || []).find(x => x.id === admin.edit.id) : null;
  const v = l || { titulo: '', sub: '', url: '' };
  return `
    <h3 class="sec-t">${l ? 'Editar link' : 'Novo link'}</h3>
    <form class="box" id="form-link" autocomplete="off">
      <div class="field"><label for="l-titulo">Título</label><input type="text" id="l-titulo" maxlength="60" value="${esc(v.titulo)}" placeholder="Ex.: Nosso TikTok" required></div>
      <div class="field"><label for="l-sub">Frase curta (opcional)</label><input type="text" id="l-sub" maxlength="70" value="${esc(v.sub)}" placeholder="Ex.: Veja os lançamentos"></div>
      <div class="field"><label for="l-url">Endereço do link</label><input type="url" id="l-url" value="${esc(v.url)}" placeholder="https://" required></div>
      <div class="field">
        <span class="lbl">Foto do card (opcional)</span>
        <span class="badge-prop">Proporção ${PROP_LINK.prop}</span>
        <div class="slot-prev" id="link-prev" style="--ar:${PROP_LINK.ar}">${linkFotoAtual() ? `<img src="${linkFotoAtual()}" alt="Foto do card">` : 'Sem foto'}</div>
        <small>Tamanho sugerido: ${PROP_LINK.px}. O título e o botão ficam no lado direito do card, então deixe o assunto da foto no lado esquerdo. Sem foto, o card aparece em marrom escuro.</small>
        <div class="slot-a">
          <label class="btn small filebtn">Escolher foto<input class="sr" type="file" id="l-foto" accept="image/*"></label>
          <button class="btn small plain" type="button" data-tirar-linkfoto>Remover foto</button>
        </div>
      </div>
      <p class="msg erro" id="link-erro" role="alert" hidden>Digite um endereço válido, começando com https://</p>
      <button class="btn" type="submit">Salvar link</button>
      <button class="btn plain" type="button" data-cancelar>Cancelar</button>
    </form>`;
}

function formSobre() {
  const s = S();
  return `
    <p class="note">Aqui você edita os textos da página "Conheça a ${esc(cfg.marca)}". Ela aparece para os clientes assim que você salvar.</p>
    <form class="box" id="form-sobre" autocomplete="off">
      ${SOBRE_CAMPOS.map(c => `
        <div class="field">
          <label for="s-${c.k}">${c.r}</label>
          <textarea id="s-${c.k}" rows="${c.l}">${esc(s[c.k])}</textarea>
          ${c.d ? `<small>${c.d}</small>` : ''}
        </div>`).join('')}
      <button class="btn" type="submit">Salvar página Sobre</button>
      <button class="btn plain" type="button" data-restaurar-sobre>Voltar aos textos originais</button>
    </form>`;
}

function formAjustes() {
  return `
    <p class="note">As fotos do site (capa, cards, categorias e produtos) são trocadas na aba <b>Fotos</b>.</p>
    <form class="box" id="form-ajustes" autocomplete="off">
      <div class="field"><label for="a-marca">Nome da loja</label><input type="text" id="a-marca" maxlength="40" value="${esc(cfg.marca)}" required></div>
      <div class="field"><label for="a-seg">Tipo de loja</label><input type="text" id="a-seg" maxlength="40" value="${esc(cfg.segmento)}"></div>
      <div class="field"><label for="a-frase">Frase em destaque (letra cursiva)</label><input type="text" id="a-frase" maxlength="60" value="${esc(cfg.frase)}"></div>
      <div class="field"><label for="a-arroba">Instagram</label><input type="text" id="a-arroba" maxlength="40" value="${esc(cfg.arroba)}"></div>
      <div class="field">
        <label for="a-whats">WhatsApp com DDD</label>
        <input type="text" id="a-whats" inputmode="tel" value="${esc(cfg.whatsappExibir)}" required>
        <small>É para este número que vão todos os botões de WhatsApp.</small>
      </div>
      <div class="field">
        <label for="a-end">Endereço da loja</label>
        <textarea id="a-end" rows="2" maxlength="160">${esc(cfg.endereco)}</textarea>
        <small>O botão "Como chegar" abre este endereço no mapa do celular.</small>
      </div>
      <div class="field">
        <label for="a-mapa">Link do Google Maps (opcional)</label>
        <input type="url" id="a-mapa" value="${esc(cfg.mapaUrl)}" placeholder="https://maps.app.goo.gl/...">
        <small>Se preferir o ponto exato da loja, cole aqui o link de "Compartilhar" do Google Maps. Se deixar vazio, o site usa o endereço acima.</small>
      </div>
      <p class="msg erro" id="aj-erro" role="alert" hidden></p>
      <button class="btn" type="submit">Salvar ajustes</button>
    </form>
    <form class="box" id="form-senha" autocomplete="off">
      <h3 class="sec-t">Trocar a senha</h3>
      <div class="field"><label for="s-nova">Nova senha</label><input type="password" id="s-nova" autocomplete="new-password" minlength="6"><small>Pelo menos 6 caracteres.</small></div>
      <div class="field"><label for="s-rep">Repita a nova senha</label><input type="password" id="s-rep" autocomplete="new-password"></div>
      <p class="msg erro" id="senha-erro" role="alert" hidden></p>
      <button class="btn ghost" type="submit">Trocar senha</button>
    </form>
    <p class="note">${store.db ? 'Os dados ficam salvos no banco do artefato e aparecem para todos os visitantes.' : 'Neste ambiente de teste os dados ficam salvos só neste navegador.'}</p>
  `;
}

