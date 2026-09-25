# Portal SEDUR — Requisitos de Experiência do Usuário (UX)

| | |
|---|---|
| **Produto** | Portal SEDUR unificado (protótipo navegável, sem backend) |
| **Órgão** | Secretaria Municipal de Desenvolvimento Urbano de Salvador (SEDUR) |
| **Versão do documento** | 1.0 — 25/09/2026 |
| **Situação do produto** | Protótipo funcional para apresentação; sujeito a mudanças quando houver integração com o backend existente |
| **Documento de apoio** | `CONTEXT.md` (histórico e decisões) · `README.md` (como rodar e testar) |

> **Como ler este documento.** Cada requisito tem um código (`NAV-01`, `ACE-03`…), uma prioridade (**M** = deve ter, **S** = deveria ter, **C** = pode ter), uma situação (**Atendido**, **Parcial**, **Pendente**) e a forma de verificação. "Atendido" significa que existe no protótipo **e** foi verificado como indicado; nada foi marcado como atendido sem verificação. As seções 10 e 11 dizem com franqueza o que **não** foi feito ou testado.

---

## 1. Propósito e escopo

### 1.1 Propósito
Definir a experiência que o portal deve oferecer ao cidadão, de modo que ele consiga **encontrar informações, entender o que precisa fazer e solicitar serviços da SEDUR sem precisar de ajuda**, e que o órgão possa demonstrar essa experiência a gestores antes de investir em integração com sistemas reais.

### 1.2 Escopo
- **Dentro:** site institucional e Portal de Serviços **reunidos em um só sistema**; área do cidadão (login de demonstração, emissão de DAM, abertura de processo, acompanhamento); consultas públicas e painéis de transparência; legislação, notícias, licitações, formulários, canais de atendimento, agendamento; acessibilidade e uso em celular.
- **Fora:** "Acesso Interno" (hub de ~11 sistemas internos, fora do escopo), área do servidor, emissão real de DAM/pagamento, login gov.br real, telas de mapa (outro sistema da Prefeitura), Consulta Prévia, Salvador Ruas e Mapeamento GIS (permanecem como links para os sistemas originais).

### 1.3 Origem dos requisitos
Auditoria completa do portal atual (`reforma-portal/`, setembro/2026), diretrizes do solicitante durante o desenvolvimento e a exigência da gestão de que **tudo o que existe no portal atual esteja presente e de acordo com a realidade**.

---

## 2. Diagnóstico do portal atual (o que a UX precisa resolver)

| # | Problema encontrado hoje | Efeito para o cidadão |
|---|---|---|
| D1 | Dois sistemas separados (site institucional em Joomla e Portal de Serviços) | A pessoa não sabe em qual dos dois procurar |
| D2 | Busca só acha pelo nome oficial; não tolera "habitese", "árvore", "caixa d'água"; mostra no máximo 6 resultados sem avisar | Quem digita como fala não encontra o serviço |
| D3 | Fichas com 6 abas que só carregam ao clicar; 125 das 151 fichas têm ao menos uma aba vazia ("N/A") | Cinco cliques para saber o básico, e blocos vazios |
| D4 | Botões "Emissão de DAM" / "Abrir processo" sem explicar a sigla nem avisar que levam ao login gov.br | A pessoa é enviada a outro site sem saber por quê |
| D5 | 15 fichas sem nenhum botão, sem explicação | Sem saber como proceder |
| D6 | Mesmo título de aba em todas as páginas; páginas sem título principal (h1) | Difícil distinguir abas; ruim para leitor de tela e buscadores |
| D7 | Páginas de erro em inglês, sem menu, sem barra de acessibilidade | Perde-se orientação justamente quando algo falha |
| D8 | Consultas e painéis abrem em janelas de um sistema antigo, sem adaptação a telas pequenas | Uso inviável no celular |
| D9 | Páginas importantes sem nenhum link de acesso (IPTU Verde, Fiscalização do Carnaval) | Conteúdo que ninguém encontra |
| D10 | Texto duplicado e genérico em todas as fichas (nota de taxas, "Local e horário" repetindo "Portal de Serviços 24 horas") | Ruído que esconde o que é específico |

