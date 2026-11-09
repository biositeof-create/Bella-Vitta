/* Fotos da marca (arquivos em assets/img/) */
const IMG = {
  hero: 'assets/img/hero.jpg',
  t1: 'assets/img/t1.jpg',
  t2: 'assets/img/t2.jpg',
  t3: 'assets/img/t3.jpg',
  t4: 'assets/img/t4.jpg',
  t5: 'assets/img/t5.jpg'
};

/* ===== Dados padrão (exemplo). Depois do primeiro salvamento na ADM, tudo passa a vir do banco de dados. ===== */
const SENHA_PADRAO_HASH = '108551dada0addb21685bdc60214e7c756ff9273061951de47b12be99d66fee6';
const DEFAULT_SOBRE = {
  chamada: 'Fazer cada mulher se sentir ainda mais bonita, confiante e especial.',
  quem: 'A Bella Vitta nasceu com um propósito: fazer cada mulher se sentir ainda mais bonita, confiante e especial através da moda.\nSomos uma loja de moda feminina que acredita que cada mulher possui sua própria beleza, personalidade e estilo. Por isso, trabalhamos com uma seleção especial de peças que unem elegância, tendências, qualidade e versatilidade.\nNossa missão é proporcionar uma experiência de compra agradável, oferecendo roupas que valorizam diferentes estilos e acompanham você em todos os momentos: desde um encontro especial até os compromissos do dia a dia.\nNa Bella Vitta, acreditamos que vestir-se bem é também uma forma de expressar quem você é.',
  como: 'Nossa loja trabalha com atendimento digital e vendas online, proporcionando praticidade e comodidade para nossas clientes.\nVocê pode navegar pelo nosso catálogo, conhecer nossas coleções, escolher suas peças favoritas e finalizar seu pedido com o auxílio da nossa equipe pelo WhatsApp.',
  passos: 'Escolha suas peças favoritas em nosso catálogo.\nEntre em contato com nossa equipe pelo WhatsApp.\nConfirme tamanhos, cores e disponibilidade.\nEscolha a melhor forma de pagamento.\nReceba seu pedido no conforto da sua casa.',
  categorias: 'Blusas e croppeds\nCalças e jeans\nVestidos\nConjuntos femininos\nSaias e shorts\nLooks casuais\nModa elegante\nNovidades e tendências',
  categoriasTexto: 'Nossa seleção é pensada para mulheres que gostam de se vestir bem sem abrir mão do conforto e da personalidade.',
  difs: 'Moda atual: peças selecionadas de acordo com as principais tendências.\nAtendimento especializado: nossa equipe está pronta para ajudar você a encontrar o look ideal.\nCompra segura: transparência e cuidado em todas as etapas do pedido.\nFacilidade de pagamento: diferentes opções para facilitar sua experiência de compra.\nEntrega prática: recebemos seu pedido e organizamos a entrega conforme a disponibilidade da sua região.',
  horarios: 'Segunda a sexta-feira: 09h às 18h\nSábados: 09h às 14h\nDomingos e feriados: atendimento digital limitado',
  horariosNota: 'Os pedidos realizados fora do horário comercial serão respondidos no próximo período de atendimento.',
  entrega: 'Oferecemos opções de entrega conforme a região atendida, com prazos e valores informados durante a confirmação do pedido.',
  pagamentos: 'PIX\nCartão de crédito\nCartão de débito',
  pagamentoNota: 'As condições de parcelamento são informadas no momento da compra.',
  essencia: 'Mais do que acompanhar tendências, queremos ajudar mulheres a descobrirem novas versões de si mesmas.\nAcreditamos na beleza dos detalhes, na força da autoestima e no poder que um look especial tem de transformar um dia.',
  essenciaAssina: 'Qualidade, estilo e confiança em cada detalhe.'
};
const SOBRE_CAMPOS = [
  { k: 'chamada', r: 'Chamada principal', d: 'Frase curta que aparece na capa da página.', l: 2 },
  { k: 'quem', r: 'Quem somos', d: 'A primeira linha aparece em destaque. As outras ficam em "Ler mais".', l: 8 },
  { k: 'como', r: 'Como trabalhamos', d: 'Texto de abertura da seção.', l: 5 },
  { k: 'passos', r: 'Passos da compra', d: 'Um passo por linha. A numeração é automática.', l: 6 },
  { k: 'categorias', r: 'Categorias', d: 'Uma categoria por linha.', l: 6 },
  { k: 'categoriasTexto', r: 'Frase das categorias', d: '', l: 3 },
  { k: 'difs', r: 'Diferenciais', d: 'Um por linha, no formato Título: explicação.', l: 7 },
  { k: 'horarios', r: 'Horários de atendimento', d: 'Um horário por linha.', l: 4 },
  { k: 'horariosNota', r: 'Aviso sobre os horários', d: '', l: 3 },
  { k: 'entrega', r: 'Entrega', d: '', l: 3 },
  { k: 'pagamentos', r: 'Formas de pagamento', d: 'Uma por linha.', l: 4 },
  { k: 'pagamentoNota', r: 'Aviso sobre o pagamento', d: '', l: 3 },
  { k: 'essencia', r: 'Nossa essência', d: 'Cada linha vira um parágrafo.', l: 5 },
  { k: 'essenciaAssina', r: 'Frase final', d: 'Aparece em letra cursiva no fim da página.', l: 2 }
];
const DEFAULT_CFG = {
  marca: 'Bella Vitta',
  arroba: '@bellavitta',
  segmento: 'Moda feminina',
  frase: 'Vista a sua melhor versão',
  whatsapp: '5511999999999',
  whatsappExibir: '(11) 99999-9999',
  links: [{ id: 'l1', titulo: 'Siga a Bella Vitta no Instagram', sub: '@bellavitta', url: 'https://www.instagram.com/' }],
  endereco: 'Rua das Acácias, 245 – Jardim Paulista\nSão Paulo – SP',
  mapaUrl: '',
  heroFoto: '',
  sobre: DEFAULT_SOBRE,
  cats: [],
  senhaHash: '',
  iniciado: false
};
const DEFAULT_PRODS = [
  { id: 'p1', ordem: 1, nome: 'Blusa Decote Quadrado', tipo: 'blusa',    preco: 129, cor: '#1E1E22', corCat: 'neutro', estilo: 'minimal',   ocasiao: 'trabalho', caimento: 'justo',   corNome: 'Preto',          desc: 'Manga curta e cintura marcada com cinto.', foto: IMG.t1 },
  { id: 'p2', ordem: 2, nome: 'Calça Alfaiataria Bege', tipo: 'calca',   preco: 219, cor: '#D9C2A5', corCat: 'neutro', estilo: 'minimal',   ocasiao: 'trabalho', caimento: 'solto',   corNome: 'Bege',           desc: 'Cintura alta com pregas.', foto: IMG.t2 },
  { id: 'p3', ordem: 3, nome: 'Vestido Tubinho Chocolate', tipo: 'vestido', preco: 259, cor: '#5A2E1B', corCat: 'terra',  estilo: 'ousado',    ocasiao: 'festa',    caimento: 'justo',   corNome: 'Chocolate',      desc: 'Modelagem tomara que caia.', foto: IMG.t3 },
  { id: 'p4', ordem: 4, nome: 'Conjunto Alfaiataria Creme', tipo: 'conjunto', preco: 349, cor: '#EADBC8', corCat: 'neutro', estilo: 'minimal', ocasiao: 'trabalho', caimento: 'solto', corNome: 'Creme',        desc: 'Blazer e calça que combinam.', foto: IMG.t4 },
  { id: 'p5', ordem: 5, nome: 'Blusa Manga Bufante', tipo: 'blusa',     preco: 139, cor: '#D6246E', corCat: 'vivo',   estilo: 'romantico', ocasiao: 'passeio',  caimento: 'justo',   corNome: 'Pink',           desc: 'Decote quadrado e mangas bufantes.', foto: IMG.t5 },
  { id: 'p6', ordem: 6, nome: 'Vestido Floral Rosé',  tipo: 'vestido',  preco: 289, cor: '#E98CAB', corCat: 'rosa',   estilo: 'romantico', ocasiao: 'festa',    caimento: 'cintura', corNome: 'Rosé',           desc: '', foto: '' },
  { id: 'p7', ordem: 7, nome: 'Saia Midi Terracota',  tipo: 'saia',     preco: 179, cor: '#C4551E', corCat: 'terra',  estilo: 'casual',    ocasiao: 'dia',      caimento: 'cintura', corNome: 'Terracota',      desc: '', foto: '' },
  { id: 'p8', ordem: 8, nome: 'Jeans Reta Clássica',  tipo: 'calca',    preco: 259, cor: '#5B7DA8', corCat: 'neutro', estilo: 'casual',    ocasiao: 'dia',      caimento: 'justo',   corNome: 'Azul médio',     desc: '', foto: '' }
];

