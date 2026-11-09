# Bella Vitta

BioSite (link-in-bio) da loja de moda feminina Bella Vitta: página inicial, Sobre, Quiz de estilo, Catálogo, página do produto e área administrativa — tudo em HTML, CSS e JavaScript puro, sem build e sem dependências de npm.

## Estrutura

```
.
├── index.html          # Entrada: carrega o CSS e os JS (ordem importa)
├── css/
│   └── style.css       # Todos os estilos (tema claro/escuro, telas, ADM)
├── js/
│   ├── data.js         # Fotos padrão, dados padrão, listas e perguntas do Quiz
│   ├── store.js        # Estado, utilidades, armazenamento (localStorage) e lógica do Quiz
│   ├── views.js        # Telas do cliente: início, Sobre, Quiz, resultado, produto, catálogo
│   ├── admin.js        # Área administrativa: login, produtos, fotos, categorias, links, ajustes
│   └── app.js          # Navegação por hash (#inicio, #sobre, #quiz, ...) e eventos globais
└── assets/
    └── img/            # Fotos da marca (hero.jpg, t1.jpg … t5.jpg)
```

Os scripts são carregados em ordem (`data → store → views → admin → app`) e compartilham o escopo global, como no arquivo único original. Não renomeie nem reordene sem ajustar as dependências entre eles.

## Como rodar

Sirva a pasta com qualquer servidor estático (o JavaScript usa `localStorage`, então abrir o arquivo com `file://` funciona, mas o servidor é o recomendado):

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

## Deploy

Publique a pasta inteira em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel...). Não há etapa de build.

## Administração

Acesse `#adm` na página inicial (botão ADM) e entre com a senha padrão do projeto. Na primeira vez, troque a senha em Ajustes. Os dados ficam salvos no `localStorage` do navegador; fotos enviadas pela ADM são convertidas para JPEG data URL e respeitam os limites de tamanho definidos no código.

## Notas

- As fotos padrão em `assets/img/` são referenciadas por `js/data.js` (`IMG.hero`, `IMG.t1` … `IMG.t5`). A função `fotoOk` em `js/store.js` aceita tanto `data:image/` (fotos enviadas pela ADM) quanto `assets/img/` (fotos padrão).
- Para trocar uma foto padrão, substitua o arquivo correspondente em `assets/img/` — não é preciso editar código.
