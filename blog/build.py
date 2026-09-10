#!/usr/bin/env python3
"""Builds two blogs from blog/_posts/*.md:
   site: tlp         -> /blog/ (lab register)
   site: switchboard -> /switchboard/blog/ (product register)
Frontmatter: title, date (YYYY-MM-DD), site, summary. Body = markdown (paragraphs, ##, lists, **bold**, *em*, links, > quotes)."""
import re, os, html, datetime, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
def md(text):
    out=[];para=[];lst=None
    def flush():
        nonlocal para
        if para: out.append('<p>'+inline(' '.join(para))+'</p>'); para=[]
    def inline(t):
        t=html.escape(t,quote=False)
        t=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',t); t=re.sub(r'(?<!\*)\*(?!\*)(.+?)\*',r'<em>\1</em>',t)
        t=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',t); return t
    for line in text.split('\n'):
        s=line.rstrip()
        if not s: flush(); 
        if not s and lst: out.append('</'+lst+'>'); lst=None
        if not s: continue
        if s.startswith('## '): flush(); out.append('<h2>'+inline(s[3:])+'</h2>'); continue
        if s.startswith('> '): flush(); out.append('<blockquote>'+inline(s[2:])+'</blockquote>'); continue
        m=re.match(r'^(-|\d+\.) (.*)',s)
        if m:
            flush(); tag='ol' if m.group(1)!='-' else 'ul'
            if lst!=tag: 
                if lst: out.append('</'+lst+'>')
                out.append('<'+tag+'>'); lst=tag
            out.append('<li>'+inline(m.group(2))+'</li>'); continue
        if lst: out.append('</'+lst+'>'); lst=None
        para.append(s)
    flush()
    if lst: out.append('</'+lst+'>')
    return '\n'.join(out)
def parse(p):
    raw=p.read_text(); fm,body=raw.split('\n---\n',1); meta={}
    for l in fm.strip().strip('-').strip().split('\n'):
        k,v=l.split(':',1); meta[k.strip()]=v.strip()
    meta['slug']=p.stem; meta['body']=md(body.strip()); meta['words']=len(body.split())
    meta['d']=datetime.date.fromisoformat(meta['date']); return meta
