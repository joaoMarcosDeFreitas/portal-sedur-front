# Passo a passo: testar o portal no computador (Vivaldi) e no celular

Faça cada passo no **computador e no celular**. Onde for só de um, está indicado. Em cada item, o texto em itálico diz o que **deve acontecer**.

## 0. Antes de começar
1. Abra o endereço da Vercel no **Vivaldi** e, no celular, no navegador que você usa (Chrome ou Safari).
2. Para começar do zero, apague os dados do site.
   - **Computador:** `F12` → aba *Application* → *Clear site data*.
   - **Celular:** Configurações do navegador → *Privacidade* → apagar dados do site.
   - Isso limpa solicitações, agendamentos, login e as preferências de acessibilidade.
3. **Dica de celular:** teste também na **horizontal** e com o **texto do sistema grande**.

## 1. Home
1. Abra `/`. *Aparece "Um só portal para os serviços de urbanismo de Salvador".*
2. Role a página inteira. *Devem aparecer **Acessos rápidos** (8 ícones), **Categorias de serviço** (13 ícones), **Nossos Projetos** (8: 6 com a ilustração do site atual) e **Notícias** (3 cartões). A página não pode rolar para os lados.*
3. Toque nos ícones. *Nenhum texto quebra no meio da palavra (confira "Desenvolvimento" e "Telecomunicações").*
4. **Computador:** a sidebar fica sempre à esquerda. **Celular:** no topo há o menu (☰), "Entrar" e a busca, que fica numa linha própria.

## 2. Menu e busca
1. **Computador:** clique em cada item da sidebar (Serviços, Consultas, Legislação, Notícias, Licitações, Transparência, Nossos Projetos, Institucional, Formulários). *Cada um abre a sua página, com o item destacado.*
2. **Celular:** toque no ☰. *O menu abre pela lateral; toque fora, ou no item, para fechar.*
3. Busca: digite `reforma`. *Aparece uma lista com serviços.*
   - **Computador:** use as setas ↑ ↓, `Enter` para abrir e `Esc` para fechar.
   - Digite também `carnaval`, `iptu verde` e `agendamento`.
   - Digite `xyzabc`. *Nenhuma lista aparece.*

## 3. Tema e acessibilidade
1. Clique em **Tema escuro**. *A página escurece, a logo troca de versão e a escolha fica salva ao recarregar.*
2. Clique em **Aumentar texto**. *O texto cresce e o botão vira "Texto normal". Vale nas outras páginas.*
3. Clique em **Acessibilidade** e teste cada opção (uma de cada vez):
   - **Diminuir texto:** o texto encolhe.
   - **Escala de cinza:** tudo fica em tons de cinza.
   - **Alto contraste:** fundo preto, texto branco e destaques em amarelo, com bordas brancas.
   - **Links sublinhados:** todos os links ficam sublinhados.
   - **Fonte legível:** muda o tipo de letra.
   - **Reiniciar:** volta tudo ao normal (o tema claro/escuro não muda).
4. Feche o painel com `Esc` (computador) ou tocando fora. Recarregue a página. *As opções ligadas continuam ligadas.*
5. **VLibras:** deve haver um botão azul com mãos no canto direito. Clique nele. *Abre o tradutor de Libras. Se demorar, pode ser a rede.*
6. Com **Alto contraste** ligado, passe por Serviços, Consultas e Agendamento. *Nada pode ficar ilegível (texto escuro sobre fundo escuro).*

## 4. Serviços e fichas
1. Abra **Serviços**. *São 13 categorias; entre em uma.*
2. Abra **Ambiental → Alteração de Razão Social**. *A ficha tem uma página só, com Sobre o serviço, Documentos, Taxas e Prazo. Deve haver um botão **Emissão de DAM** (e nenhum "Abrir processo"), com a frase explicando o que é DAM.*
3. Na seção de documentos, procure **Baixar modelo · PDF**. *Abre o PDF numa nova aba. Esse arquivo vem do site antigo, então pode demorar.*
4. **Ambiental → Autorização de Poda.** *Só o botão **Abrir processo**.*
5. **Empreendimento → AOP de Parâmetros Urbanísticos.** *Os dois botões.*
6. **Auxiliares → Defesa de Auto de Infração.** *Nenhum botão, só um aviso com o link "canais de atendimento".*
7. **Empreendimento → Habite-se.** *No documento "Planta de Geolocalização", o link "Ver o serviço" abre o serviço de Geolocalização do Imóvel.*
8. **Serviços dispensados de licença** (em "Mais recursos", na página Serviços). *Abre a lista.*

