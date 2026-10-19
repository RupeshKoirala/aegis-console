import { Pipe, PipeTransform } from '@angular/core';
import { calls } from './call-counter';

@Pipe({ name: 'sortBy' })
export class SortByPipe implements PipeTransform {
  transform<T>(items: readonly T[], key: keyof T): T[] {
    calls.pure++;
    return (items as T[]).sort((a, b) => String(a[key]).localeCompare(String(b[key])));
  }
}
