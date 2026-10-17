import { Component } from '@angular/core';
import { ConsoleHeader } from './console-header';
import { TenantBadge } from './tenant-badge';

@Component({
  selector: 'app-m00-02',
  imports: [ConsoleHeader, TenantBadge],
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {}
