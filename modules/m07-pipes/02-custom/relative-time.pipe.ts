import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(iso: string, nowIso: string): string {
//@@sol
    const seconds = Math.floor((Date.parse(nowIso) - Date.parse(iso)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h ago`;
    return `${Math.floor(hours / 24)} d ago`;
//@@stub
    // TODO 3: < 60 s → 'just now', < 60 min → '20 min ago', < 24 h → '3 h ago', else '2 d ago' (always round down)
    return iso;
//@@end
  }
}
