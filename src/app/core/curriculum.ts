// The course map. Each module lists the Study Hub lessons to read first and its exercises.
// Done for you; the sidebar and the router are generated from this file.
import { Type } from '@angular/core';
import { M00 } from '../modules/m00-setup/module';
import { M01 } from '../modules/m01-components/module';
import { M02 } from '../modules/m02-modules/module';
import { M03 } from '../modules/m03-practice/module';

export interface Exercise {
  id: string;
  title: string;
  load: () => Promise<Type<unknown>>;
}

export interface CourseModule {
  id: string;
  title: string;
  /** Study Hub lessons to read before the exercises, e.g. "angular-manual/m3". */
  read: string[];
  exercises: Exercise[];
}

export const CURRICULUM: CourseModule[] = [
  M00,
  M01,
  M02,
  M03,
  // @@modules
];

export const COMING_SOON: string[] = [
  'M04 Debugging',
  'M05 Components deep dive',
  'M06 Directives',
  'M07 Pipes',
  'M08 Dependency injection',
  'M09 Change detection',
  'M10 Signals in depth',
  'M11 RxJS',
  'M12 HTTP & interceptors',
  'M13 Forms (3 generations)',
  'M14 Routing',
  'M15 Auth',
  'M16 Lazy loading & @defer',
  'M17 Dynamic components',
  'M18 i18n',
  'M19 Angular Elements',
  'M20 State: NgRx & SignalStore',
  'M21 Animations',
  'M22 Testing',
  'M23 SSR, SSG & deploy',
  'M24 PWA',
  'M25 CLI, schematics & Nx',
  'M26 Senior frontend',
  'M27 Capstone',
  // @@coming
];