## 5. Área do cidadão (o fluxo principal)
**Emissão de DAM**
1. Na ficha de **Alteração de Razão Social**, clique em **Emissão de DAM**. *Vai para a tela de login de demonstração.*
2. Escolha **Construtora Exemplo Ltda.** *Volta para a emissão de DAM.*
3. *Aparecem as taxas: R$ 701,39 e R$ 24,21, com **valor do DAM de R$ 725,60**.* Clique em **Emitir DAM**.
4. *Abre o acompanhamento com "Aguardando pagamento" e o código do DAM.* Clique em **Pagar com PIX**.
5. *Vira **"Pago"**, com "Comprovante disponível". Não pode aparecer "Análise técnica" nem botão de concluir.*

**Abrir processo**
1. Na ficha de **Autorização de Poda**, clique em **Abrir processo**.
2. Clique em **Abrir processo** sem preencher. *Aparecem 3 avisos de campo obrigatório.*
3. Preencha o endereço e o bairro, clique em **Anexar** num documento e marque a declaração. Envie.
4. *O protocolo começa com `SEDUR-`, o status é "Em análise" e **não há DAM**.* Clique em **Simular conclusão**. *Vira "Concluída".*

**Lista e sessão**
1. Abra **Minhas solicitações** (aparece na sidebar depois do login). *Aparecem as duas, cada uma com o seu tipo e situação.*
2. Recarregue a página. *Continuam lá.*
3. Clique no seu nome no topo → **Sair**. Tente abrir Minhas solicitações. *Volta para o login.*

## 6. Consultas
1. Abra **Consultas**. *São 8.*
2. **Renovação de Publicidade (DAM):** digite o CGA `90147` → **Consultar**. *Aparece 1 linha.*
   - Clique em **Detalhes**. *Abre a ficha do DAM.* Clique em **Voltar** (no topo). *A lista volta com o CGA preenchido.*
   - Digite `9014`. *Aparece "Não foi encontrado DAM em aberto para o CGA informado!".*
   - Outros CGAs válidos: `69584`, `68802`, `49091`, `92660`.
3. **Auto de Infração:** digite `091135`. *Aparece o auto (Regularizado). A ficha tem linha do tempo.* Outro número: `003051` (Multa aplicada).
4. **Solicitação de Serviços:** Origem `SEDUR`, Ano `2026`, Número `29505` (Com pendência).
5. **Alvará de Publicidade:** digite `2022-0169`.
6. **Classificação de Risco:** *Mostra "1.332 resultados", 20 por página. Filtre por "extração de sal", abra os detalhes e veja os 4 níveis de risco e as condições.*
7. As outras três consultas (Escritórios Virtuais, Autônomos e Residências). *Mostram listas com filtro.*
8. *Nas consultas simuladas deve haver um aviso de que os dados são de demonstração.*

## 7. Transparência
1. Abra **Transparência**. *Aparecem 11 ícones.*
2. Entre em **Alvará de Obras em Vias e Logradouros**. *Há campos de processo, CEP, logradouro, bairro e períodos de datas.* Preencha o período de Deferimento de 01/01/2025 a 31/12/2025 → **Consultar**. *A lista diminui e só mostra 2025.*
3. **Processos em Convite.** *Escolha um grupo (ex.: AMBIENTAL) → só aparecem processos desse grupo.*
4. **Fiscalização Carnaval 2026.** *Só "Publicidade em Blocos" abre; os outros 3 mostram "Em construção".* Filtre por circuito (Batatinha, Dodô, Osmar) e abra os detalhes.
5. **Audiências públicas** e **EIV/RIV.** *Mostram documentos para baixar.*

## 8. Legislação, notícias, licitações e formulários
1. **Legislação.** *São 14 tipos.* Entre em **CNLU**. *Aparecem "Comunicados" e "Resoluções".* Abra "Comunicados". Em **Decretos**, busque `coleta de óleos`. *Aparece o Decreto 41.818/2026.*
2. **Notícias.** Busque `PDDU`. Abra uma notícia recente. Abra uma bem antiga. *Nas antigas aparece "ainda não foi migrado".*
3. **Licitações.** Clique em "Pregão". *Filtra.* Confira que não há palavras partidas nos textos (ex.: "C ontratação").
4. **Formulários.** *Mostra "53 formulários".* Busque `iptu verde`. *Aparecem 3.*

