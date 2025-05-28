import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Holds the current toast message (null if not visible)
  private messageSubject = new BehaviorSubject<string | null>(null);

  // Holds the current toast type (for contextual styling)
  private typeSubject = new BehaviorSubject<'success' | 'danger' | 'warning' | 'info'>('info');

  // Observable streams for toast message and type
  message$ = this.messageSubject.asObservable();
  type$ = this.typeSubject.asObservable();

  /**
   * Shows a toast message of a given type. Automatically hides after 3 seconds.
   * @param message The message to display
   * @param type Type of the toast (success, danger, warning, info)
   */
  show(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') {
    this.messageSubject.next(message);
    this.typeSubject.next(type);

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  /**
   * Clears the toast message (hides the toast).
   */
  clear() {
    this.messageSubject.next(null);
  }
}