---

## 3. Usuários e cenários

> **Atenção:** os perfis abaixo são **hipóteses de trabalho** montadas a partir da auditoria e do desenho dos serviços. **Não houve pesquisa com usuários reais.** Devem ser validados (seção 9).

### 3.1 Perfis
| Perfil | Quem é | O que quer resolver | Necessidades de UX |
|---|---|---|---|
| **P1 — Cidadão (pessoa física)** | Proprietário de imóvel, morador, pequeno comerciante | Reformar, regularizar, pagar uma taxa, saber se precisa de licença, acompanhar um pedido | Linguagem simples, passo claro, sem jargão, funcionar no celular |
| **P2 — Empresário / construtora (pessoa jurídica)** | Empresa que licencia obras, publicidade, eventos | Abrir vários processos, emitir DAMs, acompanhar tudo em um lugar | Ver rapidamente o que foi pedido e o estado de cada item; textos técnicos corretos |
| **P3 — Profissional recorrente** *(hipótese)* | Arquiteto, engenheiro, despachante | Consultar normas, atividades permitidas e risco; baixar formulários | Busca eficiente, listas filtráveis, links diretos para os PDFs |
| **P4 — Pessoa com deficiência ou baixa familiaridade digital** | Usuário de teclado/leitor de tela, baixa visão, surdo (Libras), idoso | Fazer o mesmo que os demais, sem barreiras | Acessibilidade como padrão, ajustes de exibição, VLibras |
| **P5 — Gestor / avaliador** | Quem verá o protótipo para decidir sobre a proposta | Ver que o sistema é completo, fiel à realidade e melhor que o atual | Cobertura total do conteúdo atual, clareza sobre o que é real e o que é simulação |

### 3.2 Tarefas principais (cenários de uso)
1. Descobrir **qual serviço** resolve o meu problema e **o que é preciso** (documentos, taxa, prazo).
2. **Emitir o DAM** de um serviço e pagá-lo.
3. **Abrir um processo** e acompanhar o andamento.
4. **Consultar** se uma atividade é permitida / qual o seu risco / situação de um DAM ou auto.
5. **Localizar uma norma** (lei, decreto, resolução) e baixar o PDF.
6. **Marcar atendimento presencial**.
7. **Acompanhar informações públicas** (licitações, transparência, notícias, dirigentes, organograma).
8. Usar tudo isso **no celular** e/ou com **recursos de acessibilidade**.

---

## 4. Princípios de experiência

1. **Um só lugar.** O usuário nunca precisa saber que existiam dois sistemas.
2. **Uma página, tudo o que importa.** Sem abas escondendo conteúdo; o que está vazio some.
3. **Falar como a pessoa fala.** Busca tolerante, rótulos em português claro, siglas explicadas.
4. **Dizer o que vai acontecer antes do clique.** Botões e avisos deixam claro o próximo passo (ex.: "DAM é a guia para pagar a taxa. Para continuar é preciso entrar").
5. **Honestidade sobre o protótipo.** Tudo o que é demonstração está sinalizado; nada fictício se passa por real.
6. **Acessível por padrão, não por opção.** Teclado, contraste, foco, leitor de tela e celular são requisitos de base, e há ajustes adicionais à escolha do usuário.
7. **Fiel à realidade.** Os serviços, botões, prazos, taxas, normas e listas vêm dos dados reais do portal atual; nada é inventado para "enfeitar".
8. **Padrões consistentes.** O mesmo padrão de navegação (ícone + título, sem cartões) serve para categorias, legislação, transparência e institucional.

---

## 5. Requisitos de experiência

