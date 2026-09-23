# Legislação — como é hoje

> Levantado em 21/09/2026, só leitura, sem login. Só o que **existe hoje**; o que está ruim e o que fazer fica em `explicacao.md`. Dados completos (1.079 documentos) em `../../preparacao-mock/dados/legislacao.json`.

**Onde fica:** menu `LEGISLAÇÃO` do site (https://sedur.salvador.ba.gov.br/legislacao). É uma tela de **14 blocos com imagem**. Cada bloco leva a uma lista de documentos em PDF (9 blocos) ou a uma tela intermediária com mais 2 ou 3 blocos (5 blocos). Fica no site institucional (Joomla), separado do Portal de Serviços.

## Árvore (o que existe e quantos documentos)

| Bloco | Endereço | Vai para | Documentos |
|---|---|---|---|
| CNLU | `/cnlu` | 2 subtelas | Comunicados **17** · Resoluções **6** (a tabela tem também 15 linhas em branco) |
| Covid-19 | `/covid-19` | lista | **186** (2020 a 2022) |
| Decretos | `/decretos` | lista | **244** (1980 a 2026) |
| Denominação de Logradouros | `/denominacao-de-logradouros` | lista | **87** (2015 a 2022) |
| Desapropriação | `/desapropriacao` | 2 subtelas | Municipal **144** (2012 a 2021) · Estadual **64** (1995 a 2012) |
| Editais | `/editais` | lista | **4** (2009 a 2013) |
| Instruções Normativas | `/instrucoes-normativas` | lista | **25** (2004 a 2021) |
| Leis | `/leis` | lista | **161** (1979 a 2026) |
| Louos 2016 | `/louos-2016` | 3 subtelas | Louos **8** · Louos Mapas **8** · Louos Quadros **14** |
| Bens Tombados | `/bens-tombados` | lista | **1** (mapa do Rio Vermelho, 2005) |
| PDDU 2016 | `/pddu-2016` | 2 subtelas | Leis PDDU **13** · Mapas PDDU **12** |
| Plano Salvador 500 | `/plano-salvador-500` | lista | **19** (2012 a 2019) |
| Portarias | `/portarias` | lista | **43** (1966 a 2020) |
| Taxas/Multas | `/taxas-multas` | 2 subtelas | Tabela de Taxas **6** (2021 a 2026) · Tabela de Multas **17** (2024 a 2026) |
| **Total** | | **20 listas** | **1.079** |

Endereços das subtelas: `/<bloco>/18-legislacao/<número>-<nome>` (ex.: `/cnlu/18-legislacao/797-comunicados`; o `18` é a categoria "Legislação" do Joomla).

## Como cada lista é montada

- Uma **tabela única, sem paginação, sem busca e sem filtro**, com 4 colunas: **Data · Nº Legislação · Descrição · Arquivo**. A coluna Arquivo é um ícone de PDF (`/images/icon/pdf.png`) que abre o arquivo em outra aba.
- A ordem é da data mais nova para a mais antiga (com algumas exceções, ver `explicacao.md`).
- A Descrição vai desde o nome curto ("Decreto nº 34.248/2021") até a ementa inteira (frases de 300 caracteres).
- Os arquivos ficam no próprio servidor do site, em `/images/arquivos_processos/AAAA/MM/…` (a grande maioria, ano do envio; **381 só de 2014**, envio em massa) e, os mais novos, em `/arquivos/AAAA/MM/…`. Há 1.079 linhas com documento, cerca de 1.059 endereços diferentes (alguns arquivos aparecem em mais de uma lista, de propósito ou por engano).
- Um mesmo documento pode estar em mais de uma lista (ex.: Decreto nº 32.636/2020 em Covid-19 e em Decretos; Portaria SEDUR nº 184/2020 em Covid-19 e em Portarias).

## Busca e ligações com o resto

- O site tem uma busca geral (Joomla), acessível só pela página de Notícias. Ao buscar "alvara", a Legislação aparece como **uma linha por lista** ("Decretos", "Leis"…), com um pedaço da tabela como resumo; **os PDFs não são pesquisados**.
- A Legislação não é ligada à Carta de Serviços: a ficha de um serviço cita leis pelo número (ex.: Lei nº 7.186/2006) sem link, e a lista de Leis não diz a quais serviços cada lei se aplica.
