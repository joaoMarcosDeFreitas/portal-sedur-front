# Contexto do projeto — Portal SEDUR (mock para apresentação)

> **Regra permanente:** este arquivo é a fonte de verdade sobre o estado do projeto entre sessões.
> Sempre que houver uma decisão relevante, uma resposta do usuário a uma pergunta em aberto, ou
> progresso real no código, **atualize este arquivo antes de encerrar a resposta**. No início de
> qualquer sessão nova (ou ao retomar esta), leia este arquivo primeiro para saber onde paramos.
> Mantenha-o organizado por seções (não cronológico) e resuma — não cole conversas inteiras aqui.
> O plano completo aprovado está em `C:\Users\joaom\.claude\plans\quizzical-crafting-simon.md`.

## ONDE PARAMOS (atualizado em 25/09/2026) — leia primeiro

**Estado**: o sistema está **pronto para apresentar** (plano concluído; 120 testes unitários + 577 e2e verdes; ver seções
"Fidelidade à realidade" e "Testes automatizados"). O usuário vai subir na Vercel e mandar o link ao chefe (apresentação
hoje/segunda). **Nada disso foi commitado por mim** — ele faz o git.

**O que o usuário vai fazer agora (não fazer por ele):**
1. **Testar tudo à mão**, no Vivaldi (computador) e no celular, seguindo o passo a passo que montei na conversa (16 blocos: home,
   menu/busca, tema e acessibilidade, fichas, DAM/processo, consultas, transparência, legislação/notícias/licitações/formulários,
   institucional, agendamento, canais/parceiros, erros, teclado, celular, como anotar). **O passo a passo NÃO foi salvo em arquivo**
   (só está no histórico da conversa); se ele pedir de novo, refazer com os números de teste: CGAs `90147`, `69584`, `68802`, `49091`,
   `92660`; autos `091135` (Regularizado) e `003051` (Multa aplicada); solicitação SEDUR/2026/29505; alvará `2022-0169`; serviços de
   teste: Alteração de Razão Social (só DAM, id 6876), Autorização de Poda (só processo, 7053), AOP de Parâmetros Urbanísticos (os dois,
   1354), Defesa de Auto de Infração (nenhum, 7004), Habite-se (link interno para Geolocalização, 632).
2. **Trazer os apontamentos/correções** do que achar (formato pedido: onde, o que houve/esperado, dispositivo+navegador+tema,
   print, se bloqueia a apresentação). **Registrar na seção "Correções e polimento"** e só então corrigir.
3. **Ordem combinada:** testes automatizados (**feito**) → **polimento/correções (PRÓXIMO, depende dos apontamentos)** → hospedagem
   (Vercel, que ele mesmo faz; nenhuma alteração de código era necessária).

**Último item que eu estava fazendo (interrompido a pedido dele):** o documento de **Requisitos de Experiência do Usuário**,
arquivo **`docs/requisitos-de-experiencia-do-usuario.md`** (v1.0, 25/09/2026; 12 seções: escopo, diagnóstico do portal atual,
perfis, princípios, requisitos por área com código/prioridade/situação/verificação, jornadas com critérios de aceite, padrões de
interface, métricas, validação com usuários, limites e riscos, rastreabilidade, glossário). **Já está escrito no disco, mas o
usuário ainda NÃO leu nem aprovou** — ele disse que fará isso depois. Pendências conhecidas do documento: (a) a numeração das seções
pula de 5.9 para 5.11 (falta o 5.10) — renumerar; (b) os perfis são **hipóteses** (não houve pesquisa com usuários); (c) as métricas de
usuário e desempenho estão como "não medidas"; (d) requisitos marcados **Pendente**: BUS-06 (sinônimos na busca), BUS-07 (página de
resultados), SRV-10 (siglas CLE/nomes genéricos), FLX-10 (integração real), CON-07 (resultados reais), CNT-06 (texto das 612 notícias),
ACE-10 (leitor de tela real), MOB-08 (aparelhos reais/Firefox/Safari), DES-05 (Lighthouse). Ele pode querer o documento em Word/página
para mostrar ao chefe — **oferecer**, sem fazer antes de pedir.

**Não puxar sozinho:** git/commit, teste com NVDA/zoom, hospedagem (antes do polimento).

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
5. **Fluxo do cidadão logado é totalmente simulado, mas completo — e desde 25/09/2026 segue as AÇÕES REAIS de cada ficha**:
   "Emissão de DAM" (DAM → pagamento simulado → pago) e/ou "Abrir processo" (protocolo → análise); 15 serviços não têm botão.
   Ver "Fidelidade à realidade".
