import { Pipe, PipeTransform } from '@angular/core';
import { calls } from './call-counter';

@Pipe({ name: 'sortByImpure', pure: false })
export class SortByImpurePipe implements PipeTransform {
  transform<T>(items: readonly T[], key: keyof T): T[] {
    calls.impure++;
    return [...items].sort((a, b) => String(a[key]).localeCompare(String(b[key])));
  }
}
