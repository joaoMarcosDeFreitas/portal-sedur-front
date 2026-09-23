# Reforma do portal da SEDUR

## O que é esta pasta

O portal atual da SEDUR (sedur.salvador.ba.gov.br) **possui problemas**. Esta pasta existe para **propor melhorias** nele.

O trabalho aqui é de proposta: entender como o portal funciona hoje, apontar o que está ruim e sugerir como melhorar. Nada aqui altera o portal de verdade.

## Como está organizada

Tudo fica dentro de `contexto-portal/`. Ela tem uma pasta para cada etapa (parte) do portal:

- `home/`
- `institucional/`
- `servicos/`
- `noticias/`
- `legislacao/`
- `licitacoes/`
- `transparencia/`
- `acesso-interno/`

Cada pasta guarda **três coisas** sobre a sua etapa do portal:

1. **`contexto.md` — o que existe hoje.** Como aquela parte é organizada e funciona hoje (estrutura, números, endereços). Só fatos, sem opinião. *(Passou a existir em 21/09/2026 nas etapas do site; em `servicos` o "contexto" está na própria árvore de pastas e nos `explicacao.md`.)*
2. **`explicacao.md` — o que está ruim e o que fazer** (formato do Johnny: título "# Melhorias" + lista, cada item diz o que está errado e o que deveria ser feito).
3. **O plano de melhoria individual.** As propostas detalhadas, uma etapa de cada vez (fase 2; ainda não começou).

E existe **`preparacao-mock/`** (ao lado de `contexto-portal/`): todo o conteúdo do portal de hoje em forma de dados (JSON), o modelo de informações e a lista do que falta, para quando o sistema de teste (mock) for criado. **Ler o `README.md` de lá antes de mexer em dados.**

### Modelo de organização (feito pelo Johnny): `base-para-contexto/`

A pasta `base-para-contexto/` é o **exemplo** de como cada etapa deve ficar. **Não alterar** o que está lá. O padrão de cada serviço é:

```
<categoria>/                       ← nome da categoria em minúsculas (ex.: ambiental)
  <Nome do Serviço>/               ← uma pasta por serviço, com o nome como aparece no portal
    explicacao.md                  ← título "# Melhorias" + uma lista de problemas encontrados
    image.png, evidencia.png…      ← prints que provam cada problema (o Johnny tira; eu não consigo)
```

Cada `explicacao.md` de serviço tem só o título `# Melhorias` e itens em lista, cada um dizendo **o que está errado e o que deveria ser feito**.

**Correção do Johnny (18/09/2026):** no modelo, o `explicacao.md` geral está **fora** da pasta `servicos/`, e isso é um engano. O lugar certo é **dentro** da pasta da etapa (ex.: `contexto-portal/servicos/explicacao.md`). Cada etapa tem o seu `explicacao.md` geral. Em 18/09 ele mandou fazer só depois de analisar todas as etapas; **em 21/09/2026 ele liberou** (pediu o de `servicos` e o mapeamento do site principal), então **já existem** o `servicos/explicacao.md` e os das etapas do site. Os itens que o Johnny anotou para o geral de `servicos` ("Muita poluição visual em cada solicitação de serviço."; "O design principal de serviços devia já mostrar todas as categorias e ter uma barra de pesquisa") estão lá.

**Objetivo central definido pelo Johnny (21/09/2026):** os erros existem, mas **o ponto principal é unificar o Portal de Serviços e o site original (sedur.salvador.ba.gov.br) em um único sistema**, melhorando design e UX. Toda proposta da fase 2 deve partir disso.

### `servicos` é um sistema diferente do portal inicial (home)

`servicos.sedur.salvador.ba.gov.br` é um **sistema à parte** do site institucional (a home). A etapa `servicos` cobre **tudo que existe nesse sistema**, não só a lista de serviços, e todo problema encontrado deve ser anotado. Regra de organização (Johnny): **o que é um serviço em si** fica em `servicos/servicos-disponiveis/`; **o que é uma funcionalidade do sistema** (ex.: `/contato`) fica em pasta própria ao lado. Cada funcionalidade tem seu `explicacao.md`; se tiver itens (ex.: as 8 consultas), cada item tem sua subpasta com `explicacao.md`.

