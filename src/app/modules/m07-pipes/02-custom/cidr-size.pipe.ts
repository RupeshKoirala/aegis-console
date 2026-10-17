import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cidrSize' })
export class CidrSizePipe implements PipeTransform {
  transform(value: string, mode: 'all' | 'hosts' = 'all'): number {
    const bits = value.includes('/') ? Number(value.split('/')[1]) : 32;
    const all = 2 ** (32 - bits);
    if (mode === 'all' || bits >= 31) return all;
    return all - 2;
  }
}
