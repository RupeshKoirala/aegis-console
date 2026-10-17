import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListView } from '../../../shared/domain/models';

@Component({
  selector: 'app-resolved-list',
  imports: [DatePipe],
  template: `
    <h2 class="name">{{ list().name }} <span class="badge">{{ list().kind }}</span></h2>
    <p>{{ list().indicatorCount }} indicators · created {{ list().createdAt | date: 'mediumDate' }}</p>
    <p class="muted">{{ list().description }}</p>
  `,
})
export class ResolvedList {
  /** The resolver's result, bound by key ('list') through withComponentInputBinding. It is never undefined here. */
  readonly list = input.required<ListView>();
}

@Component({
  selector: 'app-list-not-found',
  imports: [RouterLink],
  template: `<h2 class="nf">That list doesn't exist (or isn't yours).</h2><a routerLink="../lists/2">Manual blocks</a>`,
})
export class ListNotFound {}