### 5.1 Navegação e arquitetura de informação (NAV)

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| NAV-01 | Navegação lateral fixa com os 8 destinos principais (Serviços, Consultas, Legislação, Notícias, Licitações, Transparência, Institucional, Formulários), com o item atual destacado; **Minhas solicitações** aparece só após entrar | M | Atendido | `conteudo`, `navegacao` (e2e) |
| NAV-02 | Todo conteúdo do portal atual alcançável a partir da home ou do menu (**Acessos rápidos**: Agendamento, Consultas, Formulários, Geoserviços, Transparência, Canais, Revisão do PDDU, Sistemas parceiros) | M | Atendido | `conteudo` (e2e) |
| NAV-03 | Áreas com muitas subdivisões usam **navegação por ícones** em níveis (ex.: Legislação → tipo → subtipo → lista), com o mesmo padrão visual | M | Atendido | `conteudo` (e2e) |
| NAV-04 | **Trilha de navegação** (migalhas) em páginas de segundo nível ou mais | S | Atendido | inspeção; `navegacao` (e2e) |
| NAV-05 | Cada página tem **um único título principal** e **título de aba próprio** (`Nome | Portal SEDUR`) | M | Atendido | `navegacao` (e2e: 42 páginas) |
| NAV-06 | Conteúdos antes "escondidos" (IPTU Verde, Fiscalização do Carnaval) têm caminho de acesso visível | M | Atendido | `conteudo` (e2e) |
| NAV-07 | Ao voltar de uma ficha de consulta, o usuário reencontra **a mesma lista filtrada** | S | Atendido | `consultas` (e2e) |

### 5.2 Busca (BUS)

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| BUS-01 | Busca **em toda a página**, no topo, com resultado **ao digitar** (sem botão) | M | Atendido | `teclado` (e2e) |
| BUS-02 | Encontra **serviços, consultas e painéis, legislação, notícias e seções** do portal, incluindo o conteúdo novo (agendamento, IPTU Verde, PDDU, Carnaval) | M | Atendido | `teclado` (e2e) |
| BUS-03 | Ignora acentos e maiúsculas/minúsculas | M | Atendido | unitário |
| BUS-04 | Totalmente operável por teclado (↑ ↓ Enter Esc) e anunciada a leitores de tela | M | Atendido | `teclado` (e2e) |
| BUS-05 | Sem resultado: não mostra lista vazia nem erro | S | Atendido | `teclado` (e2e) |
| BUS-06 | Tolerância a sinônimos e grafias ("árvore" → poda/supressão; "abrir empresa" → viabilidade; "habitese") | S | **Pendente** | Não implementado; busca atual só casa por termos presentes no texto |
| BUS-07 | Página de resultados completa (hoje só há a lista suspensa com até 10 itens) | C | **Pendente** | — |

### 5.3 Serviços e fichas (SRV)

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| SRV-01 | Catálogo por **13 categorias** com ícone e título, sem contadores nem cartões | M | Atendido | `conteudo` (e2e) |
| SRV-02 | Ficha em **uma única página**, na ordem: Sobre o serviço, Documentos, Taxas, Prazo, Informações, Local e horário | M | Atendido | `conteudo` (e2e) |
| SRV-03 | **Seções vazias ou "N/A" não aparecem** | M | Atendido | `conteudo` (e2e) |
| SRV-04 | Documentos marcados como **"Indispensável para análise"** ficam destacados | M | Atendido | `conteudo` (e2e) |
| SRV-05 | Documento com modelo disponível mostra **"Baixar modelo · PDF"** (nome acessível com tipo e "abre em nova aba"); links para outra ficha do portal viram link interno | M | Atendido | `conteudo`, unitário (48 links) |
| SRV-06 | **Os botões da ficha são os reais** de cada serviço: só "Emissão de DAM" (81), só "Abrir processo" (50), os dois (5) ou nenhum (15) | M | Atendido | unitário (contagens), `fluxo-cidadao` (e2e) |
| SRV-07 | Junto ao botão, **explicar a sigla DAM** e avisar que é preciso entrar | M | Atendido | `fluxo-cidadao` (e2e) |
| SRV-08 | Serviço **sem botão** mostra aviso claro e caminho para os Canais de atendimento | M | Atendido | `fluxo-cidadao` (e2e) |
| SRV-09 | Nota legal repetida nas taxas aparece **uma vez**, em texto pequeno, e só quando há taxa | S | Atendido | inspeção |
| SRV-10 | Explicar a sigla "CLE" e nomes genéricos repetidos ("Reconsideração de Despacho") | C | **Pendente** | A origem não traz explicação; depende de conteúdo da SEDUR |

