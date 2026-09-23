# Notícias — como é hoje

> Levantado em 21/09/2026, só leitura, sem login. Só o que **existe hoje**; o que está ruim e o que fazer fica em `explicacao.md`. Dados em `../../preparacao-mock/dados/noticias.json` (índice completo das 804 notícias; texto de 192 delas).

**Onde fica:** menu `NOTÍCIAS` do site (https://sedur.salvador.ba.gov.br/noticias), título da tela "Notícias SEDUR". Site institucional (Joomla). Na home aparecem só as 3 mais novas, com o botão "VEJA TODAS".

## Números

- **804 notícias** em **81 páginas de lista** (10 por página), de **13/08/2014** a **11/09/2026**. Números de identificação de 47 a 910 (faltam 60 números no meio: notícias apagadas ou nunca publicadas).
- Por ano: 2014 **52** · 2015 **161** · 2016 **110** · 2017 **72** · 2018 **64** · 2019 **71** · 2020 **121** · 2021 **39** · 2022 **21** · 2023 **29** · 2024 **10** · 2025 **18** · 2026 **36** (até 11/09).
- 260 títulos começam com o nome antigo do órgão, **"Sucom"** (de 13/08/2014 a 16/11/2016); "Sedur" aparece a partir de 11/01/2017.
- Só **121** das 804 têm foto de miniatura na lista (todas de 2021 em diante). As 683 mais antigas aparecem sem foto.

## A lista (`/noticias`, `/noticias?start=10`, `?start=20`…)

- No alto: campo **"Pesquisar..."** (etiqueta "Buscar"), que envia para a busca geral do site (`/component/finder/search?q=…`).
- Cada linha: ícone de calendário + **data no formato `11-09-26`** + título (link) + miniatura (quando há).
- Rodapé da lista: "Página 1 de 81", botões Início · Anterior · 1 2 3 … 10 · Próximo · Fim (só mostra 10 números de página por vez).
- Não há filtro por ano, assunto ou tipo, nem lista de categorias ou etiquetas.

## A notícia (`/noticias/<número>-<título-na-url>`)

- Título, botões **Voltar** (histórico do navegador) e **Imprimir** (`…?tmpl=component&print=1`), bloco **"Detalhes"**, **"Publicado: 11 Setembro 2026"** e o texto (média de ~2.200 caracteres nas 192 lidas; cerca de 65% têm menos de 5 parágrafos).
- **Sem foto na página da notícia.** O código do modelo tem um trecho comentado ("Retirei a inclusão de imagem automaticamente das notícias"). Só 4 das 192 notícias lidas têm imagem dentro do texto (as fotos da lista e da home ficam só como miniatura).
- Sem autor, categoria, etiquetas, compartilhar, notícias relacionadas ou legenda de foto.
- Navegação entre notícias: só **"Anterior"** e **"Próximo"**. "Próximo" leva à notícia **mais antiga** e "Anterior" à mais nova (ao contrário do que se espera).

## Busca geral do site (Joomla "Pesquisa Inteligente")

Endereço: `/component/finder/search?q=<termo>`. Aceita acentos e sem acentos (busca "alvara" acha "alvará"). Mistura resultados de notícias, páginas e das listas de Legislação (cada lista inteira como **um** resultado). Tem "Pesquisa Avançada" com filtros por Autor, Categoria (Legislação, Notícias, Página, Projetos, Transparência, Uncategorised), Idioma e Tipo (Artigos, Categorias, Contatos). Não pesquisa dentro de PDFs. Detalhes em `explicacao.md`.
