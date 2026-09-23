#!/usr/bin/env python3
import re, json, base64, html, glob, os
from bs4 import BeautifulSoup
os.chdir('/tmp/claude-0/-root-SEDUR-johnny-reforma-portal/781b0fab-d7fd-4f0d-9e67-40e5cca1f512/scratchpad')
OUT='/root/SEDUR-johnny/reforma-portal/preparacao-mock/dados/servicos-sistema.json'
def txt_lines(path):
    s=open(path,encoding='utf-8',errors='ignore').read()
    s=re.sub(r'(?is)<(script|style|svg|noscript)[^>]*>.*?</\1>','',s)
    s=re.sub(r'(?i)<br\s*/?>|</(p|div|li|h\d|tr|a|button|label|section|td|th)>','\n',s)
    s=re.sub(r'<[^>]+>',' ',s); s=html.unescape(s)
    return [re.sub(r'\s+',' ',l).strip() for l in s.split('\n') if l.strip()]
def miolo(path):
    L=txt_lines(path)
    try: i=max(k for k,l in enumerate(L) if l.startswith('Entre ou cadastre-se'))+1
    except ValueError: i=0
    try: j=next(k for k,l in enumerate(L) if l.startswith('Av. ACM'))
    except StopIteration: j=len(L)
    return L[i:j]
def campos(path):
    s=open(path,encoding='utf-8',errors='ignore').read(); soup=BeautifulSoup(s,'lxml'); out=[]
    for f in soup.find_all(['input','select','textarea','button']):
        t=f.get('type')
        if t in ('hidden','submit') and f.name=='input' and t=='hidden': continue
        lab=None
        if f.get('id'):
            l=soup.find('label',attrs={'for':f['id']}); lab=re.sub(r'\s+',' ',l.get_text()).strip() if l else None
        out.append({'tag':f.name,'tipo':t,'nome':f.get('name'),'rotulo':lab,'placeholder':f.get('placeholder'),'texto':re.sub(r'\s+',' ',f.get_text()).strip() if f.name=='button' else None})
    return [o for o in out if any(o.values())]
def iframes(path):
    s=open(path,encoding='utf-8',errors='ignore').read(); soup=BeautifulSoup(s,'lxml'); out=[]
    for a in soup.find_all('a',href=re.compile(r'/paginas/iframe/')):
        b=a['href'].split('/paginas/iframe/')[1]
        d=json.loads(base64.b64decode(b+'='*(-len(b)%4)).decode('utf-8'))
        out.append({'nome':re.sub(r'\s+',' ',a.get_text()).strip(),'url_no_portal':a['href'],'url_do_sistema_antigo':d.get('url_iframe'),'url_voltar':d.get('url_voltar'),'titulo_dado_ao_iframe':d.get('title')})
    return out
def norm(x): return re.sub(r'[^a-z]','',x.lower().encode('ascii','ignore').decode())
def achar(prefixo,nome):
    alvo=norm(nome)
    for f in glob.glob(f'raw2/{prefixo}_*.html'):
        b=os.path.basename(f)[len(prefixo)+1:-5]
        if norm(b)==alvo: return f
    # aproximação: mesmo início ignorando letras acentuadas perdidas
    for f in glob.glob(f'raw2/{prefixo}_*.html'):
        b=norm(os.path.basename(f)[len(prefixo)+1:-5])
        if b and (alvo.startswith(b[:12]) or b.startswith(alvo[:12])) and abs(len(b)-len(alvo))<=6: return f
    return None
