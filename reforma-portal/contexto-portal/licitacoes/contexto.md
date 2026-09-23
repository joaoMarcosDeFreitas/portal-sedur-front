# Licitações — como é hoje

> Levantado em 21/09/2026, só leitura, sem login. Só o que **existe hoje**; o que está ruim e o que fazer fica em `explicacao.md`. Dados em `../../preparacao-mock/dados/licitacoes.json`.

**Onde fica:** menu `LICITAÇÕES` do site (https://sedur.salvador.ba.gov.br/licitacoes). Uma **única página** de 77 KB, sem paginação, sem busca e sem filtro, com **uma tabela de 57 linhas** (sem linha de cabeçalho). Site institucional (Joomla).

## Como a tabela é montada

- 4 colunas, sem título de coluna: **data · título · descrição · arquivo** (ícone de PDF que abre em outra aba).
- **57 linhas**, de **05/04/2019** a **10/04/2025**. A mais nova é o "EDITAL CONCORRÊNCIA 01/2025" (demolição e remoção de engenhos publicitários). **Nada mais novo que 10/04/2025**; a pesquisa foi em 21/09/2026.
- 55 linhas têm PDF; 2 não têm nenhum arquivo ("Edital de Dispensa de Licitação nº 13/2022" e "Edital de Audiência Pública Virtual nº 01/2001", com data 26/07/2021).
- Os arquivos ficam em `/images/pdf/` (50) e `/images/arquivos_processos/AAAA/MM/` (5, os de 2019 a 2021).
- Tipos de linha (todos misturados na mesma tabela, contados pelo título): Dispensa de Licitação **27**, Concorrência **13** (contando avisos e retificações), estudos/anexos/mapa **8** (7 estudos de viabilidade de mobiliário urbano de 2022 + 1 mapa), Pregão Eletrônico **2**, Audiência Pública **2**, Credenciamento **1**, Chamamento Público **1** e 3 sem tipo no título (“Edital PE nº 01/2024”, “Edital de Licitação – 005/2020” e “Edital nº 01-2020”).
- Linhas por ano (pela data escrita): 2019 **2** · 2020 **2** · 2021 **2** · 2022 **23** · 2023 **26** · 2024 **1** · 2025 **1**.
- A Concorrência 001/2023 (concessão de mobiliário urbano, 20 anos) ocupa **9 linhas soltas**, entre 07/07/2023 e 09/10/2023: o edital, 3 avisos de convocação (jornal e Diário Oficial), 4 retificações (uma delas a “segunda retificação”) e o mapa de georreferenciamento (Anexo VII).
- Descrições vão de poucas palavras até **862 caracteres** (a da Audiência Pública nº 02/2021).

## O que a tabela **não** tem

Número do processo em coluna própria, tipo (concorrência, dispensa…), situação (aberta, encerrada, homologada, cancelada), valor, data de abertura, resultado/vencedor, contrato, link para o local onde se acompanha o certame. Tudo isso, quando existe, está dentro do PDF. [a confirmar com o Johnny onde a SEDUR guarda essas informações e se algum sistema de compras da Prefeitura já as publica]