/* ===== Listas ===== */
const FORMAS = {
  vestido:  'M38 8 L42 8 L50 24 L58 8 L62 8 L66 36 L60 46 L82 112 L18 112 L40 46 L34 36 Z',
  blusa:    'M30 20 L42 12 Q50 22 58 12 L70 20 L84 44 L72 50 L68 40 L68 100 L32 100 L32 40 L28 50 L16 44 Z',
  calca:    'M32 10 L68 10 L72 112 L54 112 L50 50 L46 112 L28 112 Z',
  saia:     'M36 10 L64 10 L68 22 L88 108 L12 108 L32 22 Z',
  conjunto: 'M30 12 L44 10 L50 28 L56 10 L70 12 L86 40 L76 46 L70 36 L70 112 L54 112 L50 62 L46 112 L30 112 L30 36 L24 46 L14 40 Z'
};
const TIPOS = { blusa: 'Blusa', calca: 'Calça', vestido: 'Vestido', conjunto: 'Conjunto', saia: 'Saia' };
const FILTROS = { todos: 'Todos', blusa: 'Blusas', calca: 'Calças', vestido: 'Vestidos', conjunto: 'Conjuntos', saia: 'Saias' };
const ESTILOS = { romantico: 'Romântico', casual: 'Casual', minimal: 'Minimalista', ousado: 'Ousado' };
const CORES = { rosa: 'Rosa e nude', neutro: 'Preto, branco e neutros', terra: 'Tons terrosos e marrom', vivo: 'Cores vibrantes' };
const OCASIOES = { dia: 'Dia a dia', trabalho: 'Trabalho', festa: 'Festas', passeio: 'Passeios' };
const CAIMENTOS = { solto: 'Solto e fluido', justo: 'Ajustado', cintura: 'Cintura marcada' };

