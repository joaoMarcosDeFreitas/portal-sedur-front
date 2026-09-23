#!/usr/bin/env python3
"""Confere (HEAD, um por vez, 1,2 s de pausa) os links de arquivo do site.
Grava linkcheck_site.json e linkcheck_site_detalhe.json aos poucos. Retoma de onde parou."""
import json, subprocess, time, os, re
UA = "Mozilla/5.0 (X11; Linux x86_64) inventario-leitura"
D = '/root/SEDUR-johnny/reforma-portal/preparacao-mock/dados'
os.chdir(os.path.dirname(os.path.abspath(__file__)))
urls = []


def add(u):
    if u and u.startswith('http') and u not in urls:
        urls.append(u)


P = json.load(open(f'{D}/projetos.json', encoding='utf-8'))
for p in P['projetos']:
    for l in p['links']:
        add(l['url'])
for u in ['https://servicos.sedur.salvador.ba.gov.br/servicosonline/Web/emissaodam.php?idCategoria=387',
          'https://servicos.sedur.salvador.ba.gov.br/servicosonline/Web/aberturaprocesso.php?servico_id=7000',
          'http://sedur.salvador.ba.gov.br/arquivos/pdf/meupasseio2021.pdf']:
    add(u)
Q = json.load(open(f'{D}/licitacoes.json', encoding='utf-8'))
for i in Q['itens']:
    add(i['arquivo'])
T = json.load(open(f'{D}/transparencia-site.json', encoding='utf-8'))
for m in T['itens_do_menu']:
    for i in m.get('itens', []):
        add(i['arquivo'])
    for pr in m.get('processos', []):
        for a in pr['arquivos']:
            add(a['arquivo'])
L = json.load(open(f'{D}/legislacao.json', encoding='utf-8'))


def walk(s):
    for x in s.get('subsecoes', []):
        walk(x)
    for i in s.get('itens', []):
        add(i['arquivo'])


for s in L['secoes']:
    walk(s)
print(len(urls), 'links únicos', flush=True)
res = json.load(open('linkcheck_site.json', encoding='utf-8')) if os.path.exists('linkcheck_site.json') else {}
det = json.load(open('linkcheck_site_detalhe.json', encoding='utf-8')) if os.path.exists('linkcheck_site_detalhe.json') else {}


def pedido(u, get=False):
    cmd = ['nice', '-n', '19', 'ionice', '-c3', 'curl', '-s', '-m', '25', '-A', UA, '-D', '-', '-o', '/dev/null',
           '-w', '\nCODE:%{http_code}']
    cmd += (['-r', '0-0'] if get else ['-I'])
    r = subprocess.run(cmd + [u], capture_output=True, text=True)
    m = re.search(r'CODE:(\d+)', r.stdout)
    return r.stdout, int(m.group(1)) if m else 0


def salvar():
    json.dump(res, open('linkcheck_site.json', 'w', encoding='utf-8'), ensure_ascii=False)
    json.dump(det, open('linkcheck_site_detalhe.json', 'w', encoding='utf-8'), ensure_ascii=False)


for n, u in enumerate(urls):
    if u in res:
        continue
    out, code = pedido(u)
    if code in (0, 403, 405):
        out, code = pedido(u, get=True)
    ct = re.findall(r'(?i)^content-type:\s*(.+)$', out, re.M)
    cl = re.findall(r'(?i)^content-length:\s*(\d+)', out, re.M)
    loc = re.findall(r'(?i)^location:\s*(.+)$', out, re.M)
    res[u] = code
    det[u] = {'codigo': code, 'tipo': ct[-1].strip() if ct else None, 'bytes': int(cl[-1]) if cl else None,
              'redireciona_para': loc[-1].strip() if loc else None}
    if n % 25 == 0:
        salvar()
        print(n, len(urls), flush=True)
    time.sleep(1.2)
salvar()
print('FIM', flush=True)
