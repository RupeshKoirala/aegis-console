import type { CourseModule } from '../../core/curriculum';

export const M13: CourseModule = {
  id: 'm13',
  title: 'Forms (3 generations)',
  read: ['angular-manual/m15', 'angular/l17', 'cyber/l5'],
  exercises: [
    { id: '01', title: 'Template-driven: ngModel & validation UX', load: () => import('./01-template-driven/page').then(m => m.Page) },
    { id: '02', title: 'Reactive typed forms & validators', load: () => import('./02-reactive-typed/page').then(m => m.Page) },
    { id: '03', title: 'FormArray: policy rule builder', load: () => import('./03-form-array/page').then(m => m.Page) },
    { id: '04', title: 'ControlValueAccessor: a CIDR input', load: () => import('./04-cva/page').then(m => m.Page) },
    { id: '05', title: 'Signal Forms', load: () => import('./05-signal-forms/page').then(m => m.Page) },
  ],
};