6. **REGRA DE AUTORIDADE (24/09/2026): o que já está construído neste front é a referência.** Ao comparar com os
   portais reais, só trazer o que FALTA de **conteúdo e páginas/acessos do cidadão** (ex.: "Nossos Projetos",
   IPTU Verde). **Não** "corrigir" o front para copiar chrome ou diferenças de apresentação do portal real:
   rodapé (mapa, redes sociais, CNPJ, mais/menos links), barra de acessibilidade completa/VLibras, banners e
   carrossel, menus etc. Vale para tudo, não só o rodapé.
7. **Identidade visual criada do zero** (o usuário pediu algo "minimalista, elegante, profissional,
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

## Fase 3b (24/09/2026): conteúdo e acessos que faltavam vir dos portais reais

**Método**: comparei os dados de origem (`reforma-portal/`, só o que ainda não tinha sido analisado) com o front,
seguindo a **regra de autoridade** (Decisões, item 6): só entrou conteúdo/página de acesso do cidadão que faltava.

**O que entrou**
- **Fichas de serviço: downloads dos documentos.** 30 serviços têm links (50) para modelos/anexos em PDF dentro das
  abas; a ficha ignorava. Agora cada documento exigido mostra "Baixar modelo · PDF" (nome acessível "Baixar X (PDF,
  abre em nova aba)"; casamento pelo texto do documento — os 48 casaram); a aba Informações lista materiais (manual,
  .zip). Links que apontam para outra ficha do portal antigo (`.../servico/6879`) viram **link interno** ("Ver o
  serviço", ex.: Habite-se → Geolocalização do Imóvel); http vira https. Conferi os 30 endereços com uma requisição
  de cabeçalho por vez, 2 s de pausa (28 ok, 2 redirecionam). Código: `resolverLinkDeFicha` (`lib/data/servicos.ts`),
  `linksDoDocumento` (`lib/normalize/servico.ts`), `LinkDeArquivo` em `ServiceFicha` (agora `async`).
- **IPTU Verde** e **Revisão do PDDU** como páginas de conteúdo em **Institucional → Programas e projetos**
  (`/institucional/projetos/iptu-verde` e `/revisao-do-pddu`). Conteúdo em `data/paginas-informativas.json`
  (blocos: título, parágrafos, subtítulo, itens, fecho — tipos `PaginaInformativa`/`BlocoDePagina`; `getProjetos`
  as junta aos 6 projetos e a página `[slug]` renderiza `blocos` quando existem). IPTU Verde ganhou "Como participar"
  e os **3 formulários Anexo 01/02/03** para baixar (a página antiga não os citava); **nenhum percentual ou lei foi
  inventado** (o original não diz). PDDU: texto real do site pddu.salvador.ba.gov.br (o que é o Plano Diretor,
  LOUOS, como é feito, por que revisar) + documentos + inscrição na oficina + link para o site completo; a "Linha do
  tempo" do original é montada por JS e não estava no HTML salvo.
- **Fiscalização Carnaval 2026** em **Transparência** (`/transparencia/carnaval`): 4 painéis como no original — só
  **Publicidade em Blocos (alvarás emitidos)** funciona; **Exploração de Atividades, Instalação de Praticável e
  Instalação de Balcão** aparecem "Em construção" (o original dava "Server Error" em inglês). O painel usa novo
  grupo `carnaval` em `consultas.ts` (filtros reais: 15 datas 04/02–18/02 e circuitos Batatinha/Dodô/Osmar; linhas
  fictícias) com tela de detalhe (`/transparencia/carnaval/[slug]/[registro]`).
- **Agendamento de atendimento** (`/agendamento`): estava só como link externo em Canais/Sistemas parceiros, mas é o
  acesso do cidadão mais visível nos dois portais. Agora é **simulado dentro do front**: assunto (as 13 categorias +
  "outro"), dia (15 próximos dias úteis), horário de **09:00 a 15:30** de meia em meia hora (o sistema real informa
  9:00 às 15:30), nome/contato, comprovante com protocolo `AGD-aaaa-nnnnnn` e "Meus agendamentos" (cancelar). Sem
  login, como no original; guarda em `localStorage` (`portal-sedur:agendamentos`); ~1 em 4 horários aparece
  "indisponível" (determinístico) e o já marcado por você também. Ligações: Canais → "Agendar atendimento" agora
  interno; Agendamento **saiu** de Sistemas parceiros; entrou em "Mais recursos" (Serviços) e na busca. **DECISÃO CONFIRMADA (24/09/2026): o
  Agendamento fica interno.** Arquivos: `types/agendamento.ts`,
  `lib/agendamento/store.ts`, `AgendamentoView.tsx`.
- Busca global (`/api/busca`) ganhou: Agendamento de atendimento, IPTU Verde, Revisão do PDDU, Fiscalização Carnaval 2026.

**Decidi NÃO trazer (de propósito)** — ou é chrome/apresentação (regra de autoridade) ou não há conteúdo. *(Atualizado em 25/09/2026: a barra de acessibilidade completa, o VLibras e a Autorização para Feira (CLE) **entraram depois** — ver "Fidelidade à realidade".)* rodapé oficial
(redes sociais, CNPJ, mapa), carrossel/banners da home (os destinos deles viraram "Acessos rápidos"), "Portal Fala
Salvador" (link morto), **Consulta Prévia Salvador** (a tela só monta no navegador; conteúdo desconhecido — segue
link externo em Sistemas parceiros), **Salvador Ruas** (em manutenção), **Mapeamento GIS** (mapa de outro sistema),
Acesso Interno (fora do escopo) e o carrossel "Fique por dentro" do
Portal de Serviços (banners só com imagem; um leva a 404, outro a site de empresa sem relação confirmada).