## 9. Institucional
1. Abra **Institucional**. *São 4 ícones; "Nossos Projetos" leva para a página de projetos.*
2. **Nossos Projetos** (pela barra lateral ou pela home). *São 8.* Abra **IPTU Verde**. *Tem seções claras e 3 formulários para baixar, e nenhum percentual de desconto.* Abra **Revisão do PDDU**.
   - **Revitalizar:** *tabela com os 13 bairros, os 7 passos, o mapa da poligonal; dois links que não existem mais aparecem só como texto ("link indisponível no portal atual").*
   - **Plano de Incentivos Fiscais:** *leis e decretos em PDF (nova aba) e "Adesão ao Plano de Incentivos Fiscais" abre a ficha do serviço aqui.*
   - **Eu Curto Meu Passeio:** *só o banner, que abre o PDF do programa.* **TUL:** *lista, capa do manual e link para a carta de serviços.*
   - O endereço antigo `/institucional/projetos` redireciona para `/projetos`.
3. **Áreas de atuação** (7), **Dirigentes** (20 cargos) e **Estrutura organizacional** (árvore).

## 10. Agendamento
1. Abra **Agendamento de atendimento** (pelo ícone na home).
2. Clique em **Confirmar agendamento** sem preencher. *Aparecem 3 avisos.*
3. Escolha o assunto, um dia útil e um horário. *Os horários vão de 09:00 a 15:30, e alguns aparecem indisponíveis.* Digite o nome e confirme.
4. *Aparece "Agendamento confirmado" com o protocolo `AGD-…` e o item em "Meus agendamentos".* Recarregue: *continua lá, e o horário marcado aparece indisponível.*
5. Clique em **Cancelar**. *Fica "Cancelado" e o horário volta a ficar livre.*

## 11. Canais, geoserviços e sistemas parceiros
1. **Canais de atendimento.** *WhatsApp, e-mail, atendimento presencial e denúncias.* Em "Agendar atendimento", *abre o agendamento do portal.*
2. **Geoserviços.** *Lista as camadas.*
3. **Sistemas parceiros.** *Consulta Prévia, Revisão do PDDU, Mapeamento, Autorização para Feira e Salvador Ruas. Os dois últimos aparecem "Em manutenção".* Um clique num deles avisa que você vai sair do portal.

## 12. Páginas de erro
1. Digite na barra do navegador `/pagina-que-nao-existe`, `/noticias/999999` e `/consultas/nao-existe`. *Cada uma mostra "Não encontramos essa página", com botões para a home e para os serviços.*

## 13. Só no computador: teclado
1. Recarregue e aperte `Tab` uma vez. *Aparece "Pular para o conteúdo"; `Enter` leva ao conteúdo.*
2. Continue apertando `Tab`. *Todo botão e link mostra um contorno visível ao receber o foco.*
3. Abra a busca e use as setas. *(Já testado no passo 2.)*

## 14. Só no celular
1. Gire a tela (vertical e horizontal). *Nada pode cortar nem gerar rolagem para o lado.*
2. Aumente o zoom do navegador ou o texto do sistema. *A página continua usável.*
3. Toque em todos os botões e links. *Devem ser fáceis de acertar.*
4. Abra a **tabela de consultas** (ex.: Classificação de Risco). *Ela rola dentro da tela, mas a página não.*
5. No **Agendamento**, confira que os horários ficam fáceis de tocar.

## 15. Botão Voltar
1. Em qualquer página, menos na inicial, há **← Voltar** no topo do conteúdo (acima da trilha e do título).
2. Navegue Home → Serviços → Ambiental → uma ficha e clique em **Voltar** várias vezes. *Volta por onde você passou, até a home; na home o botão não aparece.*
3. Cole direto o endereço de uma ficha e clique em **Voltar**. *Sobe um nível (categoria → serviços → home).*
4. Numa ficha de consulta aberta pelo link direto, **Voltar** reabre a lista com os filtros.
5. **Computador:** funciona com `Tab` + `Enter`.

## 16. Como anotar o que achar
Para cada problema, anote:
- **Onde:** o endereço da página.
- **O que aconteceu** e o que você esperava.
- **Dispositivo e navegador**, e se estava no tema claro ou escuro.
- **Um print**, se puder.
- Se **bloqueia a apresentação** ou é só um detalhe.

Me mande essa lista quando terminar e eu corrijo.