def slug(n): return re.sub(r'[^a-z0-9]+','_',n.lower().replace('ç','c').replace('ã','a').replace('é','e').replace('í','i').replace('á','a').replace('ó','o').replace('ú','u').replace('ê','e').replace('â','a').replace('õ','o')).strip('_')
BASE='https://servicos.sedur.salvador.ba.gov.br'
# consultas
cons=[]
nat={'Auto de Infração':'auto-de-infracao','Atividades - Classificação de Risco das Atividades Econômicas':'classificacao-risco','Atividades Permitidas para Profissionais Autonômos':'atividades-permitidas-autonomos','Atividades Permitidas em Residências':'atividades-permitidas-residencias'}
fnat={'Auto de Infração':'consulta_auto_de_infracao','Atividades - Classificação de Risco das Atividades Econômicas':'consulta_classificacao_risco','Atividades Permitidas para Profissionais Autonômos':'consulta_atividades_autonomos','Atividades Permitidas em Residências':'consulta_atividades_residencias'}
ordem=['Alvará de Publicidade','Auto de Infração','Atividades para Escritórios Virtuais','Atividades - Classificação de Risco das Atividades Econômicas','Atividades Permitidas para Profissionais Autonômos','Atividades Permitidas em Residências','Renovação de Publicidade (DAM)','Solicitação de Serviços']
emb={x['nome']:x for x in iframes('raw2/consultas.html')}
for n in ordem:
    if n in nat: cons.append({'nome':n,'tecnologia':'página do próprio portal (Laravel/Livewire)','url':f'{BASE}/consultas/{nat[n]}','campos':campos(f'raw2/{fnat[n]}.html')})
    else:
        e=emb[n]; f=achar('consulta_interno',n)
        cons.append({'nome':n,'tecnologia':'página do sistema antigo dentro de janela (iframe) de 500 px','url':e['url_no_portal'],'url_do_sistema_antigo':e['url_do_sistema_antigo'],'url_voltar':e['url_voltar'],'titulo_dentro_da_janela':e['titulo_dado_ao_iframe'],'campos':campos(f) if f else None})
# transparência do portal
tr=[]
emb2={x['nome']:x for x in iframes('raw2/transparencia.html')}
for n in ['Ações Fiscais - COVID','Alvará de Obras em Vias e Logradouros Públicos','Alvarás de Construção por Mês','Alvarás de Habite-se Concedidos','Análise de Orientação Prévia (AOP) Emitidas','Estudo de Impacto de Vizinhança – EIV','Eventos Licenciados','Processos em Convite']:
    if n in emb2:
        e=emb2[n]; f=achar('transp_interno',n)
        tr.append({'nome':n,'tipo':'painel do sistema antigo dentro de janela (iframe)','url':e['url_no_portal'],'url_do_sistema_antigo':e['url_do_sistema_antigo'],'campos':campos(f) if f else None})
    else:
        tr.append({'nome':n,'tipo':'arquivo PDF','url':'http://servicos.sedur.salvador.ba.gov.br/anexos/acoesFiscais/AcoesFiscaisCovid _27.08.20.pdf','observacao':'o endereço tem um espaço no nome do arquivo'})
# canais
canais=json.load(open('canais.json',encoding='utf-8'))
blocos=['PORTAL DE SERVIÇOS','WHATSAPP','ATENDIMENTO PRESENCIAL','E-MAIL','DENÚNCIAS']
canais_txt={}
for i,b in enumerate(blocos):
    t=canais[str(i)] if str(i) in canais else ''
    lines=[l for l in t.split('\n')]
    # texto depois do título do bloco
    k=lines.index(b) if b in lines else -1
    resto=[l for l in lines[k+1:] if l not in blocos] if k>=0 else []
    canais_txt[b]=' '.join(resto).strip()