**Verificado** (`novos.js` no scratchpad): downloads da ficha, tiles/h1/links das páginas novas, filtros do Carnaval,
todo o fluxo do Agendamento (validação, teclado nos horários, foco no comprovante, persistência, cancelamento) e axe
0 violações em cada estado, claro/escuro, 1280 e 390px.

## Backend e natureza provisória do front (decisão do usuário, 24/09/2026)

**Tudo neste front é provisório e sujeito a mudança.** Não há backend; não é certo que um backend novo será criado —
há ~99% de chance de o front passar a usar o backend que **já existe** (sistemas atuais da SEDUR/Prefeitura). O
Agendamento, por exemplo, tem relação direta com o backend real. Consequências práticas: (1) as **costuras** com o
backend são `lib/data/*` (leitura), `lib/store/*` + `lib/auth/sessao.ts` + `lib/solicitacoes/store.ts` +
`lib/agendamento/store.ts` (escrita/sessão simuladas) — é aí que se troca o mock por chamadas reais, sem reescrever as
telas; (2) formatos de dados inventados para a demonstração (agendamento, DAM, protocolos, resultados das consultas)
vão mudar para o que o backend existente devolver; (3) não gastar esforço "blindando" o mock — mantê-lo simples e
bem separado da interface.

## Ordem combinada (atualizada em 25/09/2026)

Os **passos do plano estão concluídos** (Fases 0–3 e 3b). Em 25/09/2026 o usuário pediu esta ordem: **1º testes
automatizados (FEITO) → 2º polimento (PRÓXIMO; parte dos apontamentos que ele trará depois de testar o sistema) → 3º
hospedagem (Vercel, que ele mesmo faz; nenhuma alteração de código é necessária)**. Não puxar hospedagem antes do polimento.

## Deploy na Vercel (24/09/2026)

O usuário vai hospedar na Vercel e pediu **só as alterações necessárias**. Verificado: **nenhuma alteração de código foi
necessária.** Checagens feitas: raiz do repositório = pasta do projeto; `npm ci` + `next build` a partir de uma **cópia
limpa** só com os arquivos versionados (simulando o clone da Vercel, com `VERCEL=1 CI=1`) passa; o `package-lock.json`
traz os binários do Linux (Next SWC, Tailwind oxide, lightningcss, sharp); **todos os imports e nomes versionados
conferem maiúsculas/minúsculas** (Linux é sensível; script `caso.js`); nada necessário está no `.gitignore`; não há
variáveis de ambiente. Rotas dinâmicas (`ƒ`: `/api/*`, detalhes das consultas, `/minhas-solicitacoes/[protocolo]` etc.)
rodam como funções serverless. Configuração na Vercel: framework Next.js (automático), Root Directory = raiz, sem env vars.
Se o deploy for da branch `desenvolvimento`, ajustar a Production Branch ou usar a URL de Preview.

## Fidelidade à realidade e fechamento antes da apresentação (25/09/2026)

Contexto: o usuário vai subir na Vercel **hoje** e mandar o link para o chefe ver **no computador** (apresentação/segunda-feira);
testou no **Vivaldi** (Chromium). O chefe quer que **tudo que existe no portal atual esteja no front** e que **processos e
serviços estejam de acordo com a realidade**. Isso **reabre parte da regra de autoridade** só no que é *acesso do cidadão*
(barra de acessibilidade, VLibras, atalhos da home, sistemas da página inicial); **o rodapé continua como está** (o usuário
disse antes que diferenças de rodapé não contam — ficaram de fora: redes sociais, CNPJ, mapa, "Fala Salvador").

