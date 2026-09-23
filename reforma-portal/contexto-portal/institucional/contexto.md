# Institucional — como é hoje

> Levantado em 21/09/2026, só leitura, sem login. Só o que **existe hoje**; o que está ruim e o que fazer fica em `explicacao.md`. Dados estruturados para o sistema de teste em `../../preparacao-mock/dados/` (`dirigentes.json`, `organograma.json`, `institucional.json`).

**Onde fica:** menu `INSTITUCIONAL` do site (https://sedur.salvador.ba.gov.br). O item do menu **não é uma página** (o link é só `#`, abre um submenu). O endereço `/institucional` sozinho responde "404 - Artigo não encontrado". São 3 páginas:

| Página | Endereço | O que tem | Peso da página |
|---|---|---|---|
| Dirigentes | `/institucional/dirigentes` | Lista de 20 cargos com nomes + foto do secretário | **954 KB** (a foto vai dentro do próprio código da página) |
| Estrutura Organizacional | `/institucional/estrutura-organizacional` | Uma única imagem: o organograma oficial (“Anexo III”) | 17 KB + imagem de 942 KB |
| Área de Atuação | `/institucional/area-de-atuacao` | Texto curto com 7 áreas, cada uma com um ícone | 21 KB |

Todas têm o botão "Voltar" (volta à página anterior do navegador) e o mesmo topo/rodapé do restante do site. Nenhuma tem data de atualização, contato, nem link para outra parte do site.

## Dirigentes

- Formato: texto livre. Cargo em negrito, nome na linha de baixo. **20 registros:** Secretário Municipal de Desenvolvimento Urbano, Subsecretário, 3 diretores (Fiscalização, Licenciamentos, Desenvolvimento Urbano), Ouvidor Setorial, 5 gerentes (Cadastro Técnico, Planejamento Urbano, Gestão de Projetos Urbanos, Licenciamentos Urbanos, Licenciamento Ambiental), 7 coordenadores (Empreendimentos, Atividade e Publicidade, Processos Especiais, Licenciamento Ambiental, Fiscalização Urbanística e Segurança, Fiscalização Ambiental, Administrativa), Coordenador de Tecnologia da Informação e a Assessoria de Comunicação (2 nomes).
- Só o secretário tem foto (PNG de 614×614 px, 911 KB, sem texto alternativo). Ninguém tem e-mail, telefone ou currículo na página.
- Lista completa em `../../preparacao-mock/dados/dirigentes.json`.

## Estrutura Organizacional

- É a figura `/images/imagens/SEDUROrganograma_g.png` (900×1274 px, 942 KB, sem texto alternativo). Título dentro da imagem: **"Anexo III — Organograma — Estrutura Organizacional — SEDUR"**, com base legal **Leis nº 9.186/2016 e Leis Complementares nº 076/2020 e nº 077/2021**.
- Níveis que aparecem: Gabinete do Secretário; colegiados (Conselho Municipal de Salvador, CONDURB, Conselho Gestor do Salvador Dados – CGSD); Fundação Mário Leal Ferreira (administração indireta); Assessoria de Urbanismo e Gestão; Subsecretaria; Ouvidoria; Coordenadoria de Tecnologia e Informações; 3 diretorias (Desenvolvimento Urbano, Licenciamentos, Fiscalização); Coordenadoria Administrativa; e abaixo delas gerências, coordenadorias, subcoordenadorias e dezenas de setores.
- Transcrevi a figura para texto em `../../preparacao-mock/dados/organograma.json` (a posição de cada caixa pode ter pequenos erros; [a confirmar]).

## Área de Atuação

Texto de abertura: "A SEDUR, criada em 1989, atua no licenciamento e fiscalização das seguintes áreas:" e depois 7 blocos, cada um com ícone (arquivos em `/images/areadeatuacao/`):

1. **Empreendimentos** — licenciamento e fiscalização de toda obra na cidade, da casa aos grandes complexos.
2. **Atividades Econômicas** — emissão e fiscalização do Termo de Viabilidade de Localização (TVL), um dos documentos para o alvará de funcionamento.
3. **Publicidade** — ordenamento da publicidade na paisagem; licenciamento (painéis, letreiros, outdoors, toldos, empenas, infláveis) e fiscalização (poluição visual, propaganda irregular).
4. **Eventos** — licenciamento de eventos, de festa de condomínio a grandes eventos; considera segurança, acessibilidade, impactos no entorno e licenciamento sonoro.
5. **Urbanismo** — alteração e atestado de denominação de logradouro, certidão de endereço e geolocalização dos imóveis.
6. **Ambiental** — licenciamento e fiscalização ambiental; autorização para empreendimentos em geral, erradicação e poda de árvores e posto de combustível.
7. **Desenvolvimento Urbano** — planejar, coordenar e executar a política de desenvolvimento econômico e urbano, parcerias com instituições e programa municipal de PPPs.

O texto integral está em `../../preparacao-mock/dados/institucional.json`.

## O que **não** existe hoje no Institucional (nem em outra parte do site)

Missão/valores, história, endereço e horário (só no rodapé, como imagem), telefones e e-mails do órgão, lista de conselhos com página própria (só o Conselho Municipal Salvador, dentro de "Projetos"), Ouvidoria própria (só o cargo "Ouvidor Setorial" na lista), agenda do secretário. [a confirmar com o Johnny o que ele considera necessário]