### 5.4 Fluxos do cidadão (FLX)

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| FLX-01 | **Login de demonstração** com perfis fictícios (pessoa física e jurídica), sem pedir dados ou senha reais | M | Atendido | `fluxo-cidadao` (e2e) |
| FLX-02 | Página protegida leva ao login e **volta ao ponto de origem** depois; aceita só caminhos internos (sem redirecionamento aberto) | M | Atendido | `fluxo-cidadao` (e2e) |
| FLX-03 | **Emissão de DAM:** mostra as taxas, calcula o total (com a área, quando cobrada por m²), gera o DAM, permite pagar (PIX/boleto simulados) e **termina em "Pago" com comprovante** | M | Atendido | unitário, `fluxo-cidadao` (e2e) |
| FLX-04 | **Abrir processo:** coleta endereço, bairro, descrição e documentos; gera protocolo e vai para **"Em análise"**, **sem DAM** | M | Atendido | unitário, `fluxo-cidadao` (e2e) |
| FLX-05 | **Acompanhamento** com linha do tempo específica de cada tipo, situação em selo colorido e lista das solicitações | M | Atendido | `fluxo-cidadao` (e2e) |
| FLX-06 | Solicitações e sessão **sobrevivem ao recarregar** a página | M | Atendido | `fluxo-cidadao` (e2e) |
| FLX-07 | Sair da conta encerra a sessão e protege a área privada | M | Atendido | `fluxo-cidadao` (e2e) |
| FLX-08 | **Agendamento de atendimento** sem necessidade de login: assunto, dia útil, horário (09:00–15:30), comprovante com protocolo, lista e cancelamento; horários já ocupados ficam indisponíveis | M | Atendido | `agendamento` (e2e), unitário |
| FLX-09 | Nada é enviado a servidor na demonstração (só armazenamento no próprio navegador) | M | Atendido | `fluxo-cidadao` (e2e) |
| FLX-10 | Emissão de DAM/processo com **integração real** (gov.br, DAM oficial, pagamento, acompanhamento do processo) | M | **Pendente** | Depende do backend existente; o que ocorre após o login real nunca foi coletado |

### 5.5 Consultas e painéis (CON)

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| CON-01 | Cada consulta reproduz **campos, botões e mensagens** do portal atual (ex.: "Não foi encontrado DAM em aberto para o CGA informado!") | M | Atendido | `consultas` (e2e) |
| CON-02 | Consultas por identificador **só respondem após consultar** e casam pelo valor inteiro | M | Atendido | unitário, `consultas` (e2e) |
| CON-03 | As 4 consultas de atividades usam **dados reais completos** (318, 1.332, 203 e 170 registros), com filtro e paginação de 20 | M | Atendido | unitário, `consultas` (e2e) |
| CON-04 | **Tela de detalhe** de cada registro: título, situação em selo, dados organizados; risco mostra os 4 níveis e as condições por extenso; auto e solicitação têm linha do tempo | M | Atendido | `consultas` (e2e) |
| CON-05 | Campos agrupados (processo em Origem/Ano/Nº; períodos de/até) e listas com a mesma primeira opção do portal atual ("Selecione…") | S | Atendido | `consultas` (e2e) |
| CON-06 | Resultados fictícios **sempre sinalizados** como demonstração | M | Atendido | `consultas` (e2e) |
| CON-07 | Resultados **reais** das consultas por número e dos painéis | M | **Pendente** | Dependem do backend; sem acesso ao sistema real |