- **Ações reais das fichas (a maior correção de fidelidade).** Nos dados reais (`servicos.json` → `acoes`): **81 serviços só têm
  "Emissão de DAM", 50 só "Abrir processo", 5 têm as duas e 15 não têm botão nenhum**. O front oferecia "Solicitar serviço" em
  todos e juntava DAM + processo num só fluxo. Agora (`acoesDoServico` em `lib/data/servicos.ts`; textos dos botões = os do portal
  atual): a ficha mostra **só os botões que existem** (com uma frase explicando "DAM = Documento de Arrecadação Municipal" e
  que é preciso entrar) e, nos 15 sem botão, um aviso ("não tem botão de solicitação no Portal de Serviços") com link para os
  Canais. Rotas novas: **`/solicitar/[servicoId]/emitir-dam`** e **`/abrir-processo`** (só existem as que a ficha oferece; o resto é
  404; o endereço antigo `/solicitar/<id>` redireciona para a 1ª ação, ou para a ficha se não houver).
  - **Emissão de DAM**: confere as taxas (+ área se for por m²), gera o DAM (protocolo `DAM-aaaa-nnnnnn`), paga (PIX/boleto
    simulados) e **termina em "Pago" com comprovante** — não abre processo nem vai para "análise".
  - **Abrir processo**: endereço, bairro, descrição, documentos e declaração; protocolo `SEDUR-aaaa-nnnnnn` e vai direto para
    "Em análise" — **sem DAM** (o botão "Simular conclusão" só existe aqui). Tipos: `TipoSolicitacao` (`types/solicitacao.ts`),
    `criarSolicitacao({ tipo, … })`, `rotuloDoStatus`/`ROTULO_TIPO` (`lib/solicitacoes/status.ts`). Solicitações antigas guardadas
    no navegador (sem `tipo`) mantêm o fluxo combinado antigo.
  - **Limite honesto**: o que acontece depois do login gov.br no sistema real **nunca foi coletado** (o sistema caiu e o usuário
    não tem os prints). O fluxo é a melhor aproximação a partir das ações reais; **não inventar mais detalhes**.
- **Página em branco (404 sem JavaScript) — resolvido.** Causa: no Next 16.3.5, `notFound()` numa página dinâmica entrega um
  esqueleto vazio (`__next_error__`) que só se completa com JS. Solução em duas partes: (1) rotas de **lista fechada** e sem
  `searchParams` (notícias, serviços, categorias, projetos, áreas, `/solicitar/…/[acao]`) usam **`dynamicParams = false`** →
  404 verdadeiro com a página completa no servidor; (2) rotas que **leem filtros da URL** (consultas, painéis, Carnaval, legislação
  e as 3 fichas de detalhe) mostram `<NaoEncontrado />` **na própria página** (status 200, `robots: noindex`, título
  "Página não encontrada") em vez de `notFound()`. Testado com **JavaScript desligado** (`navegacao.spec.ts`). `/minhas-solicitacoes/[protocolo]`
  é área logada e client-side (mostra "Solicitação não encontrada" no próprio componente).
- **Home: "Acessos rápidos"** (8 ícones, sem fundo/borda): Agendamento, Consultas, Formulários, Geoserviços, Transparência, Canais,
  Revisão do PDDU e Sistemas parceiros — o que o portal atual põe na página inicial. **Sistemas parceiros** ganhou "Autorização
  para Feira (CLE)" (em manutenção), que estava omitido.
- **Barra de acessibilidade completa** (`UtilityBar` + `lib/acessibilidade/preferencias.ts`): além de "Aumentar texto" e do tema
  (= "contraste negativo"/"fundo claro" do portal atual), há o painel **Acessibilidade** com **Diminuir texto, Escala de cinza, Alto
  contraste, Links sublinhados, Fonte legível e Reiniciar**. Cada opção é um atributo em `<html>` (`data-text-size`, `data-cinza`,
  `data-contraste="alto"`, `data-links`, `data-fonte`), CSS em `globals.css`, **salvas em `localStorage`
  (`portal-sedur:acessibilidade`) e aplicadas antes da 1ª pintura** pelo script do `layout.tsx`. Alto contraste = tokens pretos/brancos/amarelos
  (`:root[data-contraste="alto"]`) e logo clara forçada. O tamanho do texto agora **persiste** entre páginas. Painel: Esc fecha e devolve o
  foco, clique fora/Tab para fora fecham. **axe 0 violações** em 13 páginas × 4 modos × 2 temas.
- **VLibras** (`VLibras.tsx`, no `layout.tsx`): o tradutor de Libras do governo federal (script `https://vlibras.gov.br/app/vlibras-plugin.js`,
  carregado com `lazyOnload`), mesmo widget do portal atual; confirmado no navegador (botão azul no canto direito). **Desligável com
  `NEXT_PUBLIC_VLIBRAS=off`** — o `playwright.config.ts` já faz isso no build de teste (`webServer.env`) para os testes não dependerem de
  serviço externo. **Na Vercel fica ligado** (variável não definida). Se um dia atrapalhar a apresentação, é só definir
  `NEXT_PUBLIC_VLIBRAS=off` na Vercel e refazer o deploy.
