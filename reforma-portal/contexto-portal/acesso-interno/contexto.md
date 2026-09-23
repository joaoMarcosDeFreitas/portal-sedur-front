# Acesso Interno — como é hoje

> Levantado em 21/09/2026, só leitura. **Sem login**: não usei, não recebi e não tentei nenhuma senha (regra do projeto). O que existe atrás da porta é **desconhecido**.

**Onde fica:** rodapé de **todas** as páginas do site institucional, no bloco "ACESSO RÁPIDO", como primeiro item: "Acesso Interno" → `https://sedur.salvador.ba.gov.br/acessoremoto/`.

## O que acontece ao clicar (visto por fora)

- O servidor responde **HTTP 401 (não autorizado)** com o cabeçalho `WWW-Authenticate: Basic realm="Entre com seu usuario e senha da Rede Sedur"`. Isso faz o navegador abrir a **janelinha padrão de usuário e senha** (a do próprio navegador, não uma tela do site), com a frase "Entre com seu usuario e senha da Rede Sedur" (sem acento em "usuário").
- Se a pessoa cancelar a janela, aparece uma página branca com a palavra **"Unauthorized"** (em inglês, 13 caracteres), sem logo, sem menu, sem link de volta.
- Os cabeçalhos da resposta mostram o programa **nginx** e um proxy (Envoy) na frente; enviam um cookie de sessão (`cookiesession1`) e obrigam HTTPS.
- Não existe tela de "esqueci a senha", nem explicação de para quem é.

## O que se sabe pelo contexto

- "Rede Sedur" sugere que o usuário e a senha são os da **rede interna** da SEDUR (os mesmos do computador), e não um cadastro à parte. [a confirmar]
- A página de bloqueio do firewall da Prefeitura (COGEL) mostra um botão "Portal de Acesso Remoto", o que combina com `/acessoremoto/`: pode ser um acesso remoto à rede/sistemas da SEDUR, não um "painel do site". [a confirmar]
- No `README.md` da raiz da pasta SEDUR-johnny está a hipótese antiga de que este acesso seria o login de quem edita o site (Joomla). Nada foi confirmado. O Joomla tem seu próprio login de administração, em outro endereço; **não tentei abri-lo**.

## Perguntas para o Johnny (a etapa depende dele)

1. Quem usa o Acesso Interno hoje (quais setores) e para quê? Qual sistema abre depois do login?
2. É a senha da rede (a mesma do computador) ou uma senha própria?
3. O que os funcionários fazem por lá que o cidadão faz em outro lugar (analisar processo, emitir alvará, fiscalização…)?
4. Existe um sistema interno que o portal novo deve substituir ou apenas ligar? (O endereço do Agendamento usa o caminho `/sas/`; se há relação com o Acesso Interno, [a confirmar].)
5. Prints da tela depois do login (sem dados pessoais) e a lista de funções que precisam existir para o funcionário.
