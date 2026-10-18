import { TestBed } from '@angular/core/testing';
import { clearTranslations, loadTranslations } from '@angular/localize';
import { AlertSummary, assignedLabel, statusLabel } from './alert-summary';
import { FR } from './fr.translations';
import { ALERTS } from '../../../shared/domain/sample-data';

// Runtime translation: load BEFORE the component's template is first created (that's when its messages are read).
loadTranslations(FR);

function render(alerts = ALERTS) {
  const f = TestBed.createComponent(AlertSummary);
  f.componentRef.setInput('alerts', alerts);
  f.componentRef.setInput('analyst', 'Ana');
  f.detectChanges();
  const el: HTMLElement = f.nativeElement;
  return { f, text: (s: string) => el.querySelector(s)?.textContent?.trim(), el };
}

describe('M18.01 · i18n', () => {
  it('TODO 1: plain text, attributes and interpolations use the IDs', () => {
    const { text, el } = render();
    expect(text('.title')).toBe('Alertes ouvertes');
    expect((el.querySelector('.search') as HTMLInputElement).placeholder).toBe('Rechercher des alertes');
    expect(text('.hello')).toBe('Bonjour Ana, voici votre file.');
  });

  it('TODO 1: ICU plural picks the right form', () => {
    const open = ALERTS.filter(a => a.status !== 'RESOLVED');
    expect(render(open.slice(0, 1)).text('.count')).toBe('Une alerte ouverte');
    expect(render([]).text('.count')).toBe('Aucune alerte ouverte');
    expect(render(open.slice(0, 3)).text('.count')).toBe('3 alertes ouvertes');
  });

  it('TODO 1: ICU select', () => {
    expect(render().text('.worst')).toBe('Gravité maximale : critique');
    expect(render([]).text('.worst')).toBe('Gravité maximale : normale');
  });

  it('TODO 2: $localize in TypeScript', () => {
    expect(statusLabel('NEW')).toBe('Nouvelle');
    expect(statusLabel('RESOLVED')).toBe('Résolue');
    expect(assignedLabel('ana@acme.test')).toBe('Assignée à ana@acme.test');
    clearTranslations();
    expect(statusLabel('TRIAGED')).toBe('Triaged');
    expect(assignedLabel('x')).toBe('Assigned to x');
    loadTranslations(FR);
  });
});
