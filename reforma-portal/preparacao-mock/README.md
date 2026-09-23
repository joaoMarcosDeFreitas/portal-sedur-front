# Preparação para o sistema de teste (mock)

> Criado em 21/09/2026. **Não é design nem protótipo** (isso é a fase 3, e o Johnny disse que só começa quando as fases 1 e 2 terminarem). Esta pasta guarda **todo o conteúdo e a estrutura do portal de hoje, em forma de dados**, para que, quando o sistema de teste (mock) for criado, ele possa ser montado lendo estes arquivos, sem voltar ao portal e sem depender da memória de uma conversa.

## O que é o "mock" e por que esta pasta existe

O Johnny vai precisar de um **sistema de teste** que se pareça com o portal futuro (um só sistema, com o site original como casa, design e experiência melhores). Um sistema de teste só fica convincente se usar **conteúdo real** (os 151 serviços de verdade, as leis de verdade, as notícias de verdade). Por isso, tudo o que existe hoje foi copiado do portal público (só leitura, sem login) para cá, **como está**, inclusive os erros (para o sistema novo poder corrigi-los de propósito).

## O que tem aqui

```
preparacao-mock/
  README.md              ← este arquivo (o que existe, o que falta, como refazer)
  modelo-de-dados.md     ← as "coisas" do portal (serviço, notícia, lei…) e os campos de cada uma
  dados/                 ← o conteúdo em JSON (formato de dados que qualquer sistema lê)
  coleta-bruta/          ← cópia das páginas HTML como estavam em 18–21/09/2026 (o "antes")
  scripts/               ← os programas usados para coletar (para refazer, se precisar)
```

### `dados/` — o que já está pronto

| Arquivo | O que contém | Quantidade | De onde veio | Completo? |
|---|---|---|---|---|
| `servicos.json` | Carta de Serviços: 13 categorias e 151 serviços, cada um com as 6 abas (descrição, documentação exigida, informações, taxas, prazo, local e horário) e os links dentro das abas | 151 | Portal de Serviços | **Sim** (só falta o que está atrás do login) |
| `servicos-sistema.json` | Todo o resto do Portal de Serviços: menu, rodapé, página inicial (cards, banners, carrossel), 8 consultas (com os campos), transparência (7 painéis + 1 PDF), geoserviços, serviços dispensados de licença, IPTU Verde, Fiscalização Carnaval, canais de atendimento, acessibilidade, páginas de erro, sistemas parceiros | — | Portal de Serviços | **Sim**, exceto o **resultado** das consultas/painéis (exigiria digitar dados) |
| `formularios.json` | Os 53 formulários em PDF (título e endereço do arquivo) | 53 | Portal de Serviços | Sim |
| `legislacao.json` | 14 blocos e 20 listas de documentos (data, número, descrição, endereço do PDF, problemas, situação do link) | 1.079 | Site | Sim (os PDFs em si **não** foram baixados) |
| `licitacoes.json` | Tabela de licitações (data original e corrigida, título, descrição, arquivo, problemas) | 57 | Site | Sim |
| `noticias.json` | Índice de todas as notícias (título, data, miniatura) e o texto completo das mais novas | 804 (192 com texto) | Site | **Parcial**: o texto das 612 mais antigas não foi baixado (ver "O que falta") |
| `transparencia-site.json` | As 2 telas de Transparência do site e os 24 arquivos do processo EIV | 2 + 24 | Site | Sim |
| `projetos.json` | As 6 páginas de "Nossos Projetos" (texto completo, links, imagens) | 6 | Site | Sim |
| `institucional.json` | Texto de "Área de Atuação" | 7 áreas | Site | Sim |
| `dirigentes.json` | 20 cargos com nomes (como aparecem na página) | 20 | Site | Sim (a página pode estar desatualizada) |
| `verificacao-de-links.json` | Resultado da conferência de **1.153 links** de arquivos (código de resposta, tipo, tamanho): 1.145 respondem, 6 dão 404, 1 tem servidor inexistente e 1 é redirecionado; **11 PDFs respondem “ok” mas estão vazios (0 bytes)** | 1.153 | Site e Portal | Sim (21/09/2026) |
| `organograma.json` | Estrutura organizacional transcrita da figura oficial (Anexo III) | — | Site (imagem) | Sim, **transcrição de Claude**, conferir |

