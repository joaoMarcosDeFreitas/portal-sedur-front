# Portal SEDUR — protótipo navegável

Protótipo (mock, sem backend) de um **portal único** para a SEDUR — Secretaria Municipal de
Desenvolvimento Urbano de Salvador. Ele reúne em um só lugar o site institucional e o Portal de
Serviços, que hoje são dois sistemas separados, com uma experiência bem mais simples de usar.

Foi feito para **apresentação**: tudo funciona de ponta a ponta, mas nada é gravado em servidor
nem consulta sistemas reais.

> Contexto completo, decisões e histórico do projeto: [`CONTEXT.md`](./CONTEXT.md).

## O que tem

| Área | O que faz |
|---|---|
| **Serviços** | 13 categorias e 151 serviços com ficha completa (documentos com modelo em PDF para baixar, taxas, prazo, local) e os botões reais de cada um: **Emissão de DAM**, **Abrir processo**, os dois, ou nenhum (15 serviços só informativos) |
| **Agendamento** | Atendimento presencial: assunto, dia útil e horário (9h às 15h30), comprovante e cancelamento |
| **Área do cidadão** | Login de demonstração → **emitir DAM** (taxa → DAM → pagamento simulado → pago) ou **abrir processo** (protocolo → análise → conclusão) → acompanhamento |
| **Consultas** | 8 consultas (atividades, classificação de risco, DAM por CGA, auto de infração…) com tela de detalhe |
| **Legislação** | 1.079 normas em 14 tipos, navegação por ícones e busca |
| **Notícias** | 804 notícias com busca e filtro por ano |
| **Licitações** | Editais agrupados por processo, com filtro por modalidade e ano |
| **Transparência** | 7 painéis, Fiscalização Carnaval 2026, audiências públicas e estudos de impacto de vizinhança |
| **Institucional** | Áreas de atuação, programas e projetos (incluindo IPTU Verde e Revisão do PDDU), dirigentes e organograma |
| **Outros** | Formulários (53), canais de atendimento, geoserviços, sistemas parceiros |
| **Busca global** | Busca ao vivo (com teclado) em serviços, consultas, legislação, notícias e seções |
| **Acessibilidade** | Painel com as opções do portal atual (aumentar/diminuir texto, escala de cinza, alto contraste, links sublinhados, fonte legível, reiniciar), tema claro/escuro, **VLibras**, navegação por teclado, contraste AA |

## Como rodar

Requisitos: **Node.js 20.9 ou superior** e npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros comandos:

```bash
npm run build      # gera o site otimizado (~1.170 páginas estáticas)
npm start          # serve o build
npm run lint       # ESLint
npm run typecheck  # checagem de tipos
npm test           # testes unitários (ver "Testes")
npm run test:e2e   # testes de ponta a ponta (ver "Testes")
```

## Testes

Dois níveis de teste automatizado:

| Comando | O que roda | Tempo |
|---|---|---|
| `npm test` | **Vitest** — 120 testes unitários em `tests/unit`: normalização de conteúdo, cálculo do DAM, filtros das consultas, agendamento, armazenamento local e integridade dos dados (contagens, slugs únicos, links das fichas, IPTU Verde sem percentual inventado) | ~1 s |
| `npm run test:e2e` | **Playwright** — 577 testes em `tests/e2e`, num navegador de verdade: abre as ~40 páginas, o fluxo do cidadão, consultas e painéis, agendamento, teclado (busca, menu, "pular para o conteúdo"), tema/texto, **acessibilidade com axe** (claro/escuro × desktop/celular) e **layout mobile** (sem rolagem horizontal, alvos de toque, texto mínimo) | ~3 min |
| `npm run test:all` | lint + tipos + os dois acima | ~4 min |

O `test:e2e` faz o `next build` e sobe o site na porta 3100 sozinho (se já houver um servidor nessa porta, ele
reaproveita). Por padrão usa o **Microsoft Edge** instalado; em outra máquina use o Chromium do Playwright:

```bash
npx playwright install chromium
PW_CHANNEL=chromium npm run test:e2e     # PowerShell: $env:PW_CHANNEL="chromium"; npm run test:e2e
```

Se um teste de ponta a ponta falhar, o relatório fica em `playwright-report/` (`npx playwright show-report`), com
captura de tela e *trace* da falha. O arquivo `.github/workflows/testes.yml` roda tudo isso a cada push no GitHub.

**Ao mudar o sistema**: se você trocar um texto de botão, um rótulo ou a estrutura de uma tela, ajuste o teste
correspondente (eles usam papéis e rótulos acessíveis, ex.: `getByRole("button", { name: "Consultar" })`). Novas páginas
entram na lista `PAGINAS_PUBLICAS` em `tests/e2e/helpers.ts` e ganham automaticamente os testes de estrutura,
acessibilidade e mobile.

## Roteiro sugerido para a apresentação

