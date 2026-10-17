import { Pipe, PipeTransform } from '@angular/core';
import { calls } from './call-counter';

//@@sol
@Pipe({ name: 'sortByImpure', pure: false })
//@@stub
// TODO 3: make this pipe impure (pure: false) so it re-runs on every change detection pass
@Pipe({ name: 'sortByImpure' })
//@@end
export class SortByImpurePipe implements PipeTransform {
  transform<T>(items: readonly T[], key: keyof T): T[] {
    calls.impure++;
    return [...items].sort((a, b) => String(a[key]).localeCompare(String(b[key])));
  }
}
