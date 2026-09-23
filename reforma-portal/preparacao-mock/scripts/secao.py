import sys, re, json
from bs4 import BeautifulSoup
def analisa(path):
    s = open(path, encoding='utf-8', errors='ignore').read()
    soup = BeautifulSoup(s, 'lxml')
    for t in soup(['script','style','noscript']): t.decompose()
    box = soup.find('div', class_='no-home') or soup.body
    h = box.find(re.compile('^h[1-3]$'))
    titulo = re.sub(r'\s+',' ',h.get_text()).strip() if h else None
    links=[]
    for a in box.find_all('a'):
        href=a.get('href') or ''
        t=re.sub(r'\s+',' ',a.get_text()).strip()
        img=a.find('img')
        links.append({'texto':t,'href':href,'img_alt':(img.get('alt') if img else None) if img else '-'})
    tabelas=len(box.find_all('table')); acordeao=len(box.select('[data-toggle=collapse],.accordion,.panel,.card'))
    imgs=[(i.get('src'),i.get('alt')) for i in box.find_all('img')]
    txt=re.sub(r'\n\s*\n+','\n',box.get_text('\n')); txt='\n'.join(l.strip() for l in txt.split('\n') if l.strip())
    return dict(titulo=titulo, n_links=len(links), links=links, tabelas=tabelas, acordeao=acordeao, imgs=imgs, texto=txt, bytes=len(s))
if __name__=='__main__':
    r=analisa(sys.argv[1]); lim=int(sys.argv[2]) if len(sys.argv)>2 else 60
    print('##',sys.argv[1],'| titulo:',r['titulo'],'| links:',r['n_links'],'| tabelas:',r['tabelas'],'| acordeao/painéis:',r['acordeao'],'| bytes:',r['bytes'])
    for l in r['links'][:lim]: print('  -',repr(l['texto'][:90]),'->',l['href'][:130], '' if l['img_alt']=='-' else '[img alt=%r]'%l['img_alt'])
    if r['n_links']>lim: print('  ... +',r['n_links']-lim)
