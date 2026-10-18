import { formatDate, formatNumber, registerLocaleData } from '@angular/common';
//@@sol
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localeNe from '@angular/common/locales/ne';
//@@end

export const LOCALES = ['en-US', 'fr', 'de', 'ne'] as const;
export type AppLocale = (typeof LOCALES)[number];

/**
 * TODO 1: Angular's formatDate/formatNumber (and the date/number pipes) only know 'en-US' out of the box.
 * Register the others once: registerLocaleData(localeFr) etc. (import from '@angular/common/locales/fr', '/de', '/ne').
 */
export function registerAegisLocales(): void {
//@@sol
  registerLocaleData(localeFr);
  registerLocaleData(localeDe);
  registerLocaleData(localeNe);
//@@end
}

/** TODO 2: a count with grouping for the locale: 12345 → "12,345" (en-US), "12 345" (fr), "12.345" (de). formatNumber(n, locale, '1.0-0'). */
export function formatCount(n: number, locale: AppLocale): string {
//@@sol
  return formatNumber(n, locale, '1.0-0');
//@@stub
  return String(n);
//@@end
}

/**
 * TODO 3: an incident timestamp in the ANALYST'S time zone, not the browser's and not UTC:
 *   formatDate(iso, 'yyyy-MM-dd HH:mm', locale, offset)   where offset is like '+0545' (Kathmandu) or '-0400'.
 *   Return it followed by " (UTC+05:45)" so the zone is never ambiguous in an incident report.
 */
export function formatInZone(iso: string, locale: AppLocale, offset: string): string {
//@@sol
  const label = `UTC${offset.slice(0, 3)}:${offset.slice(3)}`;
  return `${formatDate(iso, 'yyyy-MM-dd HH:mm', locale, offset)} (${label})`;
//@@stub
  return iso;
//@@end
}

/**
 * TODO 4: "3 minutes ago" / "il y a 3 minutes" / "vor 3 Minuten". Use Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
 * picking the largest unit that fits: < 60 s → seconds, < 60 min → minutes, < 24 h → hours, else days (negative = past).
 */
export function relativeTime(iso: string, now: Date, locale: AppLocale): string {
//@@sol
  const seconds = Math.round((new Date(iso).getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const abs = Math.abs(seconds);
  if (abs < 60) return rtf.format(seconds, 'second');
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), 'hour');
  return rtf.format(Math.round(seconds / 86400), 'day');
//@@stub
  return `${iso} ${now.toISOString()} ${locale}`;
//@@end
}

/**
 * TODO 5: sort names the way a human expects in that language: accents ignored for ordering ("é" next to "e"),
 * case ignored, and numbers compared as numbers ("feed 2" before "feed 10"). new Intl.Collator(locale, { numeric: true, sensitivity: 'base' }).compare
 */
export function sortNames(names: string[], locale: AppLocale): string[] {
//@@sol
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  return [...names].sort(collator.compare);
//@@stub
  return [...names].sort();
//@@end
}
