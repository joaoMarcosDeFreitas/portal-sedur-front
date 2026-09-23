#!/usr/bin/env python3
"""Gera os JSON do site institucional para o sistema de teste (preparacao-mock/dados/).
Entrada: HTMLs baixados (leg/, pages/, proj/, transp/) + linkcheck_site.json (opcional)."""
import json, re, os, glob
from datetime import datetime
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from tabelas import linhas, dt
from secao import analisa
OUT='/root/SEDUR-johnny/reforma-portal/preparacao-mock/dados'
BASE='https://sedur.salvador.ba.gov.br'
lc=json.load(open('linkcheck_site.json',encoding='utf-8')) if os.path.exists('linkcheck_site.json') else {}
ld=json.load(open('linkcheck_site_detalhe.json',encoding='utf-8')) if os.path.exists('linkcheck_site_detalhe.json') else {}
def absu(h):
    if not h: return None
    if h.startswith('http'): return h
    return BASE+(h if h.startswith('/') else '/'+h)
def status(u):
    return lc.get(u)  # None = não verificado
def item(l, data_fmt=True):
    c=l['celulas']; h=[x for x in l['links']]
    href=h[0][0] if h else None
    flags=[]
    if h and not href: flags.append('link_sem_destino')
    if href and urlparse(href).netloc not in ('','sedur.salvador.ba.gov.br'): flags.append('endereco_invalido')
    if not h: flags.append('sem_link')
    u=absu(href)
    dd=ld.get(u) if u else None
    if dd:
        if dd['codigo']==404: flags.append('arquivo_nao_encontrado_404')
        elif dd['codigo']==200 and dd['bytes']==0: flags.append('arquivo_vazio_0_bytes')
    return {'arquivo_bytes':(dd or {}).get('bytes'),'data':c[0] if c else '','numero':c[1] if len(c)>1 else '','descricao':c[2] if len(c)>2 else '','arquivo':u,'arquivo_status_http':status(u) if u else None,'problemas':flags}
# ---------------- legislação
SECOES=[('cnlu','CNLU','/cnlu',['sub_797-comunicados','sub_798-resolucoes']),
 ('covid-19','Covid-19','/covid-19',None),('decretos','Decretos','/decretos',None),
 ('denominacao-de-logradouros','Denominação de Logradouros','/denominacao-de-logradouros',None),
 ('desapropriacao','Desapropriação','/desapropriacao',['sub_92-desapropriacao-municipal','sub_91-desapropriacao-estadual']),
 ('editais','Editais','/editais',None),('instrucoes-normativas','Instruções Normativas','/instrucoes-normativas',None),
 ('leis','Leis','/leis',None),('louos-2016','Louos 2016','/louos-2016',['sub_62-louos','sub_63-louos-mapas','sub_64-louos-quadros']),
 ('bens-tombados','Bens Tombados','/bens-tombados',None),('pddu-2016','PDDU 2016','/pddu-2016',['sub_65-leis-pddu','sub_66-mapas-pddu']),
 ('plano-salvador-500','Plano Salvador 500','/plano-salvador-500',None),('portarias','Portarias','/portarias',None),
 ('taxas-multas','Taxas/Multas','/taxas-multas',['sub_67-tabela-de-taxas','sub_93-tabela-de-multas'])]
SUBURL={'sub_797-comunicados':'/cnlu/18-legislacao/797-comunicados','sub_798-resolucoes':'/cnlu/18-legislacao/798-resolucoes','sub_92-desapropriacao-municipal':'/desapropriacao/18-legislacao/92-desapropriacao-municipal','sub_91-desapropriacao-estadual':'/desapropriacao/18-legislacao/91-desapropriacao-estadual','sub_62-louos':'/louos-2016/18-legislacao/62-louos','sub_63-louos-mapas':'/louos-2016/18-legislacao/63-louos-mapas','sub_64-louos-quadros':'/louos-2016/18-legislacao/64-louos-quadros','sub_65-leis-pddu':'/pddu-2016/18-legislacao/65-leis-pddu','sub_66-mapas-pddu':'/pddu-2016/18-legislacao/66-mapas-pddu','sub_67-tabela-de-taxas':'/taxas-multas/18-legislacao/67-tabela-de-taxas','sub_93-tabela-de-multas':'/taxas-multas/18-legislacao/93-tabela-de-multas'}
def tabela(arq):
    r=linhas(arq); its=[]; brancas=0
    for l in r['linhas']:
        if not any(x.strip() for x in l['celulas']): brancas+=1; continue
        its.append(item(l))
    return r['titulo'], its, brancas
leg={'fonte':BASE+'/legislacao','coletado_em':'2026-09-21','colunas_da_tabela_original':['Data','Nº Legislação','Descrição','Arquivo'],'secoes':[]}
total=0
for sid,nome,url,subs in SECOES:
    s={'id':sid,'nome':nome,'url':BASE+url}
    if subs:
        s['subsecoes']=[]
        for sub in subs:
            t,its,br=tabela(f'leg/{sub}.html'); total+=len(its)
            s['subsecoes'].append({'id':sub,'nome':t,'url':BASE+SUBURL[sub],'linhas_em_branco_na_tabela':br,'itens':its})
    else:
        t,its,br=tabela(f'leg/{sid}.html'); total+=len(its)
        s['linhas_em_branco_na_tabela']=br; s['itens']=its
    leg['secoes'].append(s)
