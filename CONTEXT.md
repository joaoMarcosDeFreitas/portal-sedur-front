# Contexto do projeto — Portal SEDUR (mock para apresentação)

> **Regra permanente:** este arquivo é a fonte de verdade sobre o estado do projeto entre sessões.
> Sempre que houver uma decisão relevante, uma resposta do usuário a uma pergunta em aberto, ou
> progresso real no código, **atualize este arquivo antes de encerrar a resposta**. No início de
> qualquer sessão nova (ou ao retomar esta), leia este arquivo primeiro para saber onde paramos.
> Mantenha-o organizado por seções (não cronológico) e resuma — não cole conversas inteiras aqui.
> O plano completo aprovado está em `C:\Users\joaom\.claude\plans\quizzical-crafting-simon.md`.

## Forma de trabalho do usuário

O usuário às vezes edita arquivos do projeto **diretamente, por fora do Claude Code**, pra ajustes
pequenos, em vez de pedir aqui (confirmado por ele em 23/09/2026: "às vezes irei fazer isso para
evitar mandar tasks bobas pra você"). Quando aparecer um aviso de "arquivo mudou no disco", **não
é bug nem motivo de alarme** — é provavelmente ele mesmo mexendo. Ler o conteúdo novo, tratar como
estado atual (não reverter sozinho); se algo parecer quebrado de verdade (ex.: classe CSS inválida,
typo que muda comportamento), vale um aviso breve e sem alarde, mas sem tratar como pendência
bloqueante. (Ver `app/components/organisms/Footer.tsx`: em 23/09/2026 ele mesmo trocou a classe do
container do footer pra `flex items-center jus gap-50 py-12 text-center` — `jus` e `gap-50` não são
classes Tailwind válidas, então hoje não têm efeito nenhum; se ele não completar isso por conta
própria, perguntar antes de "consertar".)

## Objetivo do projeto

Construir, em `portal-sedur-front`, um sistema **completo porém mockado** (sem backend real) que
**unifica** o site institucional (`sedur.salvador.ba.gov.br`) e o Portal de Serviços
(`servicos.sedur.salvador.ba.gov.br`) em um único sistema, com design e UX muito superiores aos de
hoje. O objetivo final é o usuário **apresentar esse mock ao chefe dele**.

## Fonte de conteúdo: `reforma-portal/`

O usuário já conduziu (em sessões anteriores, registradas em `reforma-portal/CLAUDE.md`) uma
auditoria completa do portal real da SEDUR. Isso inclui:
- `reforma-portal/contexto-portal/` — o diagnóstico de cada seção do portal (fatos + problemas).
- `reforma-portal/preparacao-mock/dados/*.json` — **todo o conteúdo real coletado em JSON**: 151
  serviços (13 categorias), 1.079 normas de legislação, 804 notícias (192 com texto completo), 57
  licitações, organograma, 20 dirigentes, 6 projetos, 53 formulários, dados de sistema (consultas,
  geoserviços, canais de atendimento, sistemas parceiros, etc.). Ver
  `reforma-portal/preparacao-mock/README.md` e `modelo-de-dados.md` para o mapeamento completo.
- `reforma-portal/prints/image.png` — print do "Acesso Interno" (`/acessoremoto/`), mostrando que é
  só um hub de links para ~11 sistemas internos separados (Portal Sedur, SIGS, GLPI, Revista SEDUR,
  e-Salvador, Alfresco, SAPS, Webmail, SedurMap, BI, PDDU) — **fora do escopo deste projeto**.

**Não alterar nada dentro de `reforma-portal/`** — é material de origem, só leitura. Os dados usados
pelo app ficam em `data/` na raiz do projeto (cópia).

## Decisões confirmadas com o usuário

1. **Público-alvo**: cidadão (público geral) usando a parte pública do portal, e o mesmo cidadão
   **autenticado** (login gov.br simulado) numa área privada para acompanhar solicitações.
   **Não existe mais "área do funcionário"** neste projeto — o Acesso Interno real é um hub de
   sistemas internos totalmente separados, fora do escopo (ver print acima).
2. **Arquitetura**: reaproveitar a filosofia do `self-money-care-front` (Atomic Design, route groups
   `(public)`/`(private)`, auth mockada via Context) **corrigindo os problemas conhecidos**: sem
   classes Tailwind dinâmicas via interpolação, cores centralizadas em tokens, camada de mock-data
   de verdade (fetchers async com `sleep()` simulando latência).
3. **Escopo**: todo o conteúdo de `reforma-portal/preparacao-mock/dados/` (ver acima) — não haverá
   mais um "arquivo de módulos" separado, essa pasta já é a fonte de verdade do escopo.
4. **Sem comparação antes/depois na tela** — o mock mostra só a versão nova, corrigida, usando
   conteúdo real mas sem expor os bugs do portal atual.
5. **Fluxo do cidadão logado é totalmente simulado, mas completo**: abrir solicitação → protocolo →
   DAM fictício → "pagamento" simulado → acompanhamento com status.
6. **Identidade visual criada do zero** (o usuário pediu algo "minimalista, elegante, profissional,
   moderna, muito superior ao que está hoje na SEDUR"). Paleta e tipografia definidas e já
   implementadas — ver "Identidade visual implementada" abaixo.

## Identidade visual implementada (revisada após feedback do usuário)

- **PALETA ATUAL = cores extraídas do site da SEDUR (23/09/2026)**, a pedido do usuário ("mudança
  de cores"; a paleta petróleo/terracota anterior foi substituída). Extraído de `template.css` e
  das logos (1 pedido por vez, 2s de pausa, sem navegador — o firewall da Prefeitura bloqueia
  automação): azul da interface **`#006cb5`** (menu/botões/títulos; variações `#0166aa`, `#005ca9`,
  `#1d438f` navy, `#34558c`/`#1f5da6` links), ciano da logo **`#00b8f1`** (texto da logo:
  `#141717`), fundos claros `#f2f6f8`/`#eceeef`/`#dfe2eb`, cinzas `#333`/`#444`/`#999`/`#ddd`,
  dourado pontual `#FFD190` (não usado). Mapeamento no `globals.css`: `--color-primary-*` = escala
  do azul (600 = `#006cb5`), `--color-accent-*` = escala do ciano (500 = `#00b8f1`; texto usa o
  700 no claro e o 400 no escuro por contraste), `--color-neutral-*` = **neutros frios** (100 =
  `#f2f6f8`). A logo (`logo-black.png`/`logo-white.png`, 1080x130) foi baixada no scratchpad mas
  **não** foi colocada no projeto — o espaço da sidebar segue como placeholder; oferecer ao
  usuário se quiser usar a logo oficial.
- **Cor de marca**: azul SEDUR (`--color-primary-*`). **Acento único**: ciano (`--color-accent-*`).
- **Neutros**: cinza frio/azulado (`--color-neutral-*`).
- **Tema claro/escuro de verdade** (não é só `prefers-color-scheme`): atributo `data-theme` em
  `<html>`, alternado pelo usuário no `UtilityBar` (ícone sol/lua), persistido em
  `localStorage` (`portal-sedur:tema`) e aplicado antes da 1ª pintura por um script inline no
  `<head>` (`app/layout.tsx`) pra não piscar. **Importante**: cor de marca usada em TEXTO sobre
  fundo adaptável (sidebar, footer, cards) precisa vir de `text-brand`/`text-accent-text`
  (tokens que trocam de tom entre os temas — `--brand`/`--accent-text` em `globals.css`), nunca
  de `text-primary-700/800/900` fixo — isso causava texto ilegível no tema escuro (bug real
  encontrado e corrigido nesta rodada: título "Portal SEDUR" da sidebar/footer e a data dos
  cards de notícia ficavam pretos sobre fundo escuro). As escalas numeradas
  (`primary-50`..`primary-900`, `accent-50`..`accent-700`) continuam fixas e servem só pra
  fundos sólidos/chips (ex.: botão primário, círculo do ícone de categoria via `bg-primary-600/10`).
- Correção junto com a troca de cores: `not-found.tsx`/`error.tsx` tinham `bg-neutral-50` fixo
  (texto claro sobre fundo claro no tema escuro) — removido; `StatusTimeline` usa `bg-accent-700`
  na etapa atual (o ciano `500` não dá contraste com texto branco). Ao usar o ciano, **nunca
  como cor de texto pequeno sobre fundo claro** (contraste ~2,3:1) — usar `text-accent-text`.
- **Tipografia**: `ValleySans` (`font-display`) **só** para o título grande do hero (e pode ser
  replicado pontualmente, ex.: o "Portal SEDUR" da sidebar/footer usam `font-display` também).
  `Poppins` (`font-heading`) para h1/h2/h3 e títulos de card. `Montserrat` (`font-sans`) para
  corpo de texto — troquei a dupla Geist Sans/Mono (não pedida) por essas duas.
- Tokens completos em `app/globals.css` (`@theme inline`).
- **Cuidado ao editar `globals.css`**: um comentário CSS que contenha a sequência de caracteres
  `*/` no meio do texto (ex.: escrever `primary-*/--color-accent-*` numa frase) fecha o
  comentário antes da hora e quebra o build (`CssSyntaxError: Unknown word`) — já aconteceu
  nesta rodada, revisar comentários longos em CSS antes de salvar.
- Ainda **não existe** uma página `/dev/estilo` de showcase dos átomos — planejada mas não
  construída ainda; pode ser útil antes de avançar muito mais para validar a identidade com o
  usuário visualmente (sugestão, não bloqueante).

## Fase 1 concluída (23/09/2026): catálogo, ficha, login simulado e fluxo de solicitação

**Rotas novas** (todas verificadas ponta a ponta com navegador headless + `next build`):
- `/servicos` (categorias em ícones), `/servicos/[categoriaSlug]` (lista de serviços da categoria,
  `ServiceListItem`), `/servicos/[categoriaSlug]/[servicoSlug]` (ficha, `ServiceFicha`). As 13
  categorias e as 151 fichas são pré-renderizadas (`generateStaticParams`) — 323 páginas estáticas
  no build. Slug do serviço = `slugify(nome)-<id>` (único), da categoria = `slugify(nome)`.
- Ficha: tudo numa página só (sem abas), seções "Sobre o serviço", "Documentos necessários" (com
  observações e selo "Indispensável para análise"), "Taxas" (tabela + nota legal), "Prazo",
  "Informações", "Local e horário"; seções vazias/"N/A" não aparecem. Botão "Solicitar serviço" →
  `/solicitar/[id]`. Parsers em `lib/normalize/servico.ts`: `parseDocumentos`, `parseTaxas`,
  `parsePrazo`, `paraParagrafo` — o marcador "ITEM INDISPENSÁVEL PARA ANÁLISE" nos dados vem
  **depois** do documento que qualifica (confirmado: aparece até como última linha da lista).
- `/login` (público): **login de demonstração** — escolhe entre 2 perfis fictícios (Maria Souza, PF;
  Construtora Exemplo, PJ), sem senha e sem dado real (decisão minha por segurança/honestidade:
  não simular tela que pede credenciais). Aceita `?proximo=/caminho` (só caminhos internos —
  `destinoSeguro` evita open redirect).
- Grupo `(private)` com `AuthGuard` (client): sem sessão → `/login?proximo=<página>`; se a pessoa
  sai estando na área privada → home. Usa o mesmo `PortalShell` (sidebar/topbar) do público.
- `/solicitar/[servicoId]` → `SolicitacaoForm`: endereço, bairro, área (m²) **só se a taxa for por
  m²**, descrição, "anexar" documentos (simulado, sem arquivo) e declaração. Calcula o valor do DAM
  (`lib/solicitacoes/dam.ts`) e ao enviar gera protocolo `SEDUR-AAAA-NNNNNN` + DAM fictício
  (serviços sem taxa vão direto para "em análise").
- `/minhas-solicitacoes` (lista) e `/minhas-solicitacoes/[protocolo]` (`DetalheSolicitacao`: linha
  do tempo `StatusTimeline`, DAM com "Pagar com PIX/boleto" (simulado, confirma na hora), dados,
  e um botão "Simular conclusão (demonstração)" para o presenter avançar o status).
- TopBar mostra "Entrar" ou (logado) primeiro nome + botão Sair; Sidebar ganha "Minhas
  solicitações" quando logado.

**Persistência do mock**: `lib/store/local-store.ts` (`createLocalStore` + `useSyncExternalStore`)
guarda sessão (`portal-sedur:sessao`) e solicitações (`portal-sedur:solicitacoes`) em localStorage —
sobrevive a refresh, sincroniza entre abas, funciona em memória se o localStorage falhar. O
servidor sempre enxerga "sem sessão/sem solicitações"; por isso `useSessao()` expõe `hidratado`
(false no servidor e na hidratação) e as telas mostram "Carregando…" até ele virar true, senão
piscaria "não encontrado"/redirecionaria errado no refresh.

**Ajustes de passagem**: "Aumentar texto" não fazia nada (faltava CSS) — agora `html[data-text-size=
"grande"]` escala a fonte da raiz (tudo é rem); `PortalShell` usa `flex-1` (antes `min-h-full`)
para a sidebar ocupar a altura toda em páginas curtas; tokens `--color-success/warning/danger`
têm versão mais clara no tema escuro (selos legíveis).

**Como verificar visualmente — NÃO usar a extensão/ferramentas `claude-in-chrome`** (o usuário
pediu em 23/09/2026 pra não usar: ela apareceu conectada em máquinas que ele não queria). Usar
`puppeteer-core` instalado no scratchpad da sessão (fora do projeto) com o Edge local
(`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`) em headless; ver o padrão nos
scripts `e2e.js`/`e2e2.js` do scratchpad (não versionados; se a sessão for nova, recriar). Servidor de produção em
outra porta (`next start -p 3100`) evita conflito com o `next dev`. `waitUntil: "networkidle0"`
nunca resolve por causa dos prefetches do Next — usar `"load"` + sleep.

## Fase 2 concluída (23/09/2026): todos os módulos de conteúdo

Verificado com `next build` (1.162 páginas estáticas), crawler de links (1.225 URLs internas, 0
erros), testes de interação em Edge headless e capturas nos temas claro/escuro e em 390px.

- **/legislacao — navegação por ÍCONES como no portal oficial (pedido do usuário, 23/09/2026)**:
  `/legislacao` mostra os 14 tipos de norma como ícone + título (mesmo `IconTile` das categorias de
  serviço, sem cartão) e uma busca global; clicar num tipo sem subdivisão abre direto a lista
  (`/legislacao/[secao]`, ex.: Decretos); tipos com subdivisão (CNLU, Desapropriação, Louos 2016, PDDU 2016,
  Taxas/Multas) abrem uma tela com os ícones dos subtipos (`/legislacao/cnlu` → Comunicados/Resoluções) e cada
  subtipo abre a lista (`/legislacao/[secao]/[sub]`); nessa tela há também "Ver todos os documentos de X"
  (`?todos=1`). `?q=` mostra a busca em toda a legislação; o link antigo `?secao=leis` redireciona para
  `/legislacao/leis`. Ícones em `lib/ui/legislacao-icons.ts` (tipo e subtipo) via `LegislacaoIcon`
  (`createElement`, como o `CategoryIcon`). Subtipos têm `id` sem o prefixo do JSON (`sub_797-comunicados` →
  `comunicados`). 1.079 documentos, do mais novo ao mais antigo; a 1ª página vem do servidor, o resto de
  `/api/legislacao` ("Mostrar mais", aceita `secao` e `subsecao`). Arquivos que não abrem (404, vazio, sem
  link) aparecem como "Documento em atualização" (sem botão) em vez de link quebrado.
  `lib/data/legislacao.ts` + `lib/normalize/legislacao.ts` (número normalizado: "nº", inicial maiúscula, sem
  ponto final). `LegislacaoExplorer` ganhou `travarTipo`/`subsecao` (sem os botões de filtro quando o tipo já
  foi escolhido pelos ícones).
- **/noticias** (busca + ano + paginação por links, formulário GET sem JS) e **/noticias/[id]** (804
  páginas estáticas; para as 612 sem texto há aviso + link "Ver publicação original"; navegação "mais
  recente/mais antiga" corrigida). **As imagens das notícias foram removidas de propósito**: eram
  hotlinks para o site atual (não carregavam e deixavam um bloco vazio).
- **/licitacoes** — 57 linhas viram ~49 entradas: edital + avisos + retificações do mesmo processo ficam
  agrupados ("Concorrência 1/2023"); modalidade deduzida do título (`lib/normalize/licitacao.ts`);
  filtros por modalidade/ano/busca; objetos em MAIÚSCULAS convertidos para caixa de frase. **Não há coluna
  "situação"**: o dado de origem não existe (não inventamos).
- **/transparencia — navegação por ÍCONES (mesmo padrão da Legislação, pedido do usuário)**: unifica as duas
  "Transparências" num único nível de 10 ícones: os 7 painéis (`/transparencia/[slug]`), "Ações Fiscais –
  COVID (PDF)" (ícone que abre o PDF em nova aba — `IconTile` ganhou `externo`), "Audiências públicas"
  (`/transparencia/audiencias-publicas`) e "Estudos de Impacto de Vizinhança (EIV/RIV)"
  (`/transparencia/eiv-riv`, 24 arquivos numa lista recolhível). Ícones em `lib/ui/secoes-icons.ts`;
  `parseProcesso`/`rotuloDoArquivo` em `lib/normalize/transparencia.ts`.
- **/consultas** (8) e **/transparencia/[slug]** (7 painéis) — formulário GET renderizado no servidor
  (`ConsultaView`, `lib/data/consultas.ts`). **As 4 consultas de atividades usam dados REAIS completos**;
  as por número (auto, CGA, solicitação, alvará) e os 7 painéis usam **dados de demonstração fictícios e
  determinísticos** (gerador com semente), sempre sinalizados na tela. Dois modos: "catalogo" (lista
  sempre visível + filtro + paginação) e "busca" (só responde após consultar; mensagem de não achado).
  Detalhes do alinhamento com o portal antigo: ver "Próximos passos" → passo 2. Os painéis já mostram dados
  por padrão (no portal atual abriam vazios).
- **/institucional — navegação por ÍCONES (mesmo padrão, pedido do usuário)**: a página tem 4 ícones —
  Áreas de atuação (`/institucional/areas-de-atuacao`: 7 ícones, usando o ícone da categoria de serviços
  correspondente; cada um abre `/institucional/areas-de-atuacao/[area]` com o texto, os tópicos e "Ver
  serviços desta área"), Programas e projetos (`/institucional/projetos`: 6 ícones → `/institucional/projetos/[slug]`;
  links de serviço do portal antigo viram links para a ficha; links quebrados somem), Dirigentes
  (`/institucional/dirigentes`, avatar com iniciais, sem foto) e Estrutura organizacional
  (`/institucional/estrutura-organizacional`, organograma como árvore `OrgTree`). Mapa área→categoria/slug em
  `lib/data/institucional.ts` (`DADOS_DA_AREA`); ícones dos projetos e das 4 portas em `lib/ui/secoes-icons.ts`.
  Componente genérico `MappedIcon` (createElement) para ícones vindos de mapas.
- **/formularios** (53 únicos, busca), **/canais-de-atendimento**, **/sistemas-parceiros** (Salvador Ruas
  marcado "Em manutenção"; Autorização para Feira/CLE omitido), **/geoservicos** (camadas; sem URLs WFS
  porque não foram coletadas), **/servicos/dispensados-de-licenca**. `/servicos` ganhou a seção "Mais
  recursos" com links para esses; a sidebar ganhou "Consultas".
- **Busca global** (`/api/busca`) agora cobre seções, serviços, consultas/painéis, legislação e notícias.
- `lib/utils/sleep.ts` não espera durante `next build` (`NEXT_PHASE`), senão as ~1.100 páginas estáticas
  demoravam à toa.
- **Bug mobile achado e corrigido**: o footer (editado à mão pelo usuário: `flex items-center jus gap-50`,
  que em Tailwind v4 dá gap de 200px) estourava 63px na horizontal no celular; agora empilha abaixo de
  `md` (`flex-col ... md:flex-row md:gap-50`), desktop idêntico ao dele. `jus` continua sendo classe
  inválida (sem efeito) — deixei como está.
- **Armadilha**: ao editar arquivos com regex via script `node` + heredoc, as barras invertidas podem ser
  perdidas (aconteceu em `lib/normalize/licitacao.ts`, e de novo ao editar este arquivo); para regex ou
  texto com barras use as ferramentas Edit/Write, não script.

## Estado atual do código (Fase 0 + base do layout)

**Dados e tipos**
- `data/*.json` — cópia read-only de `reforma-portal/preparacao-mock/dados/`.
- `types/*.ts` — tipos TypeScript para todos os domínios (servico, legislacao, noticia, licitacao,
  sistema-servicos, institucional). Conferidos contra o JSON real (alguns campos foram corrigidos
  durante a implementação porque o relatório inicial dos agentes de exploração tinha pequenas
  imprecisões de schema — sempre conferir o JSON real ao estender, não só a documentação).
- `lib/utils/sleep.ts`, `lib/utils/slugify.ts` — utilitários.
- `lib/normalize/texto.ts`, `lib/normalize/servico.ts` — limpeza de conteúdo (esconde abas
  vazias/"N/A", corrige o caractere quebrado "¿" → "–").
- `lib/data/*.ts` — camada de acesso: `servicos.ts`, `legislacao.ts`, `noticias.ts`,
  `licitacoes.ts`, `institucional.ts` (dirigentes/organograma/projetos/área de atuação),
  `formularios.ts`, `sistema-servicos.ts` (consultas/geoserviços/canais/sistemas
  parceiros/transparência do portal), `transparencia.ts` (transparência do site). Todas as funções
  são `async` com latência simulada.

**UI — layout geral: sidebar fixa à esquerda + topbar (não é mais header horizontal)**
- `app/components/organisms/PortalShell.tsx` — client component "dono" do layout público: estado
  do menu mobile (`menuAberto`), renderiza `Sidebar` + coluna da direita (`UtilityBar` + `TopBar`
  + `<main>` + `Footer`). É isso que `app/(public)/layout.tsx` usa.
- `app/components/organisms/Sidebar.tsx` — fixa à esquerda (`lg:static`, vira gaveta com overlay
  em telas menores que `lg`, aberta pelo botão hambúrguer do `TopBar`). De cima pra baixo: **logo
  oficial da SEDUR + Prefeitura de Salvador** (link para a home; `public/logo/sedur-logo-escura.png` no
  tema claro e `sedur-logo-clara.png` no escuro, trocadas pelo variante `dark:` — definido em
  `globals.css` com `@custom-variant dark` para seguir o `data-theme`, não o sistema), **sem título
  "Portal SEDUR" em texto** (o usuário pediu para tirar; o footer ainda tem), nav vertical com ícone
  (`lucide-react`) + label por item (Serviços, Consultas, Legislação, Notícias, Licitações,
  Transparência, Institucional, Formulários), estado ativo via `usePathname`.
- `app/components/organisms/TopBar.tsx` — client, ocupa o espaço onde antes ficava o menu
  horizontal: `SearchBar` grande (sem botão) + botão "Entrar" separado no canto direito + botão
  hambúrguer (só mobile). **Sem fundo nem borda** — nada separando visualmente a barra de busca do
  título "Um só portal..." logo abaixo (pedido explícito do usuário).
- `app/components/organisms/UtilityBar.tsx` — faixa fina acima do TopBar com "Aumentar texto" e o
  toggle de tema claro/escuro (substituiu o antigo "alto contraste" do `AccessibilityBar`, que foi
  removido).
- `app/components/molecules/SearchBar.tsx` — **busca ao vivo** (não navega mais pra `/busca`):
  digita → debounce de 200ms → `fetch('/api/busca?q=...')` → dropdown com resultados (seções do
  portal + serviços que batem no nome/categoria). Sem botão "Buscar".
- `app/api/busca/route.ts` — Route Handler que faz a busca no servidor (hoje: seções fixas do
  portal + `getTodosOsServicos()`); ponto de extensão natural pra incluir legislação/notícias
  depois.
- `app/components/atoms/CategoryIcon.tsx` + `lib/ui/category-icons.ts` — ícone por categoria de
  serviço (mapa nome→ícone lucide). **Nota técnica importante**: `CategoryIcon` usa
  `createElement` em vez de `<Icone />` de propósito — o ESLint do React Compiler
  (`react-hooks/static-components`) acusa "componente criado durante a renderização" quando uma
  variável de componente vinda do retorno de uma função é usada como tag JSX, mesmo sendo estável;
  `createElement` não passa por esse checador. Vale lembrar esse padrão se aparecer o mesmo erro
  em outro lugar.
- `app/components/molecules/CategoryListItem.tsx` — ícone em cima + título embaixo, **sem
  card/borda em volta**, sem contador de serviços, em `flex flex-wrap` (quebra linha sozinho).
- `app/components/atoms/` — `Text` (variantes agora usam `font-heading`/Poppins para h1-h3 e
  `font-display`/ValleySans só pro `display`; tons `default/muted/inverted/accent/brand`, os dois
  últimos usam tokens que trocam com o tema), `Button`/`LinkButton` (sempre `cursor-pointer`,
  inclusive `disabled:cursor-not-allowed`), `Badge`, `Container`.
- `app/components/organisms/Footer.tsx` — redesenhado: claro/moderno, **sem fundo e sem borda
  nenhuma** (nem entre o footer e o conteúdo acima, nem entre o bloco de colunas e a linha de
  copyright) — a página fica "lisa" até o final, igual ao resto. **Simplificado a pedido do
  usuário**: as colunas "Portal" e "Institucional" (links duplicando a navegação, que já está na
  sidebar) foram removidas; ficou só "Atendimento" (agora em coluna vertical, `flex flex-col`) e o
  bloco de identidade/localização (Portal SEDUR + descrição + endereço/horário, embaixo,
  `max-w-3xl` — bem mais largo que antes, que dividia 1/4 do grid). **Todo o conteúdo do footer é
  centralizado horizontalmente** (`items-center text-center` no container, inclusive a linha de
  copyright) — não voltar a alinhar à esquerda/em grid sem o usuário pedir.
- `app/globals.css` — tokens de tema claro/escuro (ver seção de identidade visual acima).
- `app/layout.tsx` — fontes Montserrat/Poppins/ValleySans, `suppressHydrationWarning` no `<html>`
  (necessário porque o script de tema no `<head>` muda o atributo `data-theme` antes do React
  hidratar — sem isso o React loga aviso de mismatch nesse atributo específico; é o padrão
  recomendado pelo Next.js para esse tipo de script), script inline no `<head>` que aplica o
  tema salvo antes da 1ª pintura (evita flash), `lang="pt-BR"`.
- `app/(public)/page.tsx` — Home: hero **sem** busca duplicada (a busca grande já fica na topbar,
  fixa em toda página pública) e sem a lista de atalhos (viraram itens da sidebar); categorias
  como lista de ícones (`CategoryListItem`); notícias como cards.

**Regra de fundo/borda das seções (pedido explícito do usuário, cuidado ao adicionar seção
nova)**: em toda a área pública, **a página é "lisa"** — só a seção "Categorias de serviço" tem
fundo diferente (`bg-surface-muted`) **e** borda em cima e embaixo (`border-y border-border`, ver
`app/(public)/page.tsx`). Todo o resto (Hero, Notícias, TopBar, UtilityBar, Footer) não tem
`bg-*` nem `border-*` nenhuma — nada separando visualmente essas partes umas das outras. Ao criar
uma seção nova na Home (ou em qualquer página pública), **não** dar fundo/borda a ela a menos que
o usuário peça, e se pedir uma seção "de destaque" como Categorias, esse é o padrão a seguir
(`border-y border-border bg-surface-muted`).
- `app/not-found.tsx`, `app/error.tsx` — páginas de erro com identidade do portal.
- Removidos: `app/page.tsx` (boilerplate), `app/(public)/home/` (stub quebrado),
  `app/components/organisms/Header.tsx` e `AccessibilityBar.tsx` (substituídos por
  Sidebar/TopBar/UtilityBar), `app/components/molecules/CategoryCard.tsx` (virou
  `CategoryListItem.tsx`).
- `next.config.ts` — `turbopack.root` fixado no diretório do projeto.
- Dependência nova: `lucide-react` (ícones).

**Verificado nesta rodada**: `npx tsc --noEmit` limpo, `npx eslint .` limpo, `npm run dev` sobe sem
erros, testado visualmente no Chrome (via skill `claude-in-chrome`) nos dois temas — busca ao vivo
filtrando corretamente (ex.: digitar "reforma" mostra as 4 fichas da família Reforma), sidebar,
topbar e footer conferidos em tema claro e escuro.

**Bugs reais encontrados e corrigidos nesta rodada de revisão visual** (guardar como aprendizado):
1. Cor de marca fixa (`text-primary-700/800/900`) usada como texto sobre fundo que muda de tema
   ficava ilegível no escuro — corrigido com os tokens `text-brand`/`text-accent-text` (ver
   "Identidade visual" acima). **Sempre que adicionar um componente novo com cor de marca em
   texto, usar esses tokens, nunca a escala numérica fixa.**
2. Comentário CSS com `*/` no meio do texto quebrou o build inteiro (`CssSyntaxError`). Revisar
   comentários longos em `.css` antes de salvar.
3. `eslint-plugin-react-hooks` (regras do React Compiler, ativas neste projeto) reprova: (a)
   atribuir o retorno de uma função a uma variável maiúscula e usá-la como tag JSX
   (`react-hooks/static-components` — resolvido com `createElement`, ver `CategoryIcon.tsx`); (b)
   chamar `setState` diretamente dentro do corpo síncrono de um `useEffect`
   (`react-hooks/set-state-in-effect` — resolvido reestruturando `SearchBar` pra derivar o estado
   exibido no render em vez de resetar via effect; no `UtilityBar`, o único caso realmente
   inevitável — sincronizar o estado do React com o atributo já aplicado no DOM por um script
   fora do React — ficou com um `eslint-disable-next-line` comentado explicando o motivo).

## Próximos passos — Fase 3 (polimento) e pendências

Numeração combinada com o usuário (os 5 passos que faltam depois da Fase 2; o logo já foi feito):

1. **Acessibilidade (AA)** — *não iniciado*: revisar contraste do ciano/acento, foco visível, um H1 por
   página, navegação por teclado no dropdown da busca (hoje só mouse; `role="option"` sem setas).
2. **Conferir o conteúdo com o usuário** — *em andamento* (o usuário pediu que os ajustes de fidelidade
   das consultas fiquem registrados aqui, porque o passo 3 ainda não começou):
   - **Consultas alinhadas ao portal antigo (feito em 23/09/2026)**. Método: ler o código das páginas
     salvas em `reforma-portal/preparacao-mock/coleta-bruta/portal-servicos/` (rótulos, botões, alertas,
     `wire:snapshot` do Livewire) — **sem nenhum pedido novo ao site**.
     - 4 consultas de atividades com **dados REAIS e completos** (`data/consultas-catalogos.json`, gerado por
       `extrair-catalogos.js` no scratchpad a partir do `wire:snapshot`, que guarda a lista inteira):
       Escritórios Virtuais (318, "Lista de atividades para escritórios virtuais", filtro "Filtrar"),
       Classificação de Risco (1.332, 7 colunas reais, "Decreto nº 38.673/2024", condicionante recolhida em
       "Ver condições"), Autônomos (203: Código Sefaz/Descrição/CNAE), Residências (170: CNAE/Descrição).
       Valores quebrados do original (ex.: risco sanitário "7490-") viram "—". Mostram
       "Dados oficiais da SEDUR…" em vez do aviso de fictício. Paginação de 20 (o original usa 10).
     - **Renovação de Publicidade (DAM)** = no portal antigo é "Consulta de DAMs em aberto por CGA": 1 campo
       CGA, botões Consultar/Limpar, nada aparece antes de consultar, e se não houver DAM a mensagem exata é
       "Não foi encontrado DAM em aberto para o CGA informado!". Casamento **exato** do CGA (parcial não
       acha). Linhas (DAM, valor, vencimento, situação "Em aberto") **continuam fictícias**: as colunas reais
       da lista são montadas pelo servidor e não estão no HTML salvo. CGAs de teste: 90147, 69584, 68802,
       49091, 92660.
     - **Solicitação de Serviços**: campos reais Origem / Ano / Número, botões Consultar/Limpar, mensagem de
       não achado do original ("SE não encontrada" → escrevemos "Solicitação não encontrada."); resultado fictício.
     - **Auto de Infração**: campo "Número do auto", botões Limpar/Pesquisar (reais); resultado fictício
       (só aparece após pesquisar, casamento exato).
   - **Ainda NÃO confirmado / a conferir**: (a) **Alvará de Publicidade** — a página salva dessa consulta é a
     tela de bloqueio do firewall da Prefeitura (COGEL), então não sabemos campos nem resultado; segue como
     estava (fictício); precisa de um print do portal real. (b) **Painéis de Transparência** (7) — também
     fictícios e ainda não alinhados; existe HTML salvo de cada painel para minerar do mesmo jeito.
     (c) Formato real das linhas de DAM e dos resultados de auto/solicitação (só um print de uma consulta
     real, com CGA/número reais, mostraria). (d) Tela de detalhe ao clicar numa linha: **não existe** hoje
     (as consultas só têm tabela); perguntar ao usuário se quer (todo o conteúdo do detalhe seria inventado).
   - Outros itens de conteúdo: nomes/cargos dos dirigentes (a página de origem pode estar desatualizada);
     texto das 612 notícias antigas (só o índice foi coletado — usam o fallback "ainda não foi migrado").
3. **Passe visual mais fino no mobile** — *não iniciado*. Já verificado: sem rolagem horizontal (390px) e
   gaveta da sidebar funcionando; falta revisar tabelas largas (as consultas de risco têm 7 colunas e rolam
   dentro do container), espaçamentos e toques.
4. **README do projeto** — *não iniciado* (ainda é o texto padrão do create-next-app).
5. **Páginas ocultas do portal antigo não migradas** — *não iniciado, decidir se vale*: IPTU Verde e
   Fiscalização do Carnaval (dados em `servicos-sistema.json` → `iptu_verde`, `fiscalizacao_carnaval_2026`).

Extras/pendências fora dos 5: página `/dev/estilo` (opcional); **nada foi commitado ainda** desde o commit
"Implementado a home page junto com a barra lateral" (dezenas de arquivos novos/alterados) — perguntar ao
usuário se quer commit; não há testes automatizados (só verificações manuais/headless).