```
contexto-portal/servicos/
  servicos-disponiveis/<categoria>/<Nome do Serviço>/explicacao.md   ← os 151 serviços da Carta (+ "serviços dispensados de licença")
  pagina-inicial/            ← a home do sistema de serviços (busca, cards, banners "Fique por dentro")
  consultas/<consulta>/      ← as 8 consultas
  formularios/               ← a lista de formulários (PDFs)
  geoservicos/
  transparencia/<item>/      ← os 8 itens de transparência do sistema de serviços
  fiscalizacao-carnaval/     ← página sem link visível
  iptu-verde/                ← página sem link visível
  canais-de-atendimento/     ← /contato
  login-govbr/               ← o que dá para ver do "Entre ou cadastre-se" (por fora)
  acessibilidade/            ← barra de acessibilidade + VLibras
  sistemas-parceiros/        ← banners que levam a Consulta Prévia, Salvador Ruas, PDDU, CLE, CityPro, JUCEB
  menu-e-rodape/             ← cabeçalho, menu, rodapé e títulos das páginas
  paginas-de-erro/           ← /instabilidade, página 404 e erros 500
```

Pendente por depender do Johnny (área logada, não consigo ver): abrir processo, pagamento DAM/PIX, acompanhar processo. O Johnny ofereceu o acesso dele ao gov.br; **recusei** (ver "Regras de trabalho"). Alternativa: prints e descrição do Johnny.

## Regra de ouro: contexto sempre atualizado

**A cada interação**, antes de encerrar a resposta, atualizar o contexto: este `CLAUDE.md` (seção "Estado atual" abaixo) e os arquivos das pastas de `contexto-portal/` que mudaram. O Johnny pode encerrar a sessão a qualquer momento, e quem retomar (eu mesmo, depois) precisa saber exatamente onde o trabalho parou, sem depender da conversa. Não deixar a atualização para "o fim".

## Estado atual

### Estado em 21/09/2026 — fase 1 quase completa (só faltam itens que dependem do Johnny)

**O que o Johnny pediu em 21/09/2026 e o que foi feito:**
1. Registrar as correções dele em `servicos` — **feito**: Fala Salvador não abre (link errado ou site inexistente; o servidor responde "nome não reconhecido"), consultas com design "feio e ultrapassado", Autorização para Feira em manutenção (ignorar), prints do gov.br/DAM pendentes (sistema caiu; ignorar por ora).
2. Escrever `servicos/explicacao.md` (geral) — **feito**: conceito "os erros existem, mas o ponto principal é unificar tudo em um único sistema com o site original (sedur.salvador.ba.gov.br) e melhorar design e UX".
3. Mapear o site principal nas pastas de `contexto-portal/` — **feito** (todas as 8 etapas têm `explicacao.md`; as 7 do site também têm `contexto.md`).
4. Deixar tudo preparado para o sistema de teste (mock) — **feito em quase tudo**: ver `preparacao-mock/README.md` (dados em JSON, modelo de informações, cópia das páginas, scripts, e a lista do que falta).
5. Anotar o progresso — este bloco.

**Situação de cada etapa** (`contexto-portal/<etapa>/`):

