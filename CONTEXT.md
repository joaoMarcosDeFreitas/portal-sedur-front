# Contexto do projeto — Portal SEDUR (mock para apresentação)

> **Regra permanente:** este arquivo é a fonte de verdade sobre o estado do projeto entre sessões.
> Sempre que houver uma decisão relevante, uma resposta do usuário a uma pergunta em aberto, ou
> progresso real no código, **atualize este arquivo antes de encerrar a resposta**. No início de
> qualquer sessão nova (ou ao retomar esta), leia este arquivo primeiro para saber onde paramos.
> Mantenha-o organizado por seções (não cronológico) e resuma — não cole conversas inteiras aqui.
> O plano completo aprovado está em `C:\Users\joaom\.claude\plans\quizzical-crafting-simon.md`.

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

- **Cor de marca**: petróleo (`--color-primary-*`, base `#2a655f`/`#0f2c2a`), em vez do azul
  genérico do portal atual. **Acento único**: terracota (`--color-accent-*`, base `#c97b4a`).
- **Neutros**: cinza-quente (`--color-neutral-*`) — sensação editorial, não "sistema de governo
  antigo".
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

## Estado atual do código (Fase 0 concluída + início da Fase 1)

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
  em telas menores que `lg`, aberta pelo botão hambúrguer do `TopBar`). De cima pra baixo: espaço
  reservado pra logo (ainda não temos a logo oficial — placeholder tracejado com ícone), título
  "Portal SEDUR" (`font-display`, cor `text-brand`), nav vertical com ícone (`lucide-react`) +
  label por item (Serviços, Legislação, Notícias, Licitações, Transparência, Institucional,
  Formulários), estado ativo via `usePathname`.
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

## Próximos passos (nenhuma rota de conteúdo além da Home existe ainda)

Seguindo o plano (`quizzical-crafting-simon.md`), Fase 1 (fatia vertical completa) continua com,
em ordem sugerida:
1. `/servicos` (catálogo com busca) e `/servicos/[categoriaSlug]` (lista da categoria) —
   `lib/data/servicos.ts` já pronto para isso.
2. `/servicos/[categoriaSlug]/[servicoSlug]` — ficha genérica orientada a dados (usar
   `abasComConteudo`/`paraLista` de `lib/normalize/servico.ts`); destacar a família "Reforma"
   (Empreendimento) como exemplo de vitrine.
3. A busca (`/api/busca`) hoje só cobre seções fixas + serviços; ao construir legislação/notícias,
   estender esse Route Handler pra incluir esses domínios no dropdown também. Uma página `/busca`
   de resultados completos (não só dropdown) é opcional, não bloqueante.
4. `/login` (cidadão, estilo gov.br mockado) + `lib/auth/` (Context) + grupo `(private)` com guarda
   de autenticação.
5. Fluxo de solicitação: abrir → protocolo → DAM fictício → pagamento simulado → acompanhamento em
   `(private)/minhas-solicitacoes`.

Depois disso, Fase 2 (legislação, notícias, licitações, transparência unificada, institucional,
projetos, formulários, consultas, canais, sistemas parceiros) e Fase 3 (polimento/acessibilidade/
responsividade) — ver o plano para o detalhe de cada uma.
