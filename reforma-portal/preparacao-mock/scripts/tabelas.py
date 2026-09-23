import sys, re, json, glob, os
from bs4 import BeautifulSoup
from datetime import datetime
def linhas(path):
    s = open(path, encoding='utf-8', errors='ignore').read()
    soup = BeautifulSoup(s, 'lxml')
    for t in soup(['script','style','noscript']): t.decompose()
    box = soup.find('div', class_='no-home') or soup.body
    h = box.find(re.compile('^h[1-3]$'))
    titulo = re.sub(r'\s+',' ',h.get_text()).strip() if h else None
    out=[]; cab=None; ntab=0
    for t in box.find_all('table'):
        ntab+=1
        rows=t.find_all('tr')
        for tr in rows:
            cells=tr.find_all(['td','th'])
            if not cells: continue
            if tr.find('th') and not tr.find('td'):
                cab=[c.get_text(' ',strip=True) for c in cells]; continue
            d={'celulas':[re.sub(r'\s+',' ',c.get_text(' ')).strip() for c in cells],
               'links':[(a.get('href'), (a.find('img').get('alt') if a.find('img') else None), re.sub(r'\s+',' ',a.get_text()).strip()) for a in tr.find_all('a')]}
            out.append(d)
    # também: parágrafos e links soltos fora de tabela (para páginas sem tabela)
    fora=[]
    if not out:
        for a in box.find_all('a'):
            fora.append((a.get('href'), re.sub(r'\s+',' ',a.get_text()).strip()))
    return dict(titulo=titulo, cab=cab, ntab=ntab, linhas=out, fora=fora, bytes=len(s))
def dt(x):
    for f in ('%d/%m/%Y',):
        try: return datetime.strptime(x.strip(), f)
        except: pass
    return None
if __name__=='__main__':
    res={}
    for f in sorted(glob.glob('leg/*.html')):
        r=linhas(f); n=os.path.basename(f)[:-5]; res[n]=r
        datas=[dt(l['celulas'][0]) for l in r['linhas'] if l['celulas']]
        datas=[d for d in datas if d]
        ordem=''
        if len(datas)>2:
            ordem='desc' if all(datas[i]>=datas[i+1] for i in range(len(datas)-1)) else ('asc' if all(datas[i]<=datas[i+1] for i in range(len(datas)-1)) else 'sem ordem')
        semdata=sum(1 for l in r['linhas'] if not dt(l['celulas'][0]))
        print(f"{n:32s} titulo={r['titulo']!s:26s} tabelas={r['ntab']} linhas={len(r['linhas']):4d} cab={r['cab']} datas:{(min(datas).strftime('%Y') if datas else '-')}..{(max(datas).strftime('%Y') if datas else '-')} ordem={ordem} sem_data_valida={semdata} links_soltos={len(r['fora'])}")
    json.dump(res, open('leg_dados.json','w',encoding='utf-8'), ensure_ascii=False)
