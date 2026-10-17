import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(iso: string, nowIso: string): string {
    // TODO 3: < 60 s → 'just now', < 60 min → '20 min ago', < 24 h → '3 h ago', else '2 d ago' (always round down)
    return iso;
  }
}