geo=miolo('raw2/geoservicos.html')
disp=miolo('raw2/servicos_dispensados.html')
iptu=miolo('raw2/iptu_verde.html'); carn=miolo('raw2/carnaval.html'); home=miolo('raw2/pagina_inicial.html')
sistema={'fonte':BASE,'coletado_em':'2026-09-18 (revisado em 2026-09-21)','observacao':'Copiado do portal público sem login. Textos como estão no portal (inclusive erros).',
 'titulo_da_aba_em_todas_as_paginas':'SEDUR - Portal de serviços da Prefeitura Municipal de Salvador',
 'menu_topo':['Início','Carta de Serviços','Canais de Atendimento','Entrar com (gov.br)'],
 'rodape':{'endereco':'Av. ACM, nº 3224, Caminho das Árvores - Salvador/BA. Edf.Empresarial Thomé de Souza / Térreo - CEP.: 41110-700','horarios':'Seg. a Sex. 09h às 16h','copyright':'©SEDUR | Todos os direitos reservados.'},
 'acessibilidade':{'barra':['Aumentar Texto','Diminuir Texto','Escala de Cinza','Alto Contraste','Contraste Negativo','Fundo Claro','Links Sublinhados','Fonte Legível','Reiniciar'],'vlibras':True},
 'pagina_inicial':{'url':BASE+'/','frase':'Abra seus processos com facilidade de onde você estiver.','busca':'O que você procura?','cards':[{'nome':'Agendamento Serviços','destino':'login gov.br (não abre o Agendamento)'},{'nome':'Catálogo Geoserviços','url':BASE+'/geoservicos'},{'nome':'Consultas','url':BASE+'/consultas'},{'nome':'Formulários','url':BASE+'/formularios'},{'nome':'Transparência','url':BASE+'/lei-transparencia'}],
   'banners_de_imagem':[{'nome':'O serviço de Autorização para Feira está digital','url':BASE+'/eventos/form.jsp?sys=CLE&formID=464570877','situacao':'em manutenção (Johnny, 21/09/2026)'},{'nome':'Salvador Ruas','url':'https://ruas.salvador.ba.gov.br'},{'nome':'Consulta Prévia Salvador','url':'https://consultaprevia.sedur.salvador.ba.gov.br'},{'nome':'Revisão do PDDU','url':'https://pddu.salvador.ba.gov.br/'}],
   'carrossel_fique_por_dentro':[{'descricao_da_imagem':'Imagem destaque','url':'https://citypro.net.br/'},{'descricao_da_imagem':'Imagem 1','url':'https://www.ba.gov.br/juceb/servicos/','observacao':'a página responde 404'},{'descricao_da_imagem':'Imagem 2','url':'PDF em /storage/portal-servicos/fique-por-dentro/'},{'descricao_da_imagem':'Imagem 3','url':'PDF em /storage/portal-servicos/fique-por-dentro/'},{'descricao_da_imagem':'Imagem 4','url':'PDF em /storage/portal-servicos/fique-por-dentro/'}],'texto_lido':home},
 'carta_de_servicos':{'url':BASE+'/carta-servicos','grupos':['Serviços Dispensados de Licenças','Ambiental','Auxiliares','Carnaval','Desenvolvimento Econômico','Empreendimento','Eventos','Festas Populares','Obras Especiais','Parcelamento do Solo','Publicidade','Telecomunicações','Urbanismo','Viabilidade de Localização'],'dados':'ver servicos.json'},
 'servicos_dispensados_de_licenca':{'url':BASE+'/carta-servicos/servicos-dispensados-licenca','texto_lido':disp},
 'consultas':cons,'formularios':{'url':BASE+'/formularios','dados':'ver formularios.json (53 títulos únicos; a tela mostra 55 linhas)'},
 'geoservicos':{'url':BASE+'/geoservicos','texto_lido':geo},
 'transparencia_do_portal':{'url':BASE+'/lei-transparencia','itens':tr},
 'fiscalizacao_carnaval_2026':{'url':BASE+'/transparencia/carnaval','sem_link_visivel':True,'texto_lido':carn},
 'iptu_verde':{'url':BASE+'/paginas/iptu-verde','sem_link_visivel':True,'texto_lido':iptu},
 'canais_de_atendimento':{'url':BASE+'/contato','blocos':canais_txt},
 'paginas_de_erro':{'404':'“Not Found”, em inglês, sem menu, sem rodapé e sem logo','500':'“Server Error”, em inglês','/instabilidade':'responde 500'},
 'login':{'gov.br':'sso.salvador.ba.gov.br (client SedurMais-PortalServicos-Prd)','tela_demo_aberta':'/govbr abre sem login uma tela de demonstração; ver contexto-portal/servicos/login-govbr/'},
 'sistemas_parceiros':[{'nome':'Agendamento (Agendamento Sedur)','url':'https://agendamento.sedur.salvador.ba.gov.br/sas/#agendamento'},{'nome':'Consulta Prévia','url':'https://consultaprevia.sedur.salvador.ba.gov.br'},{'nome':'Salvador Ruas','url':'https://ruas.salvador.ba.gov.br'},{'nome':'Revisão do PDDU','url':'https://pddu.salvador.ba.gov.br/'},{'nome':'Mapeamento Salvador (GIS)','url':'https://mapeamento.salvador.ba.gov.br'}]}
json.dump(sistema,open(OUT,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('ok',os.path.getsize(OUT)//1024,'KB')
for c in cons: print(c['nome'],'| campos:',None if c['campos'] is None else len(c['campos']))
for t in tr: print(t['nome'],'| campos:',None if t.get('campos') is None else len(t['campos']))
print(canais_txt.keys(), {k:v[:50] for k,v in canais_txt.items()})
