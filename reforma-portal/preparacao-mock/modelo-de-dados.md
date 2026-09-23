# Modelo de informações do portal (como é hoje)

> Criado em 21/09/2026. Descreve as **"coisas"** que existem hoje no portal (serviço, notícia, lei…), os campos de cada uma, quantas são e de onde vêm. Serve de base para o sistema de teste. **É o retrato de hoje**, não a proposta do sistema novo: a decisão de como agrupar e mostrar essas coisas é da fase 2/3. O arquivo de dados de cada coisa está em `dados/`.

## 1. Mapa das coisas

| Coisa | Quantas | Onde vive hoje | Arquivo | Campos principais |
|---|---|---|---|---|
| **Categoria de serviço** | 13 (+ “Serviços Dispensados de Licença”) | Portal de Serviços | `servicos.json` › `categorias` | id, nome, total de serviços, lista de serviços |
| **Serviço** (ficha) | 151 | Portal de Serviços | `servicos.json` › `servicos` | id, nome, categoria, ações (Emissão de DAM / Abrir processo), 6 abas, links dentro das abas |
| **Serviço dispensado de licença** | 3 grupos de texto | Portal de Serviços | `servicos-sistema.json` | Reparos Gerais, Obras em Logradouro Público, Especiais |
| **Consulta** | 8 | Portal de Serviços (4 próprias + 4 do sistema antigo) | `servicos-sistema.json` › `consultas` | nome, tecnologia, endereço, campos do formulário |
| **Painel de transparência (portal)** | 7 painéis + 1 PDF | Portal de Serviços (sistema antigo) | `servicos-sistema.json` › `transparencia_do_portal` | nome, endereço, campos de filtro |
| **Formulário (PDF)** | 53 | Portal de Serviços | `formularios.json` | título, endereço do PDF |
| **Camada de geoserviço** | 3 (Bairros oficiais, Logradouros, Revitalizar) | Portal de Serviços | `servicos-sistema.json` › `geoservicos` | nome, descrição, endereço WFS, PDF, metadado, mapa |
| **Canal de atendimento** | 5 blocos | Portal de Serviços | `servicos-sistema.json` › `canais_de_atendimento` | Portal, WhatsApp, Presencial, E-mail, Denúncias |
| **Sistema parceiro / satélite** | 5 | Sistemas à parte | `servicos-sistema.json` › `sistemas_parceiros` | nome, endereço |
| **Notícia** | 804 | Site | `noticias.json` | id, título, data, miniatura, texto (192), imagens/links no corpo |
| **Norma / documento de legislação** | 1.079 em 20 listas | Site | `legislacao.json` | data, número, descrição, PDF, lista/bloco de origem |
| **Bloco de legislação** | 14 (5 com subblocos) | Site | `legislacao.json` › `secoes` | nome, endereço, subseções |
| **Licitação (linha)** | 57 | Site | `licitacoes.json` | data, título, descrição, PDF |
| **Item de transparência (site)** | 2 blocos, 1 processo com 24 arquivos | Site | `transparencia-site.json` | audiência (edital), processo EIV/RIV |
| **Projeto / programa** | 6 | Site (home) | `projetos.json` | nome, texto, links, imagens |
| **Área de atuação** | 7 | Site (Institucional) | `institucional.json` | nome, texto |
| **Dirigente** | 20 | Site (Institucional) | `dirigentes.json` | cargo, nome |
| **Unidade organizacional** | 35 unidades e 47 setores, mais 5 colegiados/assessoria/fundação (diretorias, gerências, coordenadorias, subcoordenadorias, setores) | Site (imagem) | `organograma.json` | nome, pai, setores |

## 2. Relações que existem (e as que faltam)

**Existem hoje (por link ou por número):**
- Serviço → formulário (só 15 dos 53 são linkados por alguma ficha) e → PDFs de formulário no site antigo (12 só lá).
- Serviço → lei citada **por número, sem link** (ex.: Lei nº 7.186/2006).
- Projeto → serviço da Carta (por link em formato antigo `#/portal/...`, que não leva à ficha) e → lei/decreto em PDF (cópia própria, diferente da Legislação).
- Home / banners → sistemas parceiros.
- Notícia → nada (só 13 das 192 lidas têm link no texto).

