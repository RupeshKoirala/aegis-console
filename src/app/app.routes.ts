import { Routes } from '@angular/router';
import { CURRICULUM } from './core/curriculum';
import { Home } from './core/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Aegis Console · Training' },
  ...CURRICULUM.map(m => ({
    path: `${m.id}/map`,
    loadComponent: () => import('./core/module-map').then(c => c.ModuleMap),
    data: { mod: m.id },
    title: `${m.id.toUpperCase()} map · ${m.title}`,
  })),
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
