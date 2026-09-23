#!/usr/bin/env python3
# Baixa as notícias uma por vez (mais novas primeiro), 2,5 s entre pedidos. Para se o firewall bloquear.
import json, os, subprocess, time, sys
ind=json.load(open('noticias_indice.json',encoding='utf-8'))
ind.sort(key=lambda x:-x['id'])
UA="Mozilla/5.0 (X11; Linux x86_64) inventario-leitura"
log=open('nart/crawl.log','a')
for n,it in enumerate(ind):
    f=f"nart/{it['id']}.html"
    if os.path.exists(f) and os.path.getsize(f)>2000: continue
    r=subprocess.run(['nice','-n','19','ionice','-c3','curl','-sL','-m','40','-A',UA,'-o',f,'-w','%{http_code}','https://sedur.salvador.ba.gov.br'+it['url']],capture_output=True,text=True)
    code=r.stdout.strip()
    corpo=open(f,encoding='utf-8',errors='ignore').read() if os.path.exists(f) else ''
    if code!='200' or 'Acesso Bloqueado' in corpo or 'URL bloqueada' in corpo.lower():
        log.write(f"PARADO id={it['id']} code={code}\n"); log.flush()
        if code!='200' and 'Acesso Bloqueado' not in corpo:
            os.remove(f) if os.path.exists(f) else None
            if code in ('404','410'): continue  # só esse item
        sys.exit(1)
    log.write(f"{code} {it['id']}\n"); log.flush()
    time.sleep(2.5)
log.write("FIM\n"); log.close()
