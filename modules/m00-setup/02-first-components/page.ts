import { Component } from '@angular/core';
//@@sol
import { ConsoleHeader } from './console-header';
import { TenantBadge } from './tenant-badge';
//@@end

@Component({
  selector: 'app-m00-02',
//@@sol
  imports: [ConsoleHeader, TenantBadge],
//@@stub
  // TODO 3: import ConsoleHeader and TenantBadge (TS import at the top AND in this array)
  imports: [],
//@@end
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {}