**Não existem hoje (o sistema novo poderá criar):**
- Serviço ↔ Legislação, Serviço ↔ Formulário (completo), Serviço ↔ Canal, Serviço ↔ Programa, Notícia ↔ Serviço/Norma, Área de Atuação ↔ Categorias da Carta, Dirigente ↔ Unidade organizacional, Licitação ↔ Documentos (um processo com vários documentos).

## 3. Endereços de hoje (para redirecionamentos futuros)

| Padrão | Exemplo | Vive em |
|---|---|---|
| `sedur.salvador.ba.gov.br/<seção>` | `/noticias`, `/legislacao`, `/licitacoes`, `/transparencia` | Site |
| `…/institucional/<página>` | `/institucional/dirigentes` | Site |
| `…/noticias/<id>-<título>` | `/noticias/910-conselho-municipal-…` | Site |
| `…/<bloco>` e `…/<bloco>/18-legislacao/<n>-<sub>` | `/decretos`, `/cnlu/18-legislacao/797-comunicados` | Site |
| `…/images/arquivos_processos/AAAA/MM/<arquivo>.pdf` e `…/arquivos/AAAA/MM/…` e `…/images/pdf/…` | PDFs de legislação e licitações | Site |
| `servicos.sedur…/#/portal/home`, `#/portal/contacts`, `#/portal/carta-servicos/servico/<n>` | (**formato antigo**, usado no site) | vira a página inicial do Portal |
| `servicos.sedur…/carta-servicos`, `/carta-servicos/categoria-atendimento/<id>`, `/carta-servicos/detalhe-servico/<id>` | (formato atual) | Portal |
| `servicos.sedur…/consultas/<nome>`, `/paginas/iframe/<base64>` | consultas | Portal |
| `servicos.sedur…/formularios`, `/geoservicos`, `/lei-transparencia`, `/contato`, `/govbr` | funções do Portal | Portal |
| `servicos.sedur…/storage/portal-servicos/formularios/<hash>.pdf` | PDFs de formulário | Portal |
| `api.sedur…/k8s/prd/servicosonline/Web/<arquivo>.php` | sistema antigo (motor das consultas e painéis) | Sistema antigo |
| `sedur.salvador.ba.gov.br/acessoremoto/` | Acesso Interno | Rede SEDUR |

## 4. Erros nos dados (o sistema novo deve tratar na importação)

**Carta de Serviços** (`servicos.json`): 125 de 151 fichas com ao menos uma aba vazia; aba “Taxas” com o mesmo parágrafo em todas; “Local e horário” com “N/A” em 93; nome com acento agudo (´) no lugar de apóstrofo; siglas sem explicação (CLE, DAM); erros de escrita em várias fichas. Detalhe em `../contexto-portal/servicos/servicos-disponiveis/`.

**Legislação** (`legislacao.json`, campo `problemas`): 14 documentos com link sem endereço; 1 com servidor inexistente (`http://arquivos//…`); 15 linhas em branco em “Resoluções”; 2 arquivos usados por duas leis diferentes; datas fora de ordem/erradas em alguns itens; número escrito de formas diferentes; ícone de todos os PDFs com a descrição “Edital”.

**Licitações** (`licitacoes.json`, campo `problemas`): 2 linhas sem arquivo; 2 datas fora do padrão (a data já vem corrigida em `data`; a original em `data_original`); numeração repetida; um processo (Concorrência 001/2023) em 9 linhas.

**Notícias** (`noticias.json`): 683 sem miniatura; 8 títulos repetidos; endereço com “teste”; 260 títulos com nome antigo “Sucom”; 1 caso (de 6 lidos entre as antigas) com imagens em site que não existe mais.

**Institucional**: organograma só em imagem (por isso a transcrição); página Dirigentes com foto de 911 KB dentro do código; possível desatualização de cargos.

**Geral**: título de aba igual em todas as páginas; “© 2021” no site; endereço do órgão em imagem; Fala Salvador (link) que não abre.

## 5. Como a lista de sistemas se traduz em "uma casa só" (para orientar, não é proposta)

O Johnny definiu (21/09/2026) que o objetivo é **unificar tudo com o site original (sedur.salvador.ba.gov.br)**. Em termos de dados, isso significa que **as 18 coisas da tabela 1 passariam a viver num único conjunto de conteúdos, com um só menu e uma só busca**. O que exatamente vira menu, agrupamento ou página é o trabalho da fase 2 (propostas, uma etapa por vez); esta pasta apenas garante que **nenhum conteúdo de hoje fique de fora**.