posts=sorted([parse(p) for p in (ROOT/'blog/_posts').glob('*.md')],key=lambda m:m['d'],reverse=True)
FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
VER='<meta name="google-site-verification" content="QWNvZV25SwA6QShgioOIhmtgE9hVY2u63mK03ZEYLHw" />'
def fdate(d): return d.strftime('%-d %B %Y')
# ---------------- TLP register ----------------
TLP_CSS='''
:root{--void:#000;--bone:#e8e3d9;--gold:#c9a96e;--muted:#8b857a;--faint:#514c45;--line:rgba(232,227,217,.08);--serif:'Instrument Serif',Georgia,serif;--sans:'Instrument Sans',system-ui,sans-serif;--mono:'JetBrains Mono',ui-monospace,monospace}
*{box-sizing:border-box;margin:0}body{background:var(--void);color:var(--bone);font-family:var(--serif);-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}
.wrap{max-width:760px;margin:0 auto;padding:0 clamp(20px,5vw,64px)}
nav{display:flex;align-items:center;justify-content:space-between;padding:26px 0;font:12px var(--mono);color:var(--muted);letter-spacing:.04em;flex-wrap:wrap;gap:10px}nav b{color:var(--bone);font-weight:500}nav .links{display:flex;gap:18px;flex-wrap:wrap}nav a:hover{color:var(--gold)}
.k{font:12px var(--mono);letter-spacing:.16em;color:var(--gold);text-transform:uppercase}
h1{font:400 clamp(38px,6vw,68px)/1.02 var(--serif);letter-spacing:-.02em;margin:10px 0 16px}h1 em{font-style:italic;color:var(--gold)}
.meta{font:12px var(--mono);color:var(--muted);letter-spacing:.04em;margin-bottom:40px}
article p{font-size:clamp(19px,1.9vw,22px);line-height:1.5;margin:0 0 1.1em;color:var(--bone)}article h2{font:400 clamp(26px,3vw,34px)/1.15 var(--serif);margin:1.6em 0 .5em;color:var(--bone)}article h2 em,article em{font-style:italic;color:var(--gold)}
article blockquote{border-left:2px solid var(--gold);padding-left:18px;margin:1.2em 0;font-style:italic;color:#cfc8bb;font-size:clamp(20px,2vw,24px)}article ul,article ol{padding-left:22px;margin:0 0 1.1em;font-size:clamp(18px,1.8vw,21px);line-height:1.5}article li{margin-bottom:.4em}article a{color:var(--gold);text-decoration:underline;text-underline-offset:3px}article strong{font-weight:500;color:#fff}
.list{display:grid;gap:0;margin-top:30px}.list a{display:grid;grid-template-columns:120px 1fr;gap:18px;padding:26px 0;border-top:1px solid var(--line)}.list a:last-child{border-bottom:1px solid var(--line)}.list time{font:12px var(--mono);color:var(--muted);padding-top:8px}.list h3{font:400 clamp(24px,2.6vw,32px)/1.15 var(--serif);letter-spacing:-.01em}.list p{font-size:16px;line-height:1.5;color:var(--muted);margin-top:8px;font-family:var(--sans)}.list a:hover h3{color:var(--gold)}
.next{margin-top:60px;padding-top:26px;border-top:1px solid var(--line);font:12px var(--mono);color:var(--muted);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}.next a:hover{color:var(--gold)}
footer{padding:60px 0 50px;font:12px var(--mono);color:var(--muted);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
@media(max-width:560px){.list a{grid-template-columns:1fr;gap:6px}}
'''
TLP_NAV='<nav><a href="/"><b>The Last Prompt</b> · an AI lab</a><span class="links"><a href="/#thesis">Thesis</a><a href="/manifesto/">Manifesto</a><a href="/blog/">Blog</a><a href="/workshops/">Workshops</a><a href="/switchboard/">Switchboard</a></span></nav>'
def tlp_page(title,desc,body,url):
    return f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">{VER}<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{html.escape(title)}</title><meta name="description" content="{html.escape(desc,quote=True)}"><link rel="canonical" href="{url}"><meta property="og:title" content="{html.escape(title,quote=True)}"><meta property="og:description" content="{html.escape(desc,quote=True)}"><meta property="og:image" content="https://thelastprompt.ai/og.png"><link rel="icon" href="/favicon.png">{FONTS}<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><style>{TLP_CSS}</style></head>
