"""Validate the documentation package; needs Python 3 and jsonschema."""
from pathlib import Path
from decimal import Decimal
from urllib.parse import unquote
import json
import hashlib
import re
import xml.etree.ElementTree as ET
from jsonschema import Draft202012Validator, FormatChecker

root = Path(__file__).resolve().parent.parent
checks = []
errors = []
for doc in sorted(root.glob('*.md')):
    for target in re.findall(r'\]\(([^)]+)\)', doc.read_text()):
        if target.startswith(('https://', 'http://', '#')):
            continue
        resolved = doc.parent / unquote(target.split('#')[0])
        if not resolved.exists() and resolved != root / 'output/validation.txt':
            errors.append(f'Broken link: {doc.name} -> {target}')
checks.append('Relative links in the five package documents: checked')

sources = sorted((root / 'diagrams').glob('*.puml'))
assert len(sources) == 8
for source in sources:
    svg = source.with_suffix('.svg')
    document = ET.parse(svg)
    text = ''.join(document.getroot().itertext())
    if 'Syntax Error' in text or 'An error has occured' in text:
        errors.append(f'Render error: {svg.name}')
    if svg.stat().st_mtime < source.stat().st_mtime:
        errors.append(f'Stale SVG: {svg.name}')
checks.append('8 PlantUML diagrams: SVG present, XML valid, no renderer error, source freshness checked')

schemas = [json.loads((root / 'contracts' / name).read_text()) for name in
           ['event-envelope.schema.json', 'stock-changed.schema.json']]
for schema in schemas:
    Draft202012Validator.check_schema(schema)
validators = [Draft202012Validator(s, format_checker=FormatChecker()) for s in schemas]
example = json.loads((root / 'contracts/stock-changed.example.json').read_text())
validators[0].validate(example)
validators[1].validate(example['payload'])
p = example['payload']
assert Decimal(p['available']) == Decimal(p['onHand']) - Decimal(p['reserved']) - Decimal(p['blocked']) >= 0
assert example['aggregateType'] == 'Stock'
assert example['aggregateId'] == f"{p['warehouseId']}:{p['productId']}"
invalid = dict(example)
invalid.pop('eventId')
assert list(validators[0].iter_errors(invalid))
invalid_payload = dict(p, locationType='STORE')
assert list(validators[1].iter_errors(invalid_payload))
checks.append('Draft 2020-12: 2 schemas valid; example, quantity invariant and 2 rejection cases passed')

catalog = (root / 'INT-002-contract-catalog.md').read_text()
api_ids = set(re.findall(r'^\| (API-\d+) \|', catalog, re.M))
evt_ids = set(re.findall(r'^\| (EVT-\d+) \|', catalog, re.M))
assert api_ids == {f'API-{i:02}' for i in range(1, 28)}
assert evt_ids == {f'EVT-{i:02}' for i in range(1, 25)}
for source in sources:
    for identifier in re.findall(r'\b(?:API|EVT)-\d{2}\b', source.read_text()):
        if identifier not in api_ids | evt_ids:
            errors.append(f'Unknown contract: {source.name}: {identifier}')
checks.append('27 API/command IDs and 24 event IDs: complete; diagram references resolved')

html = (root / 'output/RetailMax_Integration_ToBe.html').read_text()
assert '<html lang="ru">' in html
assert not re.search(r'(?:src|href)="https?://[^\"]+\.(?:js|css)', html)
assert len(re.findall(r'<article id="INT-', html)) == 8
checks.append('Standalone HTML: 5 documents, 8 gallery diagrams, no remote JS/CSS dependency')

browser_report = root / 'output/browser-validation.json'
if browser_report.exists():
    result = json.loads(browser_report.read_text())
    assert result['status'] == 'PASS'
    assert result['htmlSha256'] == hashlib.sha256(html.encode()).hexdigest(), 'Browser report belongs to another HTML version'
    checks.append('Browser check of this HTML hash: desktop 1440px, mobile 390px, images, zoom and navigation passed')
else:
    checks.append('Browser check: not recorded; run tools/check-html.cjs')

report = '\n'.join(['RetailMax Integration To-Be 1.0 — document checks', 'Date: 2026-11-12', '', *checks,
                    '', 'Scope: documentation and examples only; no ERP/WMS/CRM integration runtime was tested.',
                    *errors, '', 'PASS' if not errors else 'FAIL']) + '\n'
(root / 'output/validation.txt').write_text(report)
print(report)
raise SystemExit(bool(errors))
