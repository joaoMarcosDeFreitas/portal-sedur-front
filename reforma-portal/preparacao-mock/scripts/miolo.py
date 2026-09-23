import sys, re
from bs4 import BeautifulSoup
s = open(sys.argv[1], encoding='utf-8', errors='ignore').read()
soup = BeautifulSoup(s, 'lxml')
print("TITLE:", soup.title.string if soup.title else None, "| h1:", [re.sub(r'\s+',' ',h.get_text()).strip() for h in soup.find_all('h1')][:4])
# remove data-uri para poder medir
imgs = soup.find_all('img')
print("IMGS:", len(imgs), "data-uri:", sum(1 for i in imgs if (i.get('src') or '').startswith('data:')), "sem alt:", sum(1 for i in imgs if not i.get('alt')))
for i in imgs[:25]:
    src=i.get('src') or ''
    print('  img', (src[:90] + ('...[base64 %d KB]'%(len(src)//1024) if src.startswith('data:') else '')), '| alt=', repr(i.get('alt')))
for t in soup(['script','style','noscript']): t.decompose()
# achar o miolo: o container depois do menu
main = soup.find(id='conteudo') or soup.find('main') or soup.body
txt = re.sub(r'\n\s*\n+', '\n', main.get_text('\n'))
txt = '\n'.join(l.strip() for l in txt.split('\n') if l.strip())
print("----TEXTO ({} chars)".format(len(txt)))
print(txt[:int(sys.argv[2]) if len(sys.argv)>2 else 4000])
print("----LINKS")
seen=set()
for a in soup.find_all('a'):
    h=a.get('href'); t=re.sub(r'\s+',' ',a.get_text()).strip()
    if h and (t,h) not in seen and not h.startswith('#'):
        seen.add((t,h)); print(' ',repr(t[:60]),'->',h[:140])