### 5.6 Formulários, validação e feedback (FRM / FDB)

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| FRM-01 | Todo campo tem **rótulo visível** associado; ajuda e erro ligados ao campo | M | Atendido | axe (e2e) |
| FRM-02 | **Validação ao enviar**, com mensagem específica por campo, anunciada a leitores de tela e sem bloquear o teclado | M | Atendido | `fluxo-cidadao`, `agendamento` (e2e) |
| FRM-03 | Campos de data usam o seletor do navegador; períodos têm "De" e "Até" | S | Atendido | `consultas` (e2e) |
| FRM-04 | Após confirmar uma ação importante (agendamento), o **foco vai ao comprovante** | S | Atendido | `agendamento` (e2e) |
| FDB-01 | Estados vazios explicam o que fazer ("Você ainda não fez nenhuma solicitação", "Escolha um dia para ver os horários") | M | Atendido | `agendamento`, `fluxo-cidadao` (e2e) |
| FDB-02 | **Página de erro em português**, com identidade do portal e caminho de volta; **nunca em branco**, mesmo sem JavaScript | M | Atendido | `navegacao` (e2e, com JavaScript desligado) |
| FDB-03 | Páginas de erro mantêm título próprio e ficam fora dos buscadores | S | Atendido | `navegacao` (e2e) |
| FDB-04 | Textos do sistema sempre em português do Brasil | M | Atendido | inspeção |

### 5.7 Conteúdo e linguagem (CNT)

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| CNT-01 | Conteúdo real da SEDUR: 151 serviços, 1.079 normas, 804 notícias, 57 licitações, 53 formulários, dirigentes, organograma, projetos | M | Atendido | unitário (contagens) |
| CNT-02 | Nenhum dado **inventado** apresentado como real (ex.: IPTU Verde sem percentual de desconto, porque o original não informa) | M | Atendido | unitário |
| CNT-03 | Erros de texto do portal antigo corrigidos na leitura (palavras partidas, travessão quebrado, MAIÚSCULAS nos objetos de licitação) | S | Atendido | unitário (dados reais) |
| CNT-04 | Notícias antigas sem texto (612) mostram aviso e link para a publicação original | M | Atendido | `conteudo` (e2e) |
| CNT-05 | Siglas explicadas onde a origem permite (DAM, PDDU, LOUOS) | S | Parcial | Faltam siglas sem definição na origem (CLE, CGA) |
| CNT-06 | Texto integral das 612 notícias antigas | C | **Pendente** | Não coletado da origem |

### 5.8 Identidade visual e tema (VIS)

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| VIS-01 | Identidade a partir das cores e da logo oficiais da SEDUR (azul `#006cb5`, ciano `#00b8f1`, neutros frios) | M | Atendido | inspeção |
| VIS-02 | Tipografia: Poppins nos títulos, Montserrat no corpo, ValleySans só no título de destaque da home | S | Atendido | inspeção |
| VIS-03 | **Tema claro e escuro** reais, lembrado entre visitas, aplicado antes da primeira pintura (sem piscar) e com logo adequada a cada tema | M | Atendido | `tema-e-texto` (e2e) |
| VIS-04 | Página "lisa": sem fundos e bordas separando seções, exceto a faixa de categorias na home | S | Atendido | inspeção |
| VIS-05 | Cor de marca em texto sempre por tokens que se adaptam ao tema (nunca cor fixa) | M | Atendido | axe (e2e) |

### 5.9 Acessibilidade (ACE)

