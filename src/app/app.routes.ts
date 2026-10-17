import { Routes } from '@angular/router';
import { CURRICULUM } from './core/curriculum';
import { Home } from './core/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Aegis Console · Training' },
  ...CURRICULUM.flatMap(m =>
    m.exercises.map(e => ({
      path: `${m.id}/${e.id}`,
      loadComponent: e.load,
      providers: e.providers,
      children: e.children,
      title: `${m.id.toUpperCase()}.${e.id} · ${e.title}`,
    })),
  ),
  { path: '**', redirectTo: '' },
];
