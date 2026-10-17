import type { CourseModule } from '../../core/curriculum';

export const M01: CourseModule = {
  id: 'm01',
  title: 'Components & templates',
  read: ['angular/l8', 'angular/l9', 'angular/l10', 'angular/l11', 'angular/l12', 'angular/l13', 'angular/l14', 'angular-manual/m3', 'angular-manual/m4', 'angular-manual/m5', 'angular-manual/m9'],
  exercises: [
    { id: '01', title: 'Every kind of binding', load: () => import('./01-bindings/page').then(m => m.Page) },
    { id: '02', title: 'Control flow: @for @if @switch @let', load: () => import('./02-control-flow/page').then(m => m.Page) },
    { id: '03', title: 'Inputs: signal & decorator', load: () => import('./03-inputs/page').then(m => m.Page) },
    { id: '04', title: 'Outputs & model()', load: () => import('./04-outputs-model/page').then(m => m.Page) },
    { id: '05', title: 'Reading legacy templates', load: () => import('./05-legacy-directives/page').then(m => m.Page) },
    { id: '06', title: 'A first shared service', load: () => import('./06-first-service/page').then(m => m.Page) },
  ],
};
