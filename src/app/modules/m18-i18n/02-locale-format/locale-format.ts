import { formatDate, formatNumber, registerLocaleData } from '@angular/common';

export const LOCALES = ['en-US', 'fr', 'de', 'ne'] as const;
export type AppLocale = (typeof LOCALES)[number];

/**
 * TODO 1: Angular's formatDate/formatNumber (and the date/number pipes) only know 'en-US' out of the box.
 * Register the others once: registerLocaleData(localeFr) etc. (import from '@angular/common/locales/fr', '/de', '/ne').
 */
export function registerAegisLocales(): void {
}

/** TODO 2: a count with grouping for the locale: 12345 → "12,345" (en-US), "12 345" (fr), "12.345" (de). formatNumber(n, locale, '1.0-0'). */
export function formatCount(n: number, locale: AppLocale): string {
  return String(n);
}

/**
 * TODO 3: an incident timestamp in the ANALYST'S time zone, not the browser's and not UTC:
 *   formatDate(iso, 'yyyy-MM-dd HH:mm', locale, offset)   where offset is like '+0545' (Kathmandu) or '-0400'.
 *   Return it followed by " (UTC+05:45)" so the zone is never ambiguous in an incident report.
 */
export function formatInZone(iso: string, locale: AppLocale, offset: string): string {
  return iso;
}

/**
 * TODO 4: "3 minutes ago" / "il y a 3 minutes" / "vor 3 Minuten". Use Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
 * picking the largest unit that fits: < 60 s → seconds, < 60 min → minutes, < 24 h → hours, else days (negative = past).
 */
export function relativeTime(iso: string, now: Date, locale: AppLocale): string {
  return `${iso} ${now.toISOString()} ${locale}`;
}

/**
 * TODO 5: sort names the way a human expects in that language: accents ignored for ordering ("é" next to "e"),
 * case ignored, and numbers compared as numbers ("feed 2" before "feed 10"). new Intl.Collator(locale, { numeric: true, sensitivity: 'base' }).compare
 */
export function sortNames(names: string[], locale: AppLocale): string[] {
  return [...names].sort();
}
