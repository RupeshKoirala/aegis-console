import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cidrSize' })
export class CidrSizePipe implements PipeTransform {
  transform(value: string, mode: 'all' | 'hosts' = 'all'): number {
    // TODO 2: no "/" → treat as /32. all = 2 ** (32 - bits).
    //         mode 'hosts' subtracts the network + broadcast address (2), except for /31 and /32
    return 0;
  }
}