Meta: **WCAG 2.1 nível AA**.

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| ACE-01 | **Zero violações** do axe (WCAG 2.0/2.1 A e AA + boas práticas) em todas as páginas, nos temas claro e escuro, em desktop e celular | M | Atendido | `acessibilidade` (e2e: 164 verificações) e telas logadas |
| ACE-02 | Contraste mínimo 4,5:1 em textos (selos de situação e cor de marca incluídos) | M | Atendido | axe (e2e) |
| ACE-03 | **Foco visível** em todo controle; link **"Pular para o conteúdo"** como primeiro item | M | Atendido | `teclado` (e2e) |
| ACE-04 | Todo o portal operável **só com teclado**; sem armadilha de foco; Esc fecha menu, painel e busca devolvendo o foco | M | Atendido | `teclado`, `barra-acessibilidade` (e2e) |
| ACE-05 | Marcos de página corretos (`header`, `nav`, `main`), um `h1` por página, idioma `pt-BR` | M | Atendido | `navegacao` (e2e) |
| ACE-06 | Links e arquivos externos avisam que **abrem em nova aba** e o tipo do arquivo | S | Atendido | `conteudo` (e2e) |
| ACE-07 | **Painel de acessibilidade** com as opções do portal atual: aumentar/diminuir texto, escala de cinza, alto contraste, links sublinhados, fonte legível, reiniciar (+ tema claro/escuro), com escolhas salvas e aplicadas sem piscar | M | Atendido | `barra-acessibilidade` (e2e: axe em cada modo) |
| ACE-08 | **VLibras** (tradutor de Libras do governo federal) disponível em todas as páginas | M | Atendido | verificado no navegador; desligável por configuração |
| ACE-09 | Respeitar a preferência do sistema por **menos movimento** | S | Atendido | inspeção (CSS) |
| ACE-10 | Verificação com **leitor de tela real** (NVDA/VoiceOver) e zoom de 200% | S | **Pendente** | Não realizada (decisão do solicitante); a cobertura atual é automática |

### 5.11 Responsividade e uso no celular (MOB)

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| MOB-01 | Sem **rolagem horizontal** da página em 360, 390 e 768 px, em todas as páginas | M | Atendido | `mobile` (e2e) |
| MOB-02 | **Alvos de toque** de pelo menos 24 px (uso de 32 px nos links de texto) | M | Atendido | `mobile` (e2e) |
| MOB-03 | Texto legível: nada abaixo de 11,5 px; rótulos de ícone sem quebrar no meio da palavra | M | Atendido | `mobile` (e2e) |
| MOB-04 | Menu lateral vira gaveta (abre por botão, fecha com Esc ou ao tocar fora; **fechada, não entra no foco**) | M | Atendido | `teclado` (e2e) |
| MOB-05 | Busca ocupa linha própria no celular | S | Atendido | inspeção |
| MOB-06 | Tabelas largas rolam **dentro do próprio quadro**, sem alargar a página | M | Atendido | `mobile` (e2e) |
| MOB-07 | Texto aumentado não gera rolagem lateral; painel de acessibilidade cabe na tela pequena | M | Atendido | `tema-e-texto`, `barra-acessibilidade` (e2e) |
| MOB-08 | Verificação em **aparelhos reais** (iOS e Android) e navegadores além do Chromium | S | **Pendente** | Só testado com Chromium (Edge/Chrome) simulando celular |

### 5.12 Desempenho e robustez (DES)

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| DES-01 | Conteúdo principal **vem pronto do servidor** (útil sem JavaScript) | M | Atendido | `navegacao` (e2e, JS desligado) |
| DES-02 | Páginas de conteúdo pré-geradas (mais de 1.300 páginas estáticas) | S | Atendido | build |
| DES-03 | Sem erro de console nem resposta de erro em nenhuma página | M | Atendido | `navegacao` (e2e) |
| DES-04 | Funcionar mesmo sem `localStorage` (navegação privada) | S | Atendido | unitário |
| DES-05 | Metas numéricas de desempenho (ex.: Lighthouse, tempo até o conteúdo) | S | **Pendente** | **Não foram medidas** |

### 5.13 Confiança e transparência do protótipo (CNF)

| Código | Requisito | Pri. | Situação | Verificação |
|---|---|---|---|---|
| CNF-01 | Todo dado, resultado ou fluxo **simulado** vem sinalizado ("Demonstração: …") | M | Atendido | `consultas`, `fluxo-cidadao` (e2e) |
| CNF-02 | A demonstração **não pede nem guarda dado pessoal real**; perfis, CPF e CNPJ são fictícios e mascarados | M | Atendido | inspeção |
| CNF-03 | Sistemas de outros órgãos avisam **"você vai sair deste portal"** e sinalizam manutenção | S | Atendido | `conteudo` (e2e) |

