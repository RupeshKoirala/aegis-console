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
  // TODO 1: register this component as the control's value accessor AND as a validator
  //         (NG_VALUE_ACCESSOR / NG_VALIDATORS, useExisting + forwardRef, multi: true)
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

  // TODO 2: the four ControlValueAccessor methods
  //   writeValue(value)       the FORM → the UI   (parseCidr, set ip + prefix; do NOT call onChange here)
  //   registerOnChange(fn)    keep fn, call it with "ip/prefix" (or '' when ip is empty) whenever the UI changes
  //   registerOnTouched(fn)   keep fn, call it on blur
  //   setDisabledState(b)     reflect into the disabled signal
  writeValue(_value: string | null): void {}
  registerOnChange(_fn: (value: string) => void): void {}
  registerOnTouched(_fn: () => void): void {}
  setDisabledState(_isDisabled: boolean): void {}

  // TODO 3: validate(control): empty is fine (required is the form's decision); an IP part that isn't IPv4 → { cidr: { ip } }
  validate(_control: AbstractControl<string>): ValidationErrors | null {
    return null;
  }

  // TODO 4: the template handlers: update the signal, then tell the form (onChange / onTouched)
  onIp(_ip: string) {}
  onPrefix(_prefix: number) {}
  touched() {}
}