| Etapa | Arquivos | Resumo do que se achou |
|---|---|---|
| `servicos` | 182 `explicacao.md` (18/09) + `explicacao.md` geral + `sistemas-parceiros/contexto.md` (21/09) | Análise completa do que é visível sem login. Falta o fluxo logado (Johnny). |
| `home` | `contexto.md`, `explicacao.md`, `projetos/` (geral + 6 projetos) | Carrossel sem descrição, links `#/portal/...` antigos, Fala Salvador quebrado, rodapé "© 2021", 5 títulos h1, "Nossos Projetos" mistura tipos; **Revitalizar com passos que dão 404**; **Renova Centro sem página**; página 404 sem layout. |
| `institucional` | `contexto.md`, `explicacao.md` | Menu "Institucional" não é página (404); organograma é imagem (transcrita em JSON); página Dirigentes de 954 KB e possivelmente desatualizada (notícia de 11/09/2026 cita outro diretor). |
| `noticias` | `contexto.md`, `explicacao.md` | 804 notícias (2014–2026), só 121 com miniatura, foto some ao abrir, "Anterior/Próximo" invertidos, busca em português quebrado e sem PDFs, duplicadas, 260 com "Sucom". |
| `legislacao` | `contexto.md`, `explicacao.md` | 1.079 documentos em 20 listas, sem busca/filtro; **29 não abrem** (14 sem endereço, 11 vazios, 3 com 404, 1 servidor inexistente); 2 arquivos trocados; 780 MB de PDFs; sem situação (vigente/revogada). |
| `licitacoes` | `contexto.md`, `explicacao.md` | 57 linhas numa tabela sem cabeçalho/situação; **nada desde 10/04/2025**; 3 sem arquivo que abra; processo espalhado; numeração repetida. |
| `transparencia` | `contexto.md`, `explicacao.md` | Só 2 itens com 1 documento cada (2021); separada da Transparência do Portal (8 itens). |
| `acesso-interno` | `contexto.md`, `explicacao.md` | Pede "usuário e senha da Rede Sedur" (401 básico); o que existe depois é desconhecido. **Depende do Johnny** (perguntas em `contexto.md`). |

**Falta / depende do Johnny (não consigo ver ou estão fora do ar):**
- Prints do fluxo pelo gov.br (emitir DAM, pagamento DAM/PIX, abrir processo, acompanhar, "Agendamento Serviços"). O sistema caiu; o Johnny mandará depois. **Nunca usar nem receber login.**
- Autorização para Feira (CLE): em manutenção. **Salvador Ruas também está em manutenção** (achei em 21/09/2026: "Site em manutenção"); avisar o Johnny.
- Acesso Interno: quem usa, para quê, o que existe depois do login (5 perguntas em `acesso-interno/contexto.md`).
- Conferir no navegador (não consegui, o Chrome automático é bloqueado pelo firewall): como as páginas ficam no celular, a Consulta Prévia (só monta a tela no navegador) e as antigas consultas/painéis dentro de janela.
- Texto das **612 notícias mais antigas** (2014 a ago/2020): só o índice foi baixado. Rodar `preparacao-mock/scripts/crawl_artigos.py` (~35–45 min, retoma sozinho). Não é urgente.

**ALERTAS já avisados/para avisar à TI (não repetir os dados pessoais):**
- (18/09) `/govbr` no Portal de Serviços abre **sem login** uma tela de demonstração com 3 pessoas e botão "Continuar". **Não clicar em "Continuar", nunca.**
- (21/09) 11 PDFs da Legislação abrem **vazios**; 29 documentos não abrem no total (lista em `preparacao-mock/dados/legislacao.json`, campo `problemas`).
- (21/09) Site institucional em Joomla 3 aparentemente (fora de suporte desde 08/2023), com jQuery de 2013/2017; [a confirmar com a TI].
- (21/09) Página do Agendamento com telefone de exemplo "(+71) 9 9999 9999" e textos "inserir um link" publicados.