0. **Agendamento** (Serviços → Mais recursos): marque um horário, veja o comprovante e cancele em "Meus agendamentos".
1. **Home** → mostre a busca (digite "reforma") e as categorias de serviço.
2. **Serviços → Empreendimento → Licença para Ampliação/Reforma** → ficha única, sem abas vazias.
3. **Emissão de DAM** → **Entrar** com um perfil de demonstração → confira a taxa e emita o DAM. Depois, em outro serviço, **Abrir processo**.
4. **Minhas solicitações** → no DAM, use **Pagar com PIX** (simulado): fica "Pago", com comprovante. No processo, use
   **Simular conclusão** para avançar a linha do tempo.
5. **Consultas → Renovação de Publicidade (DAM)** → digite o CGA `90147` → **Detalhes**.
6. **Consultas → Classificação de Risco** → filtre uma atividade → abra os detalhes.
7. **Legislação** → clique num ícone (ex.: CNLU) e depois num subtipo.
8. Alterne o **tema escuro** e o **Aumentar texto** na barra do topo; reduza a janela para ver o celular.

CGAs de teste (DAM): `90147`, `69584`, `68802`, `49091`, `92660`.

## O que é real e o que é fictício

- **Conteúdo real** (coletado do portal atual em 2026 e guardado em `data/`): serviços, legislação,
  notícias, licitações, dirigentes, organograma, projetos, formulários e as 4 consultas de
  atividades (escritórios virtuais, classificação de risco, autônomos e residências).
- **Fictício e sinalizado na tela**: resultados das consultas por número (DAM, auto de infração,
  solicitação, alvará), os painéis de transparência (incluindo o do Carnaval), o login, o DAM, o pagamento e o agendamento. Os dados
  fictícios são gerados de forma determinística (mesmos valores a cada carga).
- **Fluxo após o login**: o que acontece dentro do sistema real depois do login gov.br nunca foi coletado; as duas ações (DAM e processo) são
  simuladas a partir dos botões reais de cada ficha.
- **Não migrado**: o texto de ~600 notícias antigas (aparece um aviso "ainda não foi migrado").
- **Fora do escopo**: o "Acesso Interno" (hub de sistemas internos separados). Consulta Prévia, Salvador Ruas e
  Mapeamento seguem como links para os sistemas originais (em "Sistemas parceiros").

A sessão e as solicitações ficam no `localStorage` do navegador: sobrevivem a recarregar a página
e são exclusivas de cada navegador. Para recomeçar a demonstração, limpe os dados do site.

## Estrutura

```
app/
  (public)/        páginas públicas (layout com sidebar + topbar + rodapé)
  (private)/       área logada do cidadão (mesmo layout + AuthGuard)
  api/             busca global e paginação da legislação (Route Handlers)
  components/      Atomic Design: atoms → molecules → organisms
  globals.css      tokens de cor e tema (Tailwind v4, claro/escuro)
data/              JSON com o conteúdo coletado (somente leitura)
lib/
  data/            camada de acesso, async com latência simulada (a "API" do mock)
  normalize/       limpeza do conteúdo bruto (N/A, caracteres quebrados, MAIÚSCULAS…)
  auth/, store/    sessão simulada e persistência em localStorage
  solicitacoes/    protocolo, cálculo do DAM e status
  ui/              mapas de ícones por categoria/seção
types/             tipos TypeScript de cada domínio
tests/             testes: unit/ (Vitest) e e2e/ (Playwright)
reforma-portal/    auditoria do portal atual (material de origem, não alterar)
```

## Decisões e convenções

- **Next.js 16 (App Router) + React 19 + Tailwind CSS 4.** O Next 16 tem mudanças em relação às
  versões anteriores: consulte `node_modules/next/dist/docs/` antes de usar uma API (ver `AGENTS.md`).
- **Camada de dados separada da tela.** As páginas chamam funções de `lib/data/*` (assíncronas);
  trocar o mock por uma API real significa mudar só esses arquivos.
- **Cores só por tokens** (`globals.css`), sem valores soltos nem classes Tailwind montadas por
  interpolação. Texto na cor da marca usa `text-brand` / `text-accent-text` (mudam com o tema),
  nunca `text-primary-700`.
- **Tema claro/escuro real** (atributo `data-theme`), aplicado antes da primeira pintura para não piscar.
- **Ícones de mapas** (`CategoryIcon`, `LegislacaoIcon`, `MappedIcon`) usam `createElement` de
  propósito: as regras do React Compiler no ESLint recusam componentes escolhidos em tempo de render.
- **Acessibilidade**: foco visível, link "Pular para o conteúdo", busca navegável por teclado,
  landmarks, um H1 por página e contraste mínimo AA. Verificado com axe-core em dois temas e em
  desktop e celular.
- Comentários em `.css` não podem conter a sequência de fechamento de comentário no meio do texto
  (quebra o build).

## Limitações conhecidas

- Os testes de ponta a ponta usam navegador Chromium (Edge/Chrome). Firefox e Safari não são testados.
- O **VLibras** carrega um script do governo (`vlibras.gov.br`); para desligá-lo defina `NEXT_PUBLIC_VLIBRAS=off` (os testes já fazem isso).
- Endereços inexistentes em consultas, painéis e legislação mostram a tela "não encontrada" com status 200 (e `noindex`); nas demais rotas o
  status é 404. Em nenhum caso a página fica em branco, mesmo sem JavaScript.
- Não há URLs WFS nos geoserviços nem coluna "situação" nas licitações: esses dados não existem na origem.
