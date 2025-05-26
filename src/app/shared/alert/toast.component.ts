import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  imports: [CommonModule],
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  @Input() message: string | null = null;
  @Input() type: 'success' | 'danger' | 'warning' | 'info' = 'info';

  close() {
    this.message = null;
  }
}
