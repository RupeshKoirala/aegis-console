import type { CourseModule } from '../../core/curriculum';

export const M18: CourseModule = {
  id: 'm18',
  title: 'i18n',
  read: ['angular-manual/m10', 'angular-manual/m4'],
  exercises: [
    { id: '01', title: 'Messages, ICU & $localize', load: () => import('./01-messages/page').then(m => m.Page) },
    { id: '02', title: 'Locale formatting & time zones', load: () => import('./02-locale-format/page').then(m => m.Page) },
  ],
};
