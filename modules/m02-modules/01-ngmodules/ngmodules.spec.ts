import { TestBed } from '@angular/core/testing';
import { RoleBadgeComponent } from './role-badge.component';
import { InitialsPipe } from './initials.pipe';
import { UserTableComponent } from './user-table.component';
import { Page } from './page';


describe('M02.01 · NgModules', () => {
  it('TODO 1 + 2: UserTable (declared in AdminModule) can see the badge and pipe exported by SharedModule', () => {
    const cmp = (UserTableComponent as any).ɵcmp;
    const directives = typeof cmp.directiveDefs === 'function' ? cmp.directiveDefs() : [];
    const pipes = typeof cmp.pipeDefs === 'function' ? cmp.pipeDefs() : [];
    expect(directives, 'declare UserTable in AdminModule, import SharedModule, export the badge').toContain((RoleBadgeComponent as any).ɵcmp);
    expect(pipes, 'SharedModule must declare AND export InitialsPipe').toContain((InitialsPipe as any).ɵpipe);
  });

  it('TODO 3 + 4: the standalone page renders the module-based table with badge + pipe', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const el: HTMLElement = f.nativeElement;
    const rows = el.querySelectorAll('aegis-user-table tr.user-row');
    expect(rows.length).toBe(3);
    expect(rows[1].querySelector('.avatar')?.textContent).toBe('AA');
    expect(rows[2].querySelector('aegis-role-badge .role')?.textContent).toBe('READ ONLY');
  });

});