**Aprendizados sobre como coletar (para a próxima etapa):**
- **O firewall da Prefeitura (COGEL) bloqueou o Chrome automático** ("Acesso Bloqueado", Attack ID 20000051, IP da máquina) na 1ª tentativa de tirar print da home. Pedidos simples com `curl`, **um por vez, 2 s de pausa, `nice -n 19 ionice -c3`**, passam. **Não tentar contornar** o bloqueio. Como o Chrome é bloqueado, não dá para tirar print; o visual foi lido pelo código.
- O Playwright MCP não abre o Chrome como administrador (falta `--no-sandbox`); não é necessário para esta tarefa.
- **Cuidado com `pkill -f <nome>`** dentro de um comando cujo texto contém esse mesmo nome: mata o próprio comando. Usar `pgrep -af "^python3 nome.py"` e `kill <pid>`.
- Coleta de ~1.150 links (HEAD, 1 por vez) levou ~35 min; 804 notícias a 2,5 s levaria ~45 min. Ficam sempre em segundo plano, um de cada vez.
- Falsos alarmes já descartados (não registrar): texto "C ONFORME"/"M unicípio" em Licitações (vem de eu separar tags do HTML, não do site); sempre confirmar antes de afirmar, e conferir exemplos de qualquer regra automática.
- Os arquivos brutos e scripts agora ficam **dentro do projeto** (`preparacao-mock/coleta-bruta/`, `preparacao-mock/scripts/`), não só na pasta temporária.

**Decisões que tomei e o Johnny pode desfazer:** (1) escrevi os `explicacao.md` das etapas do site logo, entendendo que "Complete a sua contextualização" (21/09) liberou a regra de esperar; (2) criei `contexto.md` por etapa (fatos) separado do `explicacao.md` (problemas), e a pasta `preparacao-mock/`; (3) o `organograma.json` é transcrição minha da imagem (conferir); (4) cada problema traz o trecho copiado do portal como prova (sem prints, que eu não consigo tirar); (5) nomes dos dirigentes foram copiados como estão na página pública (dados de servidores públicos); (6) proponho tratar "Renova Centro" como programa ligado ao Revitalizar (não confirmado).

**Próximo passo sugerido:**
1. O Johnny **revisa por amostragem** os `explicacao.md` novos (principalmente `home`, `legislacao`, `licitacoes`) e diz o que corrigir.
2. O Johnny responde as 5 perguntas do `acesso-interno` e manda os prints do gov.br quando o sistema voltar (e avisa quando Feira/Salvador Ruas voltarem).
3. Com isso, **encerra a fase 1** e começa a **fase 2**: propor melhorias uma por uma (partindo do objetivo de unificar em um só sistema). O design/apresentação (fase 3) continua fora de escopo até ele dizer.

### Histórico: estado em 18/09/2026 (só `servicos`; mantido para consulta)

*(Atualizado em 18/09/2026)*

**Etapa `servicos`: análise FEITA e gravada** em `contexto-portal/servicos/` (182 `explicacao.md`):
- `servicos-disponiveis/` — 151 serviços (13 categorias) + "serviços dispensados de licença" + o `explicacao.md` da própria Carta/ficha.
- Funcionalidades do sistema, cada uma com seu `explicacao.md`: `pagina-inicial`, `consultas` (+8 subpastas), `formularios`, `geoservicos`, `transparencia` (+8 subpastas), `fiscalizacao-carnaval`, `iptu-verde`, `canais-de-atendimento`, `login-govbr`, `acessibilidade`, `sistemas-parceiros`, `menu-e-rodape`, `paginas-de-erro`.
- *(18/09)* `servicos/explicacao.md` ainda não existia; **passou a existir em 21/09/2026** (ver bloco acima).
- *(18/09)* As outras 7 etapas estavam **vazias**; **em 21/09/2026 foram todas preenchidas** (ver bloco acima).

**Falta / depende do Johnny (não consigo ver):**
- Área logada: abrir processo, pagamento DAM/PIX, acompanhar processo, o que aparece depois do login gov.br, o card "Agendamento Serviços". O Johnny ofereceu o login dele; **recusei** (regra abaixo). Alternativa: prints e descrição dele.
- Conferir no navegador (a marcação `[a confirmar]` nos arquivos): (1) depois de clicar numa aba da ficha, o botão "Emissão de DAM" / "Abrir processo" volta para `/livewire/update` (erro 405)? Passar o mouse no botão e ver se o endereço contém `livewire`; (2) se as páginas antigas embutidas (consultas e painéis de transparência) ficam pequenas no celular; (3) o Fala Salvador (não abriu a partir do computador que uso); (4) o formulário CLE de "Autorização para Feira".
- Não testei o **resultado** das consultas e dos painéis (exigiria digitar dados reais nos formulários).

