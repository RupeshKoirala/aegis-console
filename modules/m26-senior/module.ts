import type { CourseModule } from '../../core/curriculum';
import { ErrorHandler } from '@angular/core';
import { ErrorReporter } from './04-error-reporting/error-reporter';

export const M26: CourseModule = {
  id: 'm26',
  title: 'Senior frontend',
  read: ['cyber/l13', 'foundations/l19', 'foundations/l32', 'angular-manual/m18'],
  exercises: [
    { id: '01', title: 'XSS & sanitization', load: () => import('./01-xss/page').then(m => m.Page) },
    { id: '02', title: '100,000 rows: virtual scroll', load: () => import('./02-virtual-scroll/page').then(m => m.Page) },
    { id: '03', title: 'Accessibility: keyboard & focus', load: () => import('./03-a11y/page').then(m => m.Page) },
    {
      id: '04', title: 'Production error reporting', load: () => import('./04-error-reporting/page').then(m => m.Page),
      providers: [{ provide: ErrorHandler, useClass: ErrorReporter }],
    },
  ],
};
