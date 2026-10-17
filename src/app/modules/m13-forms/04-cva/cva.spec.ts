import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CidrInput } from './cidr-input';

@Component({
  imports: [CidrInput, ReactiveFormsModule],
  template: `<aegis-cidr-input [formControl]="control" />`,
})
class Host {
  control = new FormControl('198.51.100.0/24', { nonNullable: true });
}

function setup() {
  const fixture = TestBed.createComponent(Host);
  fixture.autoDetectChanges();
  const el: HTMLElement = fixture.nativeElement;
  return {
    fixture, control: fixture.componentInstance.control,
    ip: el.querySelector('input.ip') as HTMLInputElement,
    prefix: el.querySelector('select.prefix') as HTMLSelectElement,
    size: el.querySelector('.size') as HTMLElement,
  };
}

describe('M13.04 · ControlValueAccessor', () => {
  it('TODO 1: registers as a value accessor (no "No value accessor" error)', () => {
    expect(() => setup()).not.toThrow();
  });

  it('TODO 2: writeValue shows the form value', async () => {
    const { fixture, control, ip, prefix, size } = setup();
    await fixture.whenStable();
    expect(ip.value).toBe('198.51.100.0');
    expect(prefix.value).toBe('24');
    expect(size.textContent).toContain('256 addresses');
    control.setValue('203.0.113.7');
    await fixture.whenStable();
    expect(ip.value).toBe('203.0.113.7');
    expect(prefix.value).toBe('32');
    expect(control.dirty).toBe(false);
  });

  it('TODO 2+4: UI edits flow back to the form; blur marks touched', async () => {
    const { fixture, control, ip, prefix } = setup();
    ip.value = '10.0.0.0'; ip.dispatchEvent(new Event('input'));
    prefix.value = '8'; prefix.dispatchEvent(new Event('change'));
    expect(control.value).toBe('10.0.0.0/8');
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(false);
    ip.dispatchEvent(new Event('blur'));
    expect(control.touched).toBe(true);
    ip.value = ''; ip.dispatchEvent(new Event('input'));
    expect(control.value).toBe('');
    await fixture.whenStable();
  });

  it('TODO 2: disabling the control disables both inputs', async () => {
    const { fixture, control, ip, prefix } = setup();
    control.disable();
    await fixture.whenStable();
    expect(ip.disabled && prefix.disabled).toBe(true);
    control.enable();
    await fixture.whenStable();
    expect(ip.disabled || prefix.disabled).toBe(false);
  });

  it('TODO 3: the component validates its own value', () => {
    const { control, ip } = setup();
    ip.value = '300.1.2.3'; ip.dispatchEvent(new Event('input'));
    expect(control.errors).toEqual({ cidr: { ip: '300.1.2.3' } });
    ip.value = '10.1.2.3'; ip.dispatchEvent(new Event('input'));
    expect(control.errors).toBeNull();
  });
});
