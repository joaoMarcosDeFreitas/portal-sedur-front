# Sistemas parceiros (à parte do Portal de Serviços) — como são hoje

> Olhada só na **página de entrada** de cada um, em 21/09/2026, só leitura, sem clicar em nada que envie dados. Não é análise completa: o objetivo é saber **o que cada um é**, para decidir depois se entra no sistema único ou só é ligado com aviso. O que está ruim fica em `explicacao.md`.

| Sistema | Endereço | O que é | Situação em 21/09/2026 |
|---|---|---|---|
| **Agendamento Sedur** | `agendamento.sedur.salvador.ba.gov.br/sas/` | Marcar atendimento presencial na SEDUR. Página feita sobre um modelo pronto (scripts de 2013), com o formulário de agendamento real dentro de uma **janela de 530 px** (`…/form.jsp?sys=SAS&formID=464569656…`), de uma plataforma Java antiga de formulários. | No ar. Título da aba “Agendamento Sedur”; título da página “Agendamento de Serviços”; diz “Nosso horário de agendamento é entre 9:00h às 15:30h”. |
| **Revisão do PDDU** | `pddu.salvador.ba.gov.br` | Site próprio sobre a revisão do Plano Diretor: menu “O que é · Etapas · Processo participativo · Notícias · Arquivos · Participe, Ssa! · Ouvidoria · Conecta PDDU”; seções “O que é o Plano Diretor?”, “O que é a LOUOS?”, “Por que revisar?”, “Linha do tempo” e inscrição em oficinas. | No ar, completo (~31 KB). Tem notícias e ouvidoria **próprias**, separadas das do site da SEDUR. |
| **Consulta Prévia Salvador** | `consultaprevia.sedur.salvador.ba.gov.br` | Consultar a legislação urbanística de um endereço (pelo README do projeto). Página de 80 KB que **só monta a tela no navegador** (o servidor entrega só o título “Consulta Prévia - Salvador \| SEDUR”). | Não consegui ver o conteúdo por fora. [a confirmar no navegador] |
| **Salvador Ruas** | `ruas.salvador.ba.gov.br` | Histórico de Reconhecimento de Logradouros. | **Em manutenção**: mostra só “Site em manutenção — O sistema de Histórico de Reconhecimento de Logradouros está temporariamente indisponível para manutenção.” e 3 links (Início, Carta de Serviços, Canais de Atendimento). |
| **Autorização para Feira (CLE)** | `servicos.sedur…/eventos/form.jsp?sys=CLE&formID=…` | Pedido digital de autorização para feiras e congressos, na **mesma plataforma de formulários** do Agendamento (`form.jsp`). | **Em manutenção** (informado pelo Johnny). Ignorar por enquanto. |
| **Mapeamento Salvador (GIS)** | `mapeamento.salvador.ba.gov.br` | Visualizador de mapa da Prefeitura; usado pelos Geoserviços. | Não visitado. |

Todos os endereços e nomes estão também em `../../../preparacao-mock/dados/servicos-sistema.json` (`sistemas_parceiros`).
