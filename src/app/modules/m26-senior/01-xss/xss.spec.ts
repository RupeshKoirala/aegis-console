import { TestBed } from '@angular/core/testing';
import { escapeHtml, renderNote, safeUrl } from './notes';
import { ThreatNote } from './threat-note';

describe('M26.01 · XSS', () => {
  it('TODO 1: escapeHtml', () => {
    expect(escapeHtml(`<img src=x onerror="a('b')"> & co`)).toBe('&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt; &amp; co');
  });

  it('TODO 2: safeUrl allows only http(s) and mailto', () => {
    expect(safeUrl('https://example.org/x?a=1')).toBe('https://example.org/x?a=1');
    expect(safeUrl('mailto:soc@acme.test')).toBe('mailto:soc@acme.test');
    expect(safeUrl('javascript:alert(1)')).toBeNull();
    expect(safeUrl(' JaVaScRiPt:alert(1)')).toBeNull();
    expect(safeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(safeUrl('not a url')).toBeNull();
  });

  it('TODO 3: renderNote formats AFTER escaping', () => {
    expect(renderNote('**C2** at `1.2.3.4`')).toBe('<strong>C2</strong> at <code>1.2.3.4</code>');
    expect(renderNote('<b>x</b>')).toBe('&lt;b&gt;x&lt;/b&gt;');
    expect(renderNote('[report](https://e.org/r?a=1&b=2)')).toBe('<a href="https://e.org/r?a=1&amp;b=2" rel="noopener noreferrer" target="_blank">report</a>');
    expect(renderNote('[here](javascript:stealTokens)')).toBe('here');
  });

  it('TODO 4: the rendered DOM contains no executable markup', () => {
    const f = TestBed.createComponent(ThreatNote);
    f.componentRef.setInput('markdown', 'x <img src=x onerror="alert(1)"> [y](javascript:alert(1)) <script>alert(2)</script> **ok**');
    f.detectChanges();
    const note: HTMLElement = f.nativeElement.querySelector('.note');
    expect(note.querySelector('img, script')).toBeNull();
    expect(note.querySelector('a')).toBeNull();
    expect(note.querySelector('strong')?.textContent).toBe('ok');
    expect(note.textContent).toContain('<img src=x onerror="alert(1)">');
  });

  it('TODO 4: no bypassSecurityTrust* on user content', () => {
    const f = TestBed.createComponent(ThreatNote);
    f.componentRef.setInput('markdown', 'plain');
    expect(typeof f.componentInstance.html()).toBe('string');
  });
});