**ALERTA para a TI (avisei o Johnny):** `/govbr` no sistema de serviços abre **sem login** uma tela de login de demonstração (campos `usuario-demo`, 3 pessoas com nome e CPF parcialmente oculto, botão "Continuar" que faz POST em `/govbr/login`). Parece ferramenta de teste esquecida em produção. **Não clicar em "Continuar", nunca.** Está descrito em `servicos/login-govbr/explicacao.md` (sem repetir os nomes).

**Aprendizados sobre como coletar (para a próxima etapa):**
- O firewall da Prefeitura (COGEL) **bloqueou uma das minhas leituras** ("URL Bloqueada", com o IP da máquina). Os pedidos seguintes voltaram ao normal, mas: usar **pausa de 2 segundos**, não rodar duas coleções ao mesmo tempo, e evitar o que pareça varredura. Isso **não é defeito do portal**; não registrar.
- Para ler as abas de uma ficha e o conteúdo de componentes que só abrem ao clicar, reproduzo o pedido a `/livewire/update` (mesmo pedido do navegador). Cuidado: chamar o método no componente certo (o acordeão dos Canais é um componente-filho; chamar no pai dá erro 500 que é meu, não do portal).
- Falsos alarmes que já descartei (não registrar): `57) event.returnValue = false;` nas páginas antigas (falha do meu leitor de HTML); 503 em link `http://` (redireciona e abre); pares "formulário diferente" (o comparador casava nomes errado). **Sempre confirmar antes de afirmar**, e conferir o resultado de qualquer regra automática lendo exemplos.
- Os dados brutos e os scripts ficam na pasta temporária da sessão, fora do projeto. Refazer a coleta dos 151 serviços leva cerca de 25 minutos (a 1 pedido por segundo).

**Decisões que tomei e o Johnny pode desfazer:** (1) sem prints (não consigo tirar): cada problema traz o trecho copiado do portal como prova; (2) problemas repetidos em muitos serviços aparecem em cada `explicacao.md` (como no modelo); (3) nomes das pastas de funcionalidade em minúsculas, sem acento, com hífen; pastas de itens (consultas, transparência) com o nome como aparece no portal; (4) o texto dos arquivos pode ter problema listado a mais ou a menos do que o Johnny listaria: ele deve revisar amostras.

**Próximo passo sugerido:** o Johnny escolhe a próxima etapa (`home` = site institucional, `institucional`, `noticias`, `legislacao`, `licitacoes`, `transparencia` ou `acesso-interno`) e diz o que quer (eu navegar sozinho, como fiz em `servicos`, ou ele passar contexto/prints). `acesso-interno` depende dele (login).

## Regras de trabalho

- O que não estiver confirmado pelo Johnny ou visível no portal fica marcado como `[a confirmar]`. Não inventar dado.
- Antes de propor algo sobre uma parte do portal, ler a pasta correspondente em `contexto-portal/`: o contexto de hoje vem primeiro, a proposta depois.
- Manter separado o que **é** hoje (contexto) do que **deveria ser** (plano de melhoria). Não misturar os dois no mesmo trecho.
- Cada plano de melhoria vale só para a sua etapa. Se uma proposta mexer em outra parte do portal, dizer isso claramente.
- **Nunca usar login do Johnny** (gov.br ou outro), nem recebê-lo. Navegação só leitura: sem login, sem enviar formulário, sem clicar em "solicitar". Uma tarefa pesada por vez, com **pausa de 2 segundos** entre pedidos ao servidor da SEDUR (`curl`, `nice -n 19 ionice -c3`). **Não usar Chrome/Playwright automático contra o site** (o firewall da Prefeitura bloqueia) e **não tentar contornar bloqueios**: se aparecer "Acesso Bloqueado", parar e avisar o Johnny.
- Contexto geral do portal (como os sistemas se comunicam por dentro): `../README.md`.
