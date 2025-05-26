import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageSubject = new BehaviorSubject<string | null>(null);
  private typeSubject = new BehaviorSubject<'success' | 'danger' | 'warning' | 'info'>('info');

  message$ = this.messageSubject.asObservable();
  type$ = this.typeSubject.asObservable();

  show(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') {
    this.messageSubject.next(message);
    this.typeSubject.next(type);

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  clear() {
    this.messageSubject.next(null);
  }
}
