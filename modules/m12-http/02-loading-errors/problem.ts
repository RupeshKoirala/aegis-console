import { HttpErrorResponse } from '@angular/common/http';
import { Problem } from '../../../shared/domain/models';

export function toProblem(err: unknown): Problem {
//@@sol
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return { title: 'Server unreachable', status: 0, detail: 'Check your connection and try again.', instance: err.url ?? '' };
    }
    const body = err.error;
    if (body && typeof body === 'object' && 'title' in body && 'status' in body) return body as Problem;
    return { title: err.statusText || 'Error', status: err.status, detail: `Request failed with status ${err.status}`, instance: err.url ?? '' };
  }
  return { title: 'Unexpected error', status: -1, detail: err instanceof Error ? err.message : String(err), instance: '' };
//@@stub
  // TODO 1: normalise into a Problem:
  //   - HttpErrorResponse with status 0 → { title: 'Server unreachable', status: 0, detail: 'Check your connection and try again.', instance: err.url ?? '' }
  //   - HttpErrorResponse whose .error body has `title` and `status` → return that body as the Problem
  //   - other HttpErrorResponse → { title: err.statusText || 'Error', status: err.status, detail: `Request failed with status ${err.status}`, instance: err.url ?? '' }
  //   - anything else → { title: 'Unexpected error', status: -1, detail: (Error message or String(err)), instance: '' }
  return { title: '', status: -1, detail: '', instance: '' };
//@@end
}
