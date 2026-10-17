import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cidrSize' })
export class CidrSizePipe implements PipeTransform {
  transform(value: string, mode: 'all' | 'hosts' = 'all'): number {
//@@sol
    const bits = value.includes('/') ? Number(value.split('/')[1]) : 32;
    const all = 2 ** (32 - bits);
    if (mode === 'all' || bits >= 31) return all;
    return all - 2;
//@@stub
    // TODO 2: no "/" → treat as /32. all = 2 ** (32 - bits).
    //         mode 'hosts' subtracts the network + broadcast address (2), except for /31 and /32
    return 0;
//@@end
  }
}
