import { Pipe, PipeTransform } from '@angular/core';

// Gen 1: a non-standalone pipe, also declared in SharedModule.
@Pipe({ name: 'initials', standalone: false })
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    return name.split(/\s+/).filter(Boolean).map(p => p[0].toUpperCase()).slice(0, 2).join('');
  }
}
