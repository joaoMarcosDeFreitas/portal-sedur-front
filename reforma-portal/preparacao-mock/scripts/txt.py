import sys,re,html
s=open(sys.argv[1],encoding='utf-8',errors='ignore').read()
s=re.sub(r'(?is)<(script|style|svg|noscript)[^>]*>.*?</\1>','',s)
s=re.sub(r'(?i)<br\s*/?>|</(p|div|li|h\d|tr|a|button|label|section)>','\n',s)
s=re.sub(r'<[^>]+>',' ',s)
s=html.unescape(s)
lines=[re.sub(r'\s+',' ',l).strip() for l in s.split('\n')]
print('\n'.join(l for l in lines if l))
