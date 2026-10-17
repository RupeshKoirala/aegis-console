import { Component } from '@angular/core';
import { TreeNode } from './tree-node';
import { DarkProbeWrapper, ThemeProbe } from './theme-probe';

@Component({
  selector: 'app-m08-03',
  imports: [TreeNode, ThemeProbe, DarkProbeWrapper],
  template: `
    <h1>Tenant tree</h1>
    <section class="card tree">
      <aegis-tree-node name="Shieldline MSP">
        <aegis-tree-node name="Acme Schools">
          <aegis-tree-node name="Main campus" />
          <aegis-tree-node name="North campus" />
        </aegis-tree-node>
        <aegis-tree-node name="Globex Health" />
      </aegis-tree-node>
    </section>
    <h3>Theme probes</h3>
    <aegis-theme-probe class="top" />
    <aegis-dark-probe />
  `,
})
export class Page {}
