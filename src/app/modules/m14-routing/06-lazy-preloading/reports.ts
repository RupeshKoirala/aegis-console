import { Component } from '@angular/core';
import { markLoaded } from './chunk-log';

markLoaded('reports');

@Component({ selector: 'app-reports', template: `<h2 class="reports">Weekly report</h2><p>1,204 blocks · 37 alerts</p>` })
export default class Reports {}
