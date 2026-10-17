// Re-exported so this exercise doesn't depend on your M12.02 code.
import { HttpErrorResponse } from '@angular/common/http';
import { Problem } from '../../../shared/domain/models';

export function toProblem(err: unknown): Problem {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return { title: 'Server unreachable', status: 0, detail: 'Check your connection and try again.', instance: err.url ?? '' };
    if (err.error && typeof err.error === 'object' && 'title' in err.error) return err.error as Problem;
    return { title: err.statusText || 'Error', status: err.status, detail: `Request failed with status ${err.status}`, instance: err.url ?? '' };
  }
  return { title: 'Unexpected error', status: -1, detail: String(err), instance: '' };
}
