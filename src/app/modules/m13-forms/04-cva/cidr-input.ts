import { Component, forwardRef, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { IPV4 } from '../indicator-format';

export const PREFIXES = [32, 28, 24, 20, 16, 12, 8];

/** Splits "198.51.100.0/24" into { ip, prefix }. A bare IP means /32. Done for you. */
export function parseCidr(value: string | null | undefined): { ip: string; prefix: number } {
  const [ip = '', bits] = (value ?? '').split('/');
  return { ip, prefix: bits === undefined || bits === '' ? 32 : Number(bits) };
}

@Component({
  selector: 'aegis-cidr-input',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CidrInput), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CidrInput), multi: true },
  ],
  host: { class: 'cidr-input' },
  template: `
    <input class="ip mono" placeholder="198.51.100.0" [value]="ip()" [disabled]="disabled()"
           (input)="onIp($any($event.target).value)" (blur)="touched()" />
    <span class="slash">/</span>
    <select class="prefix" [value]="prefix()" [disabled]="disabled()" (change)="onPrefix(+$any($event.target).value)" (blur)="touched()">
      @for (p of prefixes; track p) { <option [value]="p" [selected]="p === prefix()">{{ p }}</option> }
    </select>
    <small class="muted size">{{ hostCount() }}</small>
  `,
  styles: `:host { display: inline-flex; align-items: center; gap: 4px; } .ip { width: 150px; } .size { margin-left: 8px; }`,
})
export class CidrInput implements ControlValueAccessor, Validator {
  protected readonly prefixes = PREFIXES;
  readonly ip = signal('');
  readonly prefix = signal(32);
  readonly disabled = signal(false);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  hostCount() {
    const n = 2 ** (32 - this.prefix());
    return n === 1 ? 'one host' : `${n.toLocaleString('en-US')} addresses`;
  }

  writeValue(value: string | null): void {
    const { ip, prefix } = parseCidr(value);
    this.ip.set(ip);
    this.prefix.set(prefix);
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
  validate(control: AbstractControl<string>): ValidationErrors | null {
    const { ip } = parseCidr(control.value);
    return !ip || IPV4.test(ip) ? null : { cidr: { ip } };
  }

  onIp(ip: string) {
    this.ip.set(ip.trim());
    this.emit();
  }
  onPrefix(prefix: number) {
    this.prefix.set(prefix);
    this.emit();
  }
  touched() {
    this.onTouched();
  }
  private emit() {
    this.onChange(this.ip() ? `${this.ip()}/${this.prefix()}` : '');
  }
}