- **Corrigidos hoje**: classe inválida `jus` removida do `Footer.tsx` (o usuário mandou remover); palavras partidas das licitações
  ("C ontratação", "necessi dade", "M unicípio", "S alvador", "n o Edital") — lista fechada em `PALAVRAS_PARTIDAS`
  (`lib/normalize/licitacao.ts`), testada contra os dados reais.
- **Armadilhas novas**: (1) `next start` deixado aberto em `:3100` faz o Playwright **reaproveitar um build velho** (`reuseExistingServer`) — parar
  o servidor antes de rodar os testes; (2) `writeFileSync` em `app/layout.tsx` pode falhar com `UNKNOWN` enquanto o `next dev` do usuário está
  aberto — usar a ferramenta de edição e tentar de novo; (3) `node -e` com `\b` gera caractere de controle: para regex/barras usar a ferramenta de edição; (4) o ESLint precisa ignorar `playwright-report/` e `test-results/` (já está em
  `eslint.config.mjs`) — sem isso, depois da 1ª rodada de testes o `npm run lint` acusava milhares de erros em arquivos gerados.
- **Testes**: 120 unitários + 577 de ponta a ponta (fluxos DAM/processo, 404 sem JS, barra de acessibilidade, home).

## Testes automatizados (25/09/2026) — CONCLUÍDO

Primeiro item da ordem combinada **testes → polimento → hospedagem** (o usuário pediu essa ordem em 25/09/2026).
**521 testes, todos verdes** (`npm run test:all` = lint + `typecheck` + unit + e2e, ~4 min):
- **Unitários — Vitest** (`vitest.config.mts`, `tests/unit/*.test.ts`, 108 testes, ~1 s): normalizadores
  (`servico`, `licitacao`, `legislacao`, `transparencia`, `texto`, `data`), DAM, filtros/tons/fichas das consultas,
  agendamento (horários, dias úteis, disponibilidade simulada, criar/cancelar com `localStorage` simulado),
  `createLocalStore`, e **integridade dos dados** (151 serviços/13 categorias, slugs únicos, 48 links de documento
  casam, 804 notícias, 1.079 normas, 53 formulários, IPTU Verde **sem percentual inventado**, 8 projetos).
  `NEXT_PHASE=phase-production-build` no config faz o `sleep()` não esperar.
- **Ponta a ponta — Playwright + `@axe-core/playwright`** (`playwright.config.ts`, `tests/e2e/*.spec.ts`, 413 testes):
  `navegacao` (42 páginas: 200, 1 `h1`, 1 `main`, título, `lang`, **sem erro de console/HTTP** + 404s), `acessibilidade`
  (axe em todas as páginas × claro/escuro × desktop/celular), `mobile` (360/390/768: sem rolagem horizontal, alvos ≥24px,
  texto ≥11,5px, rótulos de ícone sem quebrar palavra), `teclado` (pular conteúdo, foco visível, combobox da busca,
  gaveta), `fluxo-cidadao`, `consultas` (+ painéis e Carnaval), `agendamento`, `conteudo` (fichas com download, IPTU
  Verde, PDDU, legislação, notícias, licitações, formulários, institucional, transparência), `tema-e-texto`.
  Lista central de páginas: `PAGINAS_PUBLICAS` em `tests/e2e/helpers.ts` (página nova ali ganha estrutura + axe + mobile).
- **Como rodam**: `npm test`, `npm run test:e2e` (faz `next build` + `next start -p 3100` sozinho; reaproveita servidor
  já na 3100), `npm run test:all`. **Usa o Microsoft Edge instalado** (`channel: "msedge"`, sem baixar navegador); em
  outra máquina `PW_CHANNEL=chromium` + `npx playwright install chromium`. Artefatos ignorados no Git:
  `playwright-report/`, `test-results/`.
- **Validação dos testes**: introduzi defeitos de propósito e os testes falharam como devem (unit: DAM sem `max(area,0)`,
  filtro de período, fim de semana nos dias úteis; e2e: contraste do selo amarelo voltando a `#a3721a` e gaveta do menu
  focável fechada). Código restaurado.
- **Armadilhas achadas**: (1) `npm run typecheck` precisa de `next typegen` antes (os tipos `PageProps`/`LayoutProps`
  são gerados pelo Next e não existem num clone novo) — o script já é `next typegen && tsc --noEmit`; (2) `getByText("X")`
  casa por **substring e sem diferenciar maiúsculas** (usar `{ exact: true }`); (3) `aria-label` substitui o texto
  visível no nome acessível (ex.: link "Detalhes" tem nome "Ver detalhes de …"); (4) `page.addInitScript` roda a cada
  carga (regravava o tema no teste de persistência); (5) ler a tabela logo após clicar em "Consultar" dá corrida —
  esperar `toHaveURL` antes; (6) o log `[WebServer] ⨯ Error: The destination stream closed early` durante o e2e é ruído
  benigno (o navegador fecha a conexão ao trocar de página).
