#!/usr/bin/env python3
"""Check the published document graph, metadata, and accidental private identifiers."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.refs = []
        self.h1 = 0
        self.description = False
        self.canonical = False
        self.lang = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, 'Duplicate id: ' + a['id']
            self.ids.add(a['id'])
        for key in ['href', 'src']:
            if key in a:
                self.refs.append(a[key])
        self.h1 += tag == 'h1'
        self.description |= tag == 'meta' and a.get('name') == 'description'
        self.canonical |= tag == 'link' and a.get('rel') == 'canonical'
        self.lang |= tag == 'html' and a.get('lang') == 'en'
        if tag == 'img':
            assert 'alt' in a, 'Image missing alt attribute'


def main():
    parsed = {}
    for path in ROOT.glob('*.html'):
        page = Page()
        page.feed(path.read_text())
        assert page.h1 == 1, f'{path.name}: expected one h1'
        assert page.description and page.canonical and page.lang, f'{path.name}: incomplete metadata'
        assert 'main' in page.ids, f'{path.name}: missing skip-link target'
        parsed[path.name] = page
    links = 0
    for name, page in parsed.items():
        for ref in page.refs:
            u = urlsplit(ref)
            assert u.scheme not in ['javascript', 'file', 'http'], (name, ref)
            if u.scheme or u.netloc:
                continue
            target = unquote(u.path) if u.path else name
            assert (ROOT / target).is_file(), (name, ref, 'Missing local file')
            if u.fragment:
                assert target in parsed and u.fragment in parsed[target].ids, (name, ref, 'Missing fragment')
            links += 1
    private = re.compile(r'GOCSPX-[A-Za-z0-9_-]{20,}|ya29\.[A-Za-z0-9_-]{25,}|1//0[A-Za-z0-9_-]{25,}|AIza[A-Za-z0-9_-]{35}|drive\.google\.com/drive/folders/|instrumentl-[a-f0-9]{12}', re.I)
    for path in ROOT.rglob('*'):
        if '.git' in path.parts or not path.is_file() or path.suffix in ['.png', '.zip', '.pyc']:
            continue
        assert not private.search(path.read_text()), 'Private information: ' + str(path.relative_to(ROOT))
    with zipfile.ZipFile(ROOT/'assets/grants-for-good-brand-kit.zip') as z:
        assert z.testzip() is None
        assert len(z.namelist()) == 9
    print(json.dumps({'pages':len(parsed),'checked_local_links':links,'brand_archive':'ok','private_identifier_scan':'passed'}))


if __name__ == '__main__':
    main()