/* ===== Quiz ===== */
const PERGUNTAS = [
  { chave: 'estilo', titulo: 'Qual estilo de roupa mais combina com você?', opcoes: [
    { v: 'romantico', t: 'Romântico e delicado', s: 'Laços, florais e tecidos leves' },
    { v: 'casual',    t: 'Casual e confortável', s: 'Fácil de vestir, bom para todo dia' },
    { v: 'minimal',   t: 'Clean e minimalista',  s: 'Poucas cores, corte limpo' },
    { v: 'ousado',    t: 'Marcante e ousado',    s: 'Peças que chamam atenção' } ] },
  { chave: 'cor', titulo: 'Quais cores você mais gosta de usar?', opcoes: [
    { v: 'rosa',   t: 'Rosa e nude',          s: 'Tons suaves', dots: ['#F4B6C8', '#E98CAB', '#D9B8A3'] },
    { v: 'neutro', t: 'Preto, branco e bege',  s: 'Neutras e fáceis de combinar', dots: ['#2B2B30', '#EFE9E4', '#D9C2A5'] },
    { v: 'terra',  t: 'Marrom e terracota',    s: 'Tons terrosos e quentes', dots: ['#5A2E1B', '#C4551E', '#C9A27A'] },
    { v: 'vivo',   t: 'Cores vibrantes',       s: 'Vermelho, pink, cor forte', dots: ['#B3122B', '#D6246E', '#F2994A'] } ] },
  { chave: 'ocasiao', titulo: 'Para qual ocasião você mais procura roupa?', opcoes: [
    { v: 'trabalho', t: 'Trabalho',            s: 'Reuniões e rotina de escritório' },
    { v: 'dia',      t: 'Dia a dia',           s: 'Faculdade, mercado, café com amigas' },
    { v: 'festa',    t: 'Festas e eventos',    s: 'Jantares, casamentos, noite' },
    { v: 'passeio',  t: 'Viagens e passeios',  s: 'Praia, fim de semana, turismo' } ] },
  { chave: 'caimento', titulo: 'Como você gosta que a roupa caia no corpo?', opcoes: [
    { v: 'solto',   t: 'Soltinha e fluida',      s: 'Espaço para se mexer' },
    { v: 'justo',   t: 'Ajustada ao corpo',      s: 'Modelagem mais justa' },
    { v: 'cintura', t: 'Marcando a cintura',     s: 'Cintura definida, saia rodada' } ] },
  { chave: 'orc', titulo: 'Quanto você costuma investir em uma peça?', opcoes: [
    { v: 150,  t: 'Até R$ 150',        s: 'Peças acessíveis' },
    { v: 300,  t: 'De R$ 150 a R$ 300', s: 'Faixa intermediária' },
    { v: 9999, t: 'Acima de R$ 300',    s: 'Peças especiais' } ] }
];
const PERSONA = { romantico: 'charmosa e romântica', casual: 'descomplicada e elegante', minimal: 'elegante e atemporal', ousado: 'marcante e confiante' };
const COR_FRASE = { rosa: 'tons de rosa e nude', neutro: 'preto, branco e bege', terra: 'marrom e terracota', vivo: 'cores vibrantes' };
const ROTULOS = {
  estilo:   { romantico: 'Estilo romântico', casual: 'Estilo casual', minimal: 'Estilo minimalista', ousado: 'Estilo ousado' },
  ocasiao:  { trabalho: 'Para trabalhar', dia: 'Para o dia a dia', festa: 'Para festas', passeio: 'Para passear' },
  caimento: { solto: 'Caimento solto', justo: 'Caimento ajustado', cintura: 'Cintura marcada' }
};