As páginas HTML originais estão em `coleta-bruta/` (`portal-servicos/`, `site-institucional/` e `sistemas-parceiros/`), caso seja preciso conferir como o portal era. **De propósito, não guardei a tela de demonstração `/govbr`** (ela mostra nomes e CPFs parciais de pessoas; ver o alerta em `../contexto-portal/servicos/login-govbr/explicacao.md`), e apaguei o valor do cookie na resposta do Acesso Interno.

## O que falta para ficar "100%"

Ficou de fora por depender de coisas que eu não vejo, ou por estarem fora do ar. Cada item tem dono:

| Falta | Por quê | Quem resolve |
|---|---|---|
| **Fluxo por trás do login gov.br**: emitir DAM, pagamento (DAM/PIX), abrir processo, acompanhar processo, "Agendamento Serviços", termos e documentos emitidos | Área logada; o Johnny informou que **o sistema caiu** e enviará prints depois. Regra: nunca usar nem receber login. | Johnny (prints) |
| **Autorização para Feira** (formulário CLE) | Em manutenção (informado em 21/09/2026); ignorar até voltar | Johnny |
| **Acesso Interno** (`/acessoremoto/`) | Pede usuário e senha da rede; o que existe depois é desconhecido | Johnny (ver perguntas em `../contexto-portal/acesso-interno/contexto.md`) |
| **Texto das 612 notícias mais antigas** (2014 a ago/2020) | Só baixei o índice delas e o texto das 192 mais novas; baixar o resto leva ~35 min. Rodar `scripts/crawl_artigos.py` | Claude, sob pedido |
| ~~Verificação dos links de PDF~~ | **Feita em 21/09/2026** (ver `dados/verificacao-de-links.json` e o campo `problemas` de cada item). Resultado: 29 documentos da Legislação e 3 linhas de Licitações não abrem. | — |
| **Os PDFs em si** (1.079 de legislação, 55 de licitações, 53 formulários…) | Não foram baixados. O sistema de teste pode apontar para o endereço atual no site. | — |
| **Resultado das consultas e painéis** | Exigiria digitar dados reais nos formulários | Johnny decide se vale |
| **Sistemas à parte**: Agendamento, Consulta Prévia, Salvador Ruas, Revisão do PDDU, Mapeamento (GIS) | Só olhei a página de entrada de cada um (ver `../contexto-portal/servicos/sistemas-parceiros/contexto.md`). **Salvador Ruas está em manutenção** (21/09/2026); a Consulta Prévia só monta a tela no navegador (não vi o conteúdo). O Agendamento tem a tela real numa janela de plataforma antiga. | Claude/Johnny, conforme a decisão de incorporar ou só ligar |
| **Telas de mapa** (Geoserviços/Cartografia) | O mapa é de outro sistema da Prefeitura | — |
| **Imagens do site** (banners, miniaturas, ícones) | Só os endereços estão nos dados | — |

## Regras para quem for usar isto

1. **Não inventar dado.** O que está aqui foi copiado do portal ou marcado como `[a confirmar]`. Se o sistema de teste precisar de dado que não existe (ex.: foto dos dirigentes), usar um marcador visível de "exemplo".
2. **Manter os erros nos dados**: os JSON têm campos `problemas` e observações. O sistema de teste pode mostrá-los como "antes e depois" ou limpá-los na hora de importar (decisão da fase 3).
3. Nenhum dado pessoal de cidadão está aqui (só o que o portal publica: nomes de dirigentes, dados de processos de licenciamento já públicos, como a Colina Imperial).
4. O portal muda. Cada arquivo diz a data em que foi coletado; antes de usar em algo importante, conferir se a fonte mudou.

## Como refazer a coleta

- Pasta `scripts/`. **Regras da coleta**: só leitura; **um pedido por vez**, com pausa de 2 segundos; `nice -n 19 ionice -c3`; parar se aparecer "Acesso Bloqueado" (o firewall da Prefeitura, COGEL). **Não usar o Chrome automático** contra o site (um teste em 21/09/2026 foi bloqueado). Os scripts foram escritos para uma pasta temporária da sessão (`scratchpad`): ajustar os caminhos ao usar.
- Ordem: `crawl_noticias.sh` (lista das notícias) → `crawl_artigos.py` (texto) → `checar_links.py` → `gerar_dados_site.py`, `gerar_noticias.py`, `gerar_servicos_sistema.py` (montam os JSON).
- Refazer a coleta da Carta de Serviços (151 fichas com as 6 abas) leva ~25 minutos a 1 pedido por segundo; os scripts dessa parte estavam na pasta temporária da sessão de 18/09 e **não foram guardados** (os dados sim, em `dados/servicos.json` e `coleta-bruta/portal-servicos/`).
