// The course map. Each module lists the Study Hub lessons to read first and its exercises.
// Done for you; the sidebar and the router are generated from this file.
import { EnvironmentProviders, Provider, Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { M00 } from '../modules/m00-setup/module';
import { M01 } from '../modules/m01-components/module';
import { M02 } from '../modules/m02-modules/module';
import { M03 } from '../modules/m03-practice/module';
import { M04 } from '../modules/m04-debugging/module';
import { M05 } from '../modules/m05-components-deep/module';
import { M06 } from '../modules/m06-directives/module';
import { M07 } from '../modules/m07-pipes/module';
import { M08 } from '../modules/m08-di/module';
import { M09 } from '../modules/m09-change-detection/module';
import { M10 } from '../modules/m10-signals/module';
import { M11 } from '../modules/m11-rxjs/module';
import { M12 } from '../modules/m12-http/module';
import { M13 } from '../modules/m13-forms/module';
import { M14 } from '../modules/m14-routing/module';
import { M15 } from '../modules/m15-auth/module';

export interface Exercise {
  id: string;
  title: string;
  load: () => Promise<Type<unknown>>;
  /** Route-level providers, e.g. an exercise's own HTTP interceptors. */
  providers?: (Provider | EnvironmentProviders)[];
  /** Child routes mounted under the exercise's URL (routing exercises). */
  children?: Routes;
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
  M04,
  M05,
  M06,
  M07,
  M08,
  M09,
  M10,
  M11,
  M12,
  M13,
  M14,
  M15,
  // @@modules
];

export const COMING_SOON: string[] = [
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
