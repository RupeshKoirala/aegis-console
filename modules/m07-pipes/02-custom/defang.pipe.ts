import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'defang' })
export class DefangPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
//@@sol
    if (!value) return '';
    return value.replace(/^http(s?):\/\//i, 'hxxp$1://').replace(/\./g, '[.]');
//@@stub
    // TODO 1: '' for null/undefined/empty; replace a leading http:// or https:// with hxxp:// / hxxps://,
    //         then replace EVERY "." with "[.]"
    return value ?? '';
//@@end
  }
}