- **Dependências novas (devDependencies)**: `vitest`, `@playwright/test`, `@axe-core/playwright`; `@types/node` subiu de
  `^20` para `^22` (o Vitest 5 exige). O `package-lock.json` tem os binários do Linux (rolldown/Vite etc.) —
  **clone limpo com `npm ci` + lint + typecheck + unit + `next build` passou** (compatível com a Vercel).
- `.github/workflows/testes.yml` roda lint/tipos/unit/e2e (Chromium) a cada push/PR — **ainda não rodou no GitHub**
  (não validado lá; o usuário faz o git). Os scripts soltos do scratchpad (`axe.js`, `teclado.js`, `novos.js`…) foram
  **substituídos** por estes testes.
- Ao mudar textos/rótulos de telas, ajustar o teste correspondente (usam papéis e rótulos acessíveis).

## Correções e polimento (lista do usuário — em aberto)

O usuário disse (24/09/2026) que tem **apontamentos de correção para passar depois de fechar o planejamento** e pediu
para anotá-los aqui. Ele ainda vai enviá-los: **quando chegarem, registrar cada um abaixo** (item, onde, situação).
Já conhecidos (achados por mim, ainda não corrigidos):
1. ~~Textos de licitações com palavra partida~~ — **corrigido em 25/09/2026** (`PALAVRAS_PARTIDAS`).
2. ~~`jus` inválido no `Footer.tsx`~~ — **removido em 25/09/2026** a pedido do usuário.
3. ~~404 de rota dinâmica em branco sem JS~~ — **resolvido em 25/09/2026** (ver "Fidelidade à realidade").

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
  removido). O link "Pular para o conteúdo" agora fica no `PortalShell` (ver Fase 3, passo 1).
- `app/components/molecules/SearchBar.tsx` — **busca ao vivo** (não navega mais pra `/busca`):
  digita → debounce de 200ms → `fetch('/api/busca?q=...')` → dropdown com resultados (seções, serviços,
  consultas, legislação, notícias). Sem botão "Buscar". Navegável por teclado (↑/↓/Enter/Esc — ver Fase 3, passo 1).
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

