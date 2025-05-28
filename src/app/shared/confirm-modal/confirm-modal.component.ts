import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  /**
   * Title displayed at the top of the modal.
   */
  @Input() title: string = 'Confirm';

  /**
   * Message body shown to the user.
   */
  @Input() message: string = 'Are you sure you want to continue?';

  /**
   * Label for the confirm action button.
   */
  @Input() confirmText: string = 'Confirm';

  /**
   * Label for the cancel action button.
   */
  @Input() cancelText: string = 'Cancel';

  /**
   * Emits when the user confirms the action.
   */
  @Output() confirm = new EventEmitter<void>();

  /**
   * Emits when the user cancels the modal.
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * Triggers the confirm output.
   */
  confirmAction() {
    this.confirm.emit();
  }

  /**
   * Triggers the cancel output.
   */
  cancelAction() {
    this.cancel.emit();
  }
}
