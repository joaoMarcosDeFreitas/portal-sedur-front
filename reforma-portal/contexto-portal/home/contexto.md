# Home (site institucional) — como é hoje

> Levantado em 21/09/2026, só leitura, sem login. Aqui só o que **existe hoje**. O que está ruim e o que fazer fica em `explicacao.md`. Dados para o sistema de teste em `../../preparacao-mock/`.

**Endereço:** https://sedur.salvador.ba.gov.br/ — feito em **Joomla** (programa pronto para sites de conteúdo), modelo visual próprio chamado "sedur", com Bootstrap 4.4.1 e jQuery 3.2.1 carregados de servidores externos. A página pesa ~27 KB de texto. **Este é o site "original" que o Johnny quer que passe a ser a casa de tudo** (ver `../servicos/explicacao.md`).

## O que aparece na tela, de cima para baixo

1. **Faixa do topo:** link "Prefeitura Municipal de Salvador" e 4 ícones de rede social (Facebook, YouTube, Flickr, Twitter). Os 4 ícones levam aos perfis **da Prefeitura**, não da SEDUR.
2. **Logo + menu:** `INSTITUCIONAL` (submenu: Dirigentes, Estrutura Organizacional, Área de Atuação), `SERVIÇOS`, `NOTÍCIAS`, `LEGISLAÇÃO`, `LICITAÇÕES`, `TRANSPARÊNCIA`.
3. **Carrossel de 4 banners** (imagens que trocam sozinhas, com o texto dentro da própria imagem):

| # | Arquivo da imagem | Para onde leva |
|---|---|---|
| 1 | `/images/banners/Banners-Sedur-1.jpg` | Portal de Serviços (`servicos.sedur…/#/portal/home`, endereço em formato antigo) |
| 2 | `/images/banners/Banner_Sedur-2.jpg` | Agendamento (`agendamento.sedur…/sas/#agendamento`) |
| 3 | `/images/banners/revisao-pddu-2026-new.jpeg` | Site da Revisão do PDDU (`pddu.salvador.ba.gov.br`) |
| 4 | `/images/banners/Banners-Sedur-4.jpg` | Canais de Atendimento (`servicos.sedur…/#/portal/contacts`, formato antigo) |

4. **"Nossos Projetos"** — 6 blocos com imagem: Plano de Incentivo Fiscais (`/plano-de-incentivos-fiscais`), Eu Curto Meu Passeio (`/eu-curto-meu-passeio`), Conselho Municipal Salvador (`/conselho-municipal-salvador`), TUL (`/tul`), Revitalizar (`/revitalizar`), PIDI (`/pidi`). Detalhe de cada um em `projetos/`.
5. **"Notícias" + "VEJA TODAS":** as 3 notícias mais novas (foto, título, data por extenso, "+ Veja Mais"). "VEJA TODAS" leva a `http://sedur.salvador.ba.gov.br/index.php/noticias`.
6. **Rodapé:** "© 2021 - Secretaria Municipal de Desenvolvimento Urbano. Todos os direitos reservados."; bloco **"ACESSO RÁPIDO"** com 4 links (Acesso Interno, Agendamento, Canais de Atendimento, Portal Fala Salvador); "Prefeitura Municipal de Salvador — 13.927.801/0029-40"; endereço **em forma de imagem** (`/images/imagens/END_SEDUR.png`): "Av. ACM, nº 3224, Caminho das Árvores - Salvador/BA, Edf. Empresarial Thomé de Souza / Térreo - CEP 41110-700", com link para o Google Maps.

## Para onde a home leva (mapa de saídas)

| Destino | Sistema | Como é o link |
|---|---|---|
| Institucional (3 páginas), Notícias, Legislação, Licitações, Transparência, 6 projetos | Site (Joomla) — mesmo sistema | link normal |
| Serviços, Canais de Atendimento | Portal de Serviços (outro sistema) | formato antigo `#/portal/...` |
| Agendamento | Sistema à parte (`agendamento.sedur…`) | `/sas/#agendamento` |
| Revisão do PDDU | Site à parte (`pddu.salvador.ba.gov.br`) | link normal |
| Acesso Interno | `sedur…/acessoremoto/` | pede usuário e senha (ver `../acesso-interno/`) |
| Portal Fala Salvador | `http://www.falasalvador.ba.gov.br/portal/portal/` | **não abre** (confirmado pelo Johnny) |

## Como a página é montada (útil para o sistema de teste)

- 4 banners + 6 projetos + 3 notícias + menu de 6 itens + rodapé. Não tem campo de busca na home (a busca do site só aparece dentro de `/noticias`).
- Estas mesmas peças (topo, menu e rodapé) se repetem em todas as páginas do site.
- Idioma da página declarado: pt-br. Tem `viewport` (adapta a celular); o comportamento real no celular **não foi testado** (o Chrome automático foi bloqueado pelo firewall da Prefeitura, ver `../../CLAUDE.md`). [a confirmar no celular]
- Sem `robots.txt` e sem `sitemap.xml` (os dois endereços respondem "404 - Artigo não encontrado").