1. **Acessibilidade (AA)** — ***CONCLUÍDO (24/09/2026)***. Medido com **axe-core** (WCAG 2.0/2.1 A+AA + best
   practices) em Edge headless: ~30 páginas públicas + fluxo logado completo (login → formulário vazio/com
   erros → detalhe aguardando/pago/concluída → lista), nos temas claro/escuro e em 1280/390px — **0
   violações**; teste de teclado próprio (`teclado.js`) 100% ok. O que foi feito:
   - **Contraste**: `--color-warning` `#a3721a`→`#8a5f10` (selo "Em manutenção" dava 3,74:1) e
     `--color-success` `#2f7d52`→`#2a7048` (selo "Concluída/Pago" dava 4,41:1); agora todos os tons de
     status passam de 4,5:1 sobre branco e sobre o fundo tingido do selo (danger `#b23b3b` já passava).
   - **Foco visível global** (`globals.css`): `:focus-visible { outline: 2px solid var(--brand) }` (segue o
     tema); a busca mantém o próprio anel. `prefers-reduced-motion` respeitado.
   - **Landmarks**: `PortalShell` agora tem `<header>` (UtilityBar + TopBar) e `<main id="conteudo-principal"
     tabIndex={-1}>`; a busca tem `role="search"`. O link **"Pular para o conteúdo" é o 1º elemento focável**
     (antes vinha depois da sidebar; foi movido do `UtilityBar` para o `PortalShell`, aparece ao focar).
   - **Busca (`SearchBar`) com teclado** (padrão combobox WAI-ARIA): ↑/↓ percorrem (dão a volta), Enter abre a
     opção destacada (ou a 1ª), Esc fecha, `aria-activedescendant`/`aria-selected`, região `role="status"`
     anuncia "N resultados disponíveis". As opções deixaram de ser `<Link>` e viraram `<li role="option">` com
     `router.push` (evita interativo aninhado); perde-se só o prefetch.
   - **Gaveta mobile da sidebar**: `id="menu-lateral"`; fechada fica `invisible` (sai da ordem de Tab e do
     leitor de tela); botão hambúrguer com `aria-expanded`/`aria-controls`; ao abrir o foco vai para a
     gaveta, **Esc fecha**. Armadilha resolvida: a transição de `visibility` só existe no estado *fechado* —
     se existisse ao abrir, a gaveta ficaria `hidden` no 1º frame e o `focus()` seria ignorado.
   - **404**: `NaoEncontrado` (organism) usado em `app/not-found.tsx` (com `<main>` próprio, sem shell) e em
     `app/(public)/not-found.tsx` (dentro do `<main>` do shell — antes gerava dois `<main>`). `error.tsx`
     também virou `<main>`.
   - **Um H1 por página**: conferido por crawler no HTML de 1.374 URLs — todas têm exatamente 1 H1 e 1
     `<main>`. O placeholder do `AuthGuard` ("Verificando sua sessão…") virou o **H1** enquanto a sessão é
     conferida, então as 151 `/solicitar/*` também passam. **Única exceção conhecida e não corrigível por
     nós**: HTML de 404 disparado por `notFound()` (ex.: `/noticias/999999`) sai do servidor com o `<body>`
     vazio (`<html id="__next_error__">`) e a 404 só aparece após o JS rodar (com JS: H1, `<main>`, título e
     axe ok). **Reproduzido em rota mínima que só chama `notFound()`, fora de qualquer grupo e até com o
     not-found padrão do Next** — é comportamento do Next 16.3.5, não do nosso código; trocar por 404
     renderizada inline custaria o status HTTP 404 (pior). URLs sem rota (`/pagina-inexistente`) renderizam
     completas no servidor. 404s agora têm título "Página não encontrada".
   - Títulos de aba: `/solicitar/[id]` agora tem `generateMetadata` com o nome do serviço (eram 151 iguais).
   - Ferramentas (scratchpad, não versionadas): `axe.js` (públicas; passar URLs extras como argumento e usar
     `MSYS_NO_PATHCONV=1` no Git Bash), `axe-logado.js`, `teclado.js`, `h1.js`. Instalar `axe-core` no
     scratchpad. **Não** dá para escrever esses scripts por heredoc (perde as `\` do caminho do Edge).
   - **Limites do automático**: axe pega ~30–40% dos problemas WCAG, então dizer "sem violações no axe" e não
     "100% conforme". O usuário **recusou** o teste manual com NVDA/zoom — não voltar a sugerir.
2. **Conferir o conteúdo com o usuário** — ***CONCLUÍDO (24/09/2026)*** (consultas, detalhe, painéis, dirigentes e
   notícias resolvidos; o que não dá para obter ficou fictício e sinalizado):
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
   - **Respostas do usuário (24/09/2026)**: não tem acesso às consultas do portal real, então **nenhum print
     virá — os resultados de Alvará/DAM/Auto/Solicitação ficam fictícios e sinalizados** (não pedir de novo);
     dirigentes **estão corretos**; 612 notícias antigas: **só o texto "ainda não foi migrado"** (já é o que
     existe); **quer tela de detalhe** das consultas (feita, ver abaixo).
   - **Tela de detalhe das consultas (feita em 24/09/2026)**: cada linha da tabela ganhou "Ver detalhes" →
     `/consultas/[slug]/[registro]` e `/transparencia/[slug]/[registro]` (registro = `id` da linha; **sem
     `generateStaticParams`** de propósito — 1.332 só no risco; abrem sob demanda; id inexistente → 404). A
     URL leva os filtros e a página da lista, e "Voltar aos resultados" reabre a mesma lista preenchida.
     Componente `DetalheConsultaView`; a "receita" de cada ficha fica em `DETALHES` (`lib/data/consultas.ts`,
     tipo `DetalheConsulta`: título, subtítulo, selo de situação/risco, resumo, `niveis`, `extras`, `etapas`) e
     tem fallback genérico (`detalheDe`). Destaques: risco mostra os 4 níveis com selo colorido
     (`tomDoRisco`) e as **condicionantes por extenso em lista**; auto de infração e solicitação têm **linha do
     tempo** (`StatusTimeline`, etapas fictícias); situações ganham selo (`tomDaSituacao`); campos que repetem
     o título/selo não se repetem em "Dados do registro". Dados reais mantêm o aviso "dados oficiais"; o resto
     "Demonstração… fictícios". Verificado: axe 0 violações em 7 tipos de ficha × claro/escuro × 1280/390,
     sem rolagem horizontal (`detalhe.js` no scratchpad).
   - **Painéis de Transparência alinhados ao portal antigo (feito em 24/09/2026)**. Método igual ao das
     consultas: ler as páginas internas salvas (`transp_interno_*.html` — os painéis são páginas do sistema
     antigo dentro de iframe; extrator `painel.js` no scratchpad). Os **campos, rótulos, botões e listas agora
     são os reais**; as colunas de resultado seguem fictícias (o antigo as carrega por JS e não estão no
     HTML). Botão "Consultar" em todos. Por painel: *Obras em Vias e Logradouros* — nº do alvará, Processo
     (Origem/Ano/Nº), Nome/Razão Social, CEP, Logradouro, Bairro, Validade (de/até), Deferimento (de/até);
     *Construção por Mês* e *Eventos Licenciados* — Mês ("Selecione" + 12 meses) e Ano; *Habite-se* — nº
     habite-se, nº alv. construção, Processo, Nome, Logradouro, Nº Porta; *AOP* — nº do alvará, Processo, Nome,
     CEP, Logradouro, Bairro, Data de entrada (de/até); *EIV* — nº do alvará, Processo, Bairro; *Processos em
     Convite* — só "Grupo de Serviço" com as **17 opções reais** (ADMINISTRATIVO … VIABILIDADE DE LOCALIZAÇÃO).
     Suporte novo em `CampoConsulta`: `grupo` (campos sob um `<fieldset>` com título, ex. "Processo (Origem /
     Ano / Nº Processo)"), `tipo:"data"` + `limite` (período, coluna em dd/mm/aaaa, filtro em `filtrarLinhas`),
     `opcaoVazia` ("Selecione"…). Testado (`paineis.js`): filtro por processo, por período e por grupo, axe 0.
   - **Sem acesso ao portal real para prints** (respondido pelo usuário) → Alvará de Publicidade, DAM, Auto e
     Solicitação seguem fictícios e sinalizados; **encerrado, não pedir de novo**.
   - Outros itens de conteúdo: dirigentes **confirmados corretos**; 612 notícias antigas: fica o aviso
     "ainda não foi migrado" (decidido).
3. **Passe visual mais fino no mobile** — ***CONCLUÍDO (24/09/2026)***. Varredura automática (`mobile-sweep.js`,
   360/390/768px, ~37 páginas): 0 rolagem horizontal, 0 alvos de toque <24px, 0 texto <11,5px; capturas
   conferidas à mão. Corrigido: (a) **`<span class="sr-only">` (position:absolute) dentro de contêiner com
   `overflow-x-auto` não posicionado escapa do recorte e alarga a PÁGINA inteira** — o contêiner da tabela das
   consultas agora é `relative` (bug que eu mesmo introduzi com a coluna "Detalhes"; **lição: sr-only dentro
   de área rolável exige `relative` no contêiner**); (b) utilitário Tailwind **`toque`** (`@utility` em
   `globals.css`: inline-flex, altura mín. 2rem) aplicado em links/botões de texto (migalhas, Detalhes,
   Voltar, Limpar, Baixar edital, "Aumentar texto"/"Tema"…) — usar em todo link de texto solto novo;
   (c) `IconTile`: no celular texto `text-xs tracking-tight` e sem padding lateral (senão "Desenvolvimento" e
   "Telecomunicações" quebravam no meio da palavra em 112px; hifenização automática não funcionou);
   (d) `TopBar`: no celular a busca vai para uma linha própria abaixo de menu/"Entrar" (placeholder saía
   cortado); a ordem do Tab continua menu→busca→Entrar. Tabela larga: células `px-3` e link "Detalhes".
   Não corrigido (dado de origem): alguns textos de licitação vêm com espaço no meio da palavra
   ("C ontratação", "M unicípio") — vem assim do portal antigo.
4. **README do projeto** — ***CONCLUÍDO (24/09/2026)***: `README.md` em português (o que é, como rodar, roteiro
   de demonstração, real × fictício, estrutura, decisões, limitações). Manter atualizado se algo mudar.
5. **Páginas ocultas do portal antigo** — ***CONCLUÍDO (24/09/2026)***: o usuário mandou migrar tudo. Ver "Fase 3b".

Extras/pendências fora dos 5: página `/dev/estilo` (opcional). Testes automatizados: **feitos** (ver seção própria).

**Git**: o usuário faz todos os commits e pushs por conta própria (última base: `e98db36`, branch
`desenvolvimento`). **Não perguntar nem lembrar sobre commit/push.** Só commitar se ele pedir explicitamente.

**Pendências do usuário para fechar a Fase 3 — estado em 24/09/2026**: prints de consultas (Alvará, DAM, Auto,
Solicitação) → **não terá acesso, ficam fictícios** (encerrado); tela de detalhe → **feita**; 612 notícias →
**só o texto "não foi migrado"** (encerrado); dirigentes → **confirmados corretos** (encerrado); teste NVDA/zoom
→ **não quer** (não voltar a sugerir); git → **ele faz os commits/pushes, não perguntar nem lembrar**. **IPTU Verde e Fiscalização Carnaval: o usuário mandou migrar as duas (feito, ver "Fase 3b").** Passos 2, 3, 4 e 5 concluídos.

**Próximas conversas (estado em 24/09/2026)**: o plano está **concluído** (passo 5 também). O usuário vai **hospedar na
Vercel por conta própria** (ver "Deploy na Vercel": nenhuma alteração foi necessária) e **vai testar o sistema e trazer
os apontamentos de correção** (registrar na seção "Correções e polimento"). **Ordem pedida em 25/09/2026: testes automatizados (FEITO) → polimento (PRÓXIMO, depende dos apontamentos do
usuário) → hospedagem.** Ao retomar uma sessão nova: ler este arquivo, esperar os apontamentos e **não** puxar git,
NVDA nem hospedagem por conta própria.