<body><div class="wrap">{TLP_NAV}{body}<footer><span>© The Last Prompt · an AI lab</span><span><a href="/blog/">Blog</a> · <a href="/workshops/">Workshops</a> · <a href="https://github.com/sameeeeeeep/switchboard">GitHub</a></span></footer></div></body></html>'''
# ---------------- Switchboard register ----------------
SB_CSS='''
@font-face{font-family:Doto;src:url('/switchboard/fonts/Doto.ttf') format('truetype');font-weight:100 900;font-display:swap}
:root{--bg:#080b09;--ink:#e6eadf;--muted:#9aab91;--dim:#6f7d66;--edge:#82916530;--lime:#c8f250;--card:#0d110e;--display:'Doto',ui-monospace,monospace;--mono:'JetBrains Mono',ui-monospace,monospace;--sans:'Instrument Sans',system-ui,sans-serif}
*{box-sizing:border-box;margin:0}body{background:var(--bg);color:var(--ink);font-family:var(--sans);letter-spacing:-.015em;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}
.wrap{max-width:800px;margin:0 auto;padding:0 clamp(20px,5vw,44px)}
header{border-bottom:1px solid var(--edge)}.nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0;gap:10px;flex-wrap:wrap}.logo{display:flex;align-items:center;gap:10px;font:900 20px/1 var(--display);letter-spacing:.03em;text-transform:uppercase}.logo svg{width:26px;height:26px}.nav nav{display:flex;gap:20px;font:12px var(--mono);color:#a6b499;flex-wrap:wrap}.nav nav a:hover{color:var(--lime)}
.k{font:10px var(--mono);letter-spacing:.14em;color:#94a380;text-transform:uppercase;display:flex;gap:8px;align-items:center}.k i{width:5px;height:5px;border-radius:50%;background:var(--lime);box-shadow:0 0 12px #c8f25066}
h1{font:900 clamp(32px,5vw,58px)/1.02 var(--display);letter-spacing:-.04em;text-transform:uppercase;margin:14px 0 16px}h1 em,h2 em{color:var(--lime);font-style:normal}
.meta{font:11px var(--mono);color:#94a380;letter-spacing:.06em;margin-bottom:36px}
article p{font-size:clamp(16px,1.5vw,18.5px);line-height:1.6;margin:0 0 1.1em;color:#d5dccb}article h2{font:900 clamp(22px,2.6vw,30px)/1.1 var(--display);letter-spacing:-.02em;text-transform:uppercase;margin:1.8em 0 .6em}
article blockquote{border-left:2px solid var(--lime);padding-left:16px;margin:1.2em 0;color:var(--ink);font-size:clamp(17px,1.6vw,20px)}article ul,article ol{padding-left:22px;margin:0 0 1.1em;line-height:1.55;color:#d5dccb}article li{margin-bottom:.4em}article a{color:var(--lime);text-decoration:underline;text-underline-offset:3px}article strong{color:#fff;font-weight:600}
.list{display:grid;gap:12px;margin-top:30px}.list a{display:grid;grid-template-columns:110px 1fr;gap:16px;padding:20px;background:var(--card);border:1px solid var(--edge);border-radius:12px}.list a:hover{border-color:#5a6f38}.list time{font:11px var(--mono);color:#94a380;padding-top:4px;letter-spacing:.06em}.list h3{font:900 clamp(20px,2.2vw,26px)/1.1 var(--display);text-transform:uppercase;letter-spacing:-.02em}.list p{font-size:14px;line-height:1.5;color:var(--muted);margin-top:6px}
.next{margin-top:56px;padding-top:22px;border-top:1px solid var(--edge);font:11px var(--mono);color:#94a380;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}.next a:hover{color:var(--lime)}
footer{padding:50px 0 50px;font:12px var(--mono);color:#a6b499;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
@media(max-width:560px){.list a{grid-template-columns:1fr;gap:6px}}
'''
SB_MARK='<svg viewBox="0 0 26 26" aria-hidden="true"><g fill="#c8f250"><circle cx="3" cy="3" r="2"/><circle cx="8" cy="3" r="2"/><circle cx="13" cy="3" r="2"/><circle cx="18" cy="3" r="2"/><circle cx="23" cy="3" r="2"/><circle cx="3" cy="8" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="13" cy="8" r="2"/><circle cx="18" cy="8" r="2" fill="#3a4432"/><circle cx="23" cy="8" r="2"/><circle cx="3" cy="13" r="2"/><circle cx="8" cy="13" r="2"/><circle cx="13" cy="13" r="2"/><circle cx="18" cy="13" r="2"/><circle cx="23" cy="13" r="2"/><circle cx="3" cy="18" r="2"/><circle cx="8" cy="18" r="2"/><circle cx="13" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="23" cy="18" r="2"/><circle cx="3" cy="23" r="2"/><circle cx="8" cy="23" r="2"/><circle cx="13" cy="23" r="2"/><circle cx="18" cy="23" r="2"/><circle cx="23" cy="23" r="2"/></g></svg>'
SB_NAV=f'<header><div class="wrap nav"><a class="logo" href="/switchboard/">{SB_MARK}Switchboard</a><nav><a href="/switchboard/#v2-apps">The apps</a><a href="/switchboard/blog/">Blog</a><a href="/workshops/">Workshops</a><a href="/switchboard/developers/">Developers</a><a href="https://github.com/sameeeeeeep/switchboard/releases/latest">Get Switchboard ↗</a></nav></div></header>'
def sb_page(title,desc,body,url):
    return f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">{VER}<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{html.escape(title)}</title><meta name="description" content="{html.escape(desc,quote=True)}"><link rel="canonical" href="{url}"><meta property="og:title" content="{html.escape(title,quote=True)}"><meta property="og:description" content="{html.escape(desc,quote=True)}"><meta property="og:image" content="https://thelastprompt.ai/og.png"><link rel="icon" href="/switchboard/favicon.svg" type="image/svg+xml">{FONTS}<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><link rel="preload" href="/switchboard/fonts/Doto.ttf" as="font" type="font/ttf" crossorigin><style>{SB_CSS}</style></head>
<body>{SB_NAV}<div class="wrap">{body}<footer><span>© The Last Prompt · an AI lab</span><span><a href="/switchboard/blog/">Blog</a> · <a href="/workshops/">Workshops</a> · <a href="https://github.com/sameeeeeeep/switchboard">GitHub</a></span></footer></div></body></html>'''
def build(site):
    ps=[p for p in posts if p['site']==site]; base='/blog/' if site=='tlp' else '/switchboard/blog/'
    page=tlp_page if site=='tlp' else sb_page; out=ROOT/base.strip('/')
    kick='<span class="k">' + ('<i></i>' if site!='tlp' else '') + ('Blog · The Last Prompt' if site=='tlp' else 'Blog · Switchboard') + '</span>'
    idx=f'''<main style="padding-top:50px">{kick}<h1>{'Notes from <em>the lab.</em>' if site=='tlp' else 'Notes from <em>the board.</em>'}</h1><p class="meta">{'On the last prompt, and how to stop writing it.' if site=='tlp' else 'On small apps, the setup they should never need, and the layer underneath.'}</p><div class="list">'''+''.join(f'<a href="{base}{p["slug"]}/"><time>{fdate(p["d"]).upper()}</time><div><h3>{html.escape(p["title"])}</h3><p>{html.escape(p["summary"])}</p></div></a>' for p in ps)+'</div></main>'
    out.mkdir(parents=True,exist_ok=True); (out/'index.html').write_text(page('Blog — '+('The Last Prompt' if site=='tlp' else 'Switchboard'),'Notes from the lab.' if site=='tlp' else 'Notes on small apps and the layer underneath.',idx,'https://thelastprompt.ai'+base))
    for i,p in enumerate(ps):
        older=ps[i+1] if i+1<len(ps) else None; newer=ps[i-1] if i>0 else None
        nxt='<div class="next">'+(f'<a href="{base}{older["slug"]}/">← {html.escape(older["title"])}</a>' if older else '<span></span>')+(f'<a href="{base}{newer["slug"]}/">{html.escape(newer["title"])} →</a>' if newer else f'<a href="{base}">All posts →</a>')+'</div>'
        body=f'''<main style="padding-top:50px">{kick}<h1>{html.escape(p["title"])}</h1><p class="meta">{fdate(p["d"]).upper()} · {max(1,round(p["words"]/220))} MIN READ · SAMEEP REHLAN</p><article>{p["body"]}</article>{nxt}</main>'''
        d=out/p['slug']; d.mkdir(exist_ok=True); (d/'index.html').write_text(page(p['title']+' — '+('The Last Prompt' if site=='tlp' else 'Switchboard'),p['summary'],body,f'https://thelastprompt.ai{base}{p["slug"]}/'))
    print(site,len(ps),'posts →',out)
build('tlp'); build('switchboard')