---

## 6. Jornadas críticas e critérios de aceite

**J1 — Pagar a taxa de um serviço (Emissão de DAM)**
- *Dado* que estou na ficha de "Alteração de Razão Social", *quando* clico em **Emissão de DAM**, *então* sou levado a entrar (login de demonstração) e **volto** à emissão.
- *Quando* confiro as taxas e clico em **Emitir DAM**, *então* vejo o DAM com valor, vencimento e código, e a situação **"Aguardando pagamento"**.
- *Quando* clico em **Pagar com PIX**, *então* a situação vira **"Pago"**, aparece **"Comprovante disponível"** e **não** há etapa de análise.

**J2 — Abrir um processo**
- *Dado* que estou na ficha de "Autorização de Poda", *quando* clico em **Abrir processo** sem preencher, *então* vejo os avisos de campo obrigatório junto de cada campo.
- *Quando* preencho, anexo e envio, *então* recebo um **protocolo `SEDUR-…`**, a situação **"Em análise"** e **nenhum DAM**.

**J3 — Descobrir o que fazer**
- *Dado* um serviço **sem botão**, *quando* abro a ficha, *então* vejo o aviso de que não há solicitação online e o caminho para os Canais de atendimento.

**J4 — Consultar um DAM**
- *Quando* informo um CGA existente, *então* vejo o DAM e posso abrir o **detalhe** e **voltar à mesma consulta**; *quando* informo um CGA inexistente, *então* vejo a mensagem oficial de "não encontrado".

**J5 — Usar com necessidade de acessibilidade**
- *Quando* ativo **Alto contraste** e **Fonte legível** e percorro Serviços, Consultas e Agendamento, *então* nenhum texto fica ilegível e todo o fluxo continua operável por teclado.

**J6 — Ter um problema de rede ou endereço errado**
- *Quando* abro um endereço inexistente, *então* vejo **"Não encontramos essa página"** com caminho de volta, **mesmo sem JavaScript**.

---

## 7. Padrões de interface

- **Navegação:** barra lateral fixa (desktop) / gaveta (celular); topo com busca, "Entrar" e ajustes de acessibilidade.
- **Ícone + título, sem cartão:** categorias, legislação, transparência, institucional e acessos rápidos.
- **Listas:** simples, sem caixas; filtros e paginação por link.
- **Selos de situação:** verde (concluído/pago/regularizado), amarelo (aguardando/em aberto/pendência), vermelho (multa/alto risco), azul (em análise), cinza (neutro).
- **Linha do tempo:** mesma peça nos acompanhamentos e nas fichas de consulta.
- **Botões:** primário (ação principal), secundário (contorno), fantasma; sempre com cursor de mão e foco visível.
- **Avisos de demonstração:** texto pequeno com ícone de informação, no rodapé do conteúdo.
- **Tokens:** cores, tipografia e o utilitário de área de toque (`toque`) centralizados em `app/globals.css`.

---

## 8. Métricas e critérios de qualidade

| Dimensão | Meta | Como medir | Situação |
|---|---|---|---|
| Acessibilidade automática | 0 violações axe (A/AA) | `npm run test:e2e` | **Atingida** |
| Cobertura de conteúdo | 100% do que existe no portal atual e é conteúdo/acesso do cidadão | Auditoria contra `reforma-portal/` | **Atingida** (exceções na seção 10) |
| Layout mobile | 0 páginas com rolagem lateral; alvos ≥ 24 px | `mobile` (e2e) | **Atingida** |
| Robustez | 0 páginas em branco; 0 erros de console | `navegacao` (e2e) | **Atingida** |
| Conclusão de tarefas por usuários reais | ≥ 90% nas tarefas da seção 3.2 | Teste de usabilidade moderado | **Não medida** |
| Satisfação | SUS ≥ 80 | Questionário SUS | **Não medida** |
| Desempenho | A definir (ex.: Lighthouse ≥ 90) | Lighthouse / Web Vitals | **Não medida** |

