import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'defang' })
export class DefangPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value.replace(/^http(s?):\/\//i, 'hxxp$1://').replace(/\./g, '[.]');
  }
}
