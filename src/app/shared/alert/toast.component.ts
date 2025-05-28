import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  imports: [CommonModule],
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  /**
   * Message to be displayed in the toast.
   */
  @Input() message: string | null = null;

  /**
   * Type of the toast for contextual styling (Bootstrap classes: success, danger, warning, info).
   */
  @Input() type: 'success' | 'danger' | 'warning' | 'info' = 'info';

  /**
   * Closes the toast (sets message to null).
   */
  close() {
    this.message = null;
  }
}