---

## 9. Validação recomendada com usuários reais

1. **Teste de usabilidade** com 5 a 8 pessoas por perfil (P1, P2, P4), executando as tarefas da seção 3.2 **sem ajuda**, medindo sucesso, tempo e erros.
2. **Teste de leitor de tela** (NVDA no Windows; VoiceOver/TalkBack no celular) e de **zoom a 200%**.
3. **Teste em aparelhos reais** (iOS/Android) e em Firefox e Safari.
4. **Teste da busca** com termos reais de atendimento (extrair do WhatsApp e do balcão): tratar sinônimos e grafias (BUS-06).
5. **Revisão de conteúdo** pela SEDUR: siglas, textos duplicados, nomes genéricos e horários divergentes.

---

## 10. Limites, riscos e dependências

**Não é real (por depender de sistemas que não foram acessados):**
- O fluxo **após o login gov.br** (emissão de DAM, abertura e acompanhamento de processo) é **simulado** a partir dos botões reais de cada ficha; o que ocorre no sistema real nunca foi coletado.
- Resultados das **consultas por número** (DAM, auto de infração, solicitação, alvará) e dos **painéis de transparência** são fictícios (sinalizados).
- **Agendamento** é simulado e guardado só no navegador.

**Diferenças conscientes em relação ao portal atual:** o rodapé oficial (redes sociais, CNPJ, mapa) e os banners/carrossel não foram reproduzidos; os destinos dos banners estão nos "Acessos rápidos".

**Riscos:**
- **VLibras** carrega script de terceiros (governo federal); pode falhar sem rede ou atrasar em conexão lenta (há chave para desligar).
- **Dependência do backend existente:** os formatos de dado do protótipo (protocolos, DAM, agendamento) **vão mudar** quando houver integração.
- Notícias antigas (612) sem texto completo.

**Dependências externas:** dados reais das consultas e painéis; definição de siglas (CLE, CGA); decisão sobre Consulta Prévia, Salvador Ruas e Mapeamento (hoje só links).

---

## 11. Rastreabilidade e lacunas

**Evidências automatizadas** (`README.md`, seção "Testes"): 120 testes unitários (Vitest) e 577 de ponta a ponta (Playwright + axe), cobrindo navegação, acessibilidade, mobile, teclado, fluxos, consultas, agendamento, conteúdo, tema e a barra de acessibilidade.

**Requisitos ainda pendentes:** BUS-06, BUS-07, SRV-10, FLX-10, CON-07, CNT-06, ACE-10, MOB-08, DES-05 e as métricas de usuário da seção 8.

**O que este documento não substitui:** pesquisa com usuários, testes com leitor de tela e em aparelhos reais, e a validação do conteúdo pela SEDUR.

---

## 12. Glossário

| Termo | Significado |
|---|---|
| **SEDUR** | Secretaria Municipal de Desenvolvimento Urbano de Salvador |
| **DAM** | Documento de Arrecadação Municipal — a guia para pagar uma taxa |
| **PDDU** | Plano Diretor de Desenvolvimento Urbano |
| **LOUOS** | Lei de Ordenamento do Uso e Ocupação do Solo |
| **CNAE** | Classificação Nacional de Atividades Econômicas |
| **EIV / RIV** | Estudo de Impacto de Vizinhança / Relatório de Impacto de Vizinhança |
| **AOP** | Análise de Orientação Prévia |
| **CGA** | Identificador usado na consulta de DAMs em aberto (significado a confirmar com a SEDUR) |
| **CLE** | Sigla usada em serviços de Eventos e Carnaval (sem explicação na origem; a confirmar com a SEDUR) |
| **VLibras** | Ferramenta gratuita do governo federal que traduz conteúdo em português para Libras |
| **WCAG 2.1 AA** | Diretrizes internacionais de acessibilidade de conteúdo web, nível AA |
