#!/usr/bin/env python3
"""Comprueba que no haya enlaces internos rotos (páginas, archivos, imágenes y anclas #) ni URLs del sitemap sin archivo. Sale con código 1 si hay alguno."""
import re,os,sys,json
from urllib.parse import urlparse,unquote
ROOT='.'; HOST=('www.trabajoenexcel.com','trabajoenexcel.com')
files=[]
for d,ds,fs in os.walk(ROOT):
    ds[:]=[x for x in ds if x not in('.git','node_modules','.claude','scripts','theme')]
    for f in fs:
        if f.endswith(('.html','.js','.xml','.json','.css','.txt')): files.append(os.path.join(d,f)[2:])
def resolve(path):
    p=unquote(path)
    for c in (p, p+'.html' if False else None, p.rstrip('/')+'/index.html' if p.endswith('/') or p=='' else None):
        if c and os.path.isfile(c): return c
    if os.path.isdir(p) and os.path.isfile(os.path.join(p,'index.html')): return os.path.join(p,'index.html')
    return None
ids_cache={}
def ids(f):
    if f not in ids_cache:
        t=open(f,encoding='utf-8',errors='ignore').read()
        ids_cache[f]=set(re.findall(r'\b(?:id|name)="([^"]+)"',t))|set(re.findall(r"\bid='([^']+)'",t))
    return ids_cache[f]
redir={}
for f in files:
    if f.endswith('.html'):
        t=open(f,encoding='utf-8',errors='ignore').read()
        m=re.search(r'http-equiv="refresh"[^>]*url=([^"\']+)',t,re.I)
        if m: redir[f]=m.group(1)
bad=[];toredir=[];n=0
attr=re.compile(r'''(?:href|src|data-url|action|poster|data-src)\s*=\s*["']([^"']+)["']''')
for f in files:
    if not f.endswith(('.html','.js')): continue
    t=open(f,encoding='utf-8',errors='ignore').read()
    if f.startswith(('docs/',)): continue
    cands=set(attr.findall(t))
    cands|=set(re.findall(r'<meta[^>]+(?:og:image"|og:url"|twitter:image")[^>]+content="([^"]+)"',t))
    cands|=set(re.findall(r'url\(([^)"\']+)\)',t)) if f.endswith('.html') else set()
    if f.endswith('.js'): cands|=set(re.findall(r"['\"](/[A-Za-z0-9_\-./]+(?:\.html|/)(?:#[\w-]+)?)['\"]",t))
    for u in cands:
        u=u.strip()
        if not u or u.startswith(('mailto:','tel:','javascript:','data:','sms:','whatsapp:','blob:','{','$')) or '{{' in u or '${' in u: continue
        if u.startswith('//'): u='https:'+u
        pu=urlparse(u)
        if pu.scheme in('http','https'):
            if pu.netloc not in HOST: continue
            path=pu.path
        elif pu.scheme: continue
        else:
            path=pu.path
        if path=='' and pu.fragment:
            tgt=f
        else:
            if path.startswith('/'): rel=path[1:]
            else: rel=os.path.normpath(os.path.join(os.path.dirname(f),path)) if path else f
            if rel=='' : rel='index.html'
            ext=os.path.splitext(rel)[1]
            if ext and ext not in('.html',) and not rel.endswith('/'):
                if not os.path.isfile(rel): bad.append((f,u,'archivo no existe'))
                n+=1; continue
            tgt=resolve(rel)
            if not tgt:
                # content= de meta no son enlaces si no empiezan por / o http
                if pu.scheme or path.startswith('/'): bad.append((f,u,'página no existe')); n+=1
                continue
        n+=1
        if tgt in redir: toredir.append((f,u,redir[tgt]))
        if pu.fragment and tgt.endswith('.html') and pu.fragment not in ids(tgt) and pu.fragment!='top':
            bad.append((f,u,'ancla no existe en '+tgt))
# sitemap
sm=open('sitemap.xml').read()
for loc in re.findall(r'<loc>([^<]+)</loc>',sm):
    p=urlparse(loc).path[1:]
    if not resolve(p or 'index.html'): bad.append(('sitemap.xml',loc,'URL sin archivo'))
    elif resolve(p or 'index.html') in redir: toredir.append(('sitemap.xml',loc,redir[resolve(p or 'index.html')]))
for _f in files:
    if _f.endswith(('.html','.js')) and not _f.startswith('docs/') and 'TU-CODIGO' in open(_f,encoding='utf-8',errors='ignore').read():
        bad.append((_f,'TU-CODIGO','marcador de checkout sin sustituir'))
print('enlaces revisados:',n,'| archivos:',len(files))
print('ROTOS:',len(bad))
for b in sorted(set(bad)): print(' ',b)
print('A páginas-redirección:',len(set(toredir)))
for b in sorted(set(toredir)): print(' ',b)

sys.exit(1 if bad else 0)
