import { Routes } from '@angular/router';
import { ListDetail, ListIndex } from './list-detail';

/** TODO 1: '' → redirect to 'lists', 'lists' → ListIndex, 'lists/:listId' → ListDetail. */
export const LIST_ROUTES: Routes = [
  { path: '', component: ListIndex },
];