leg['total_itens']=total
json.dump(leg,open(f'{OUT}/legislacao.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('legislação:',total,'itens')
# ---------------- licitações
def data_iso(x):
    x=x.strip()
    for f in ('%d/%m/%Y','%d/%m/%y'):
        try: return datetime.strptime(x,f).date().isoformat(), (f=='%d/%m/%y')
        except: pass
    m=re.match(r'^(\d\d)/(\d\d)(\d{4})$',x)
    if m: return f'{m.group(3)}-{m.group(2)}-{m.group(1)}', True
    return None, True
r=linhas('pages/licitacoes.html'); lic=[]
for l in r['linhas']:
    c=l['celulas']; it=item(l); it['titulo']=c[1] if len(c)>1 else ''; it['descricao']=c[2] if len(c)>2 else ''
    iso,corr=data_iso(c[0]); it['data_original']=c[0]; it['data']=iso
    if corr: it['problemas'].append('data_fora_do_padrao')
    it.pop('numero',None); lic.append(it)
json.dump({'fonte':BASE+'/licitacoes','coletado_em':'2026-09-21','observacao':'Tabela sem cabeçalho no portal. Colunas na ordem: data, título, descrição, arquivo. Uma única página, sem paginação. A ordem é a do portal (não é rigorosamente cronológica).','total':len(lic),'itens':lic},open(f'{OUT}/licitacoes.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('licitações:',len(lic))
# ---------------- transparência do site
aud=linhas('transp/audiencias.html'); it=[item(l) for l in aud['linhas']]
soup=BeautifulSoup(open('transp/eiv60.html',encoding='utf-8').read(),'lxml'); box=soup.find('div',class_='no-home')
arqs=[{'nome':re.sub(r'\s+',' ',a.get_text()).strip(),'arquivo':absu(a.get('href')),'arquivo_status_http':status(absu(a.get('href')))} for a in box.find_all('a') if a.get('href') and not a['href'].lower().startswith('javascript')]
tr={'fonte':BASE+'/transparencia','coletado_em':'2026-09-21','itens_do_menu':[
 {'nome':'Audiências Públicas','url':BASE+'/transparencia/19-transpar/788-audienciapublicas','colunas':['Data','Modalidade / Número','Descrição','Arquivo'],'itens':it},
 {'nome':'Impacto Vizinhança - EIV/RIV','url':BASE+'/transparencia/19-transpar/59-transparencia-sedur-processos','observacao':'Lista por ano. Em 2021 há 1 processo; cada processo abre uma página com os arquivos.','processos':[{'ano':2021,'texto_do_link':'Processo: 5911000000-34928/2019 (Licenciamento Ambiental) Nome do empreendimento: Colina Imperial Localização: Rua Professor Plínio Garcez de Sena, Mussurunga, Salvador-BA Empreendedor: MRV Engenharia e Participações S/A','url':BASE+'/pagina/60-transparencia-sedur-arquivos-do-processo-5911000000-34928-2019','titulo_da_pagina':'Transparência SEDUR/ Arquivos do Processo: 5911000000-34928/2019','arquivos':arqs}]}]}
json.dump(tr,open(f'{OUT}/transparencia-site.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('transparência site: audiências',len(it),'| arquivos EIV',len(arqs))
# ---------------- projetos
PROJ=[('plano-de-incentivos-fiscais','Plano de Incentivos Fiscais','PLANO DE INCENTIVO FISCAIS'),('eu-curto-meu-passeio','Eu Curto Meu Passeio','EU CURTO MEU PASSEIO'),('conselho-municipal-salvador','Conselho Municipal Salvador','CONSELHO MUNICIPAL SALVADOR'),('tul','TUL','TUL'),('revitalizar','Revitalizar','REVITALIZAR'),('pidi','PIDI','PIDI')]
pj=[]
for slug,nome,rot in PROJ:
    r=analisa(f'proj/{slug}.html')
    links=[{'texto':l['texto'],'url':absu(l['href']) if not l['href'].lower().startswith('javascript') else None,'url_original':l['href'],'arquivo_status_http':status(absu(l['href']))} for l in r['links'] if l['href'] and not l['href'].lower().startswith('javascript') and 'print=1' not in l['href']]
    pj.append({'slug':slug,'nome':nome,'rotulo_na_home':rot,'url':f'{BASE}/{slug}','titulo_na_pagina':r['titulo'],'texto':r['texto'],'links':links,'imagens':[{'src':s,'alt':a} for s,a in r['imgs']]})
json.dump({'fonte':BASE+'/ (bloco "Nossos Projetos" da home)','coletado_em':'2026-09-21','projetos':pj},open(f'{OUT}/projetos.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('projetos:',len(pj))
# ---------------- institucional
r=analisa('pages/institucional_area-de-atuacao.html'); t=r['texto']
i=t.find('A SEDUR, criada em 1989'); j=t.find('© 2021')
areas_txt=t[i:j].strip()
inst={'fonte':BASE+'/institucional/area-de-atuacao','coletado_em':'2026-09-21','texto_integral':areas_txt,'introducao':'A SEDUR, criada em 1989, atua no licenciamento e fiscalização das seguintes áreas:','areas':['EMPREENDIMENTOS','ATIVIDADES ECONÔMICAS','PUBLICIDADE','EVENTOS','URBANISMO','AMBIENTAL','DESENVOLVIMENTO URBANO']}
json.dump(inst,open(f'{OUT}/institucional.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('ok')
