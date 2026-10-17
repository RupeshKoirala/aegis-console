import { Injectable, InjectionToken } from '@angular/core';

export interface AegisConfig { apiBase: string; threshold: number; env: 'dev' | 'staging' | 'prod'; }
export interface FeatureFlags { liveStream: boolean; bulkImport: boolean; }

export const AEGIS_CONFIG = new InjectionToken<AegisConfig>('aegis.config');
export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('aegis.flags');
export const AUDIT_LOGGER = new InjectionToken<Logger>('aegis.audit-logger');

/** prod: conservative; everything else: all features on. */
export function flagsFor(env: AegisConfig['env']): FeatureFlags {
  return env === 'prod' ? { liveStream: true, bulkImport: false } : { liveStream: true, bulkImport: true };
}

export abstract class Logger {
  readonly lines: string[] = [];
  abstract log(message: string): void;
}

@Injectable()
export class ConsoleLogger extends Logger {
  log(message: string) {
    this.lines.push(`[console] ${message}`);
  }
}

@Injectable()
export class SilentLogger extends Logger {
  log(_message: string) {}
}
