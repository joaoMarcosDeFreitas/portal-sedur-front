#!/usr/bin/env python3
"""Junta o índice das 81 páginas de lista com o texto das notícias já baixadas (nart/ e amostra/) -> noticias.json"""
import json, re, glob, os
from datetime import datetime
from bs4 import BeautifulSoup
OUT='/root/SEDUR-johnny/reforma-portal/preparacao-mock/dados/noticias.json'
os.chdir(os.path.dirname(os.path.abspath(__file__)))
ind=json.load(open('noticias_indice.json',encoding='utf-8'))
arq={}
for f in glob.glob('amostra/n*.html')+glob.glob('nart/*.html'):
    arq[int(re.findall(r'(\d+)\.html',f)[0])]=f
lista=[]; com_texto=0
for it in sorted(ind,key=lambda x:-x['id']):
    d=datetime.strptime(it['data_lista'],'%d-%m-%y').date().isoformat()
    n={'id':it['id'],'url':'https://sedur.salvador.ba.gov.br'+it['url'],'titulo':it['titulo'],'data':d,'data_na_lista':it['data_lista'],
       'imagem_miniatura':('https://sedur.salvador.ba.gov.br'+it['imagem']) if it['imagem'] else None,'pagina_da_lista':it['pagina_lista'],'texto_baixado':False}
    f=arq.get(it['id'])
    if f:
        s=open(f,encoding='utf-8',errors='ignore').read(); soup=BeautifulSoup(s,'lxml'); b=soup.find(attrs={'itemprop':'articleBody'})
        if b:
            pub=re.search(r'Publicado:\s*([^<\n]+)',s)
            paras=[re.sub(r'\s+',' ',p.get_text(' ')).strip() for p in b.find_all(['p','li','h2','h3','h4']) if p.get_text(strip=True)]
            if not paras: paras=[re.sub(r'\s+',' ',b.get_text(' ')).strip()]
            n.update({'texto_baixado':True,'publicado_na_pagina':pub.group(1).strip() if pub else None,'paragrafos':paras,
                      'imagens_no_corpo':[i.get('src') for i in b.find_all('img')],'links_no_corpo':[{'texto':re.sub(r'\s+',' ',a.get_text()).strip(),'url':a.get('href')} for a in b.find_all('a') if a.get('href')]})
            com_texto+=1
    lista.append(n)
json.dump({'fonte':'https://sedur.salvador.ba.gov.br/noticias','coletado_em':'2026-09-21','total_na_lista':len(lista),'com_texto_baixado':com_texto,
 'observacao':'Índice completo (81 páginas de lista, de 13/08/2014 a 11/09/2026). O texto foi baixado só das notícias mais novas (de 24/08/2020 a 11/09/2026) e de 5 de amostra mais antigas; para as demais, só título, data e miniatura. Para baixar o resto, rodar preparacao-mock/scripts/crawl_artigos.py (retoma de onde parou).',
 'campos_da_pagina_da_noticia':['título','Voltar','Imprimir (?tmpl=component&print=1)','Detalhes','Publicado: <dia> <mês por extenso> <ano>','corpo','Anterior/Próximo (Próximo = a mais antiga)'],
 'noticias':lista},open(OUT,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(len(lista),'notícias;',com_texto,'com texto;',os.path.getsize(OUT)//1024,'KB')
