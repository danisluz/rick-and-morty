import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CharacterModalService } from '../../services/character-modal.service';
import { CharacterStoreService } from '../../services/character-store.service';
import { Character } from '../../models/character.model';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-character-modal',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent],
  templateUrl: './character-modal.component.html',
  styleUrls: ['./character-modal.component.scss']
})
export class CharacterModalComponent implements OnInit, OnDestroy {
  // Currently displayed character in the modal
  character: Character | null = null;

  // Controls visibility of the delete confirmation modal
  showConfirmModal = false;

  constructor(
    private modalService: CharacterModalService,
    private storeService: CharacterStoreService,
    private router: Router,
    private toastService: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Subscribe to the character selected for display in the modal
    this.modalService.character$.subscribe(char => this.character = char);
  }

  /**
   * On modal open: disable page scrolling for UX.
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * On modal close: re-enable page scrolling.
   */
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  /**
   * Closes the character modal.
   */
  close() {
    this.modalService.close();
  }

  /**
   * Navigates to the character edit page and closes the modal.
   */
  edit(): void {
    if (this.character) {
      this.router.navigate(['/edit', this.character.id]);
      this.close();
    }
  }

  /**
   * Deletes the character and closes the modal and confirmation dialog.
   */
  deleteCharacter() {
    if (this.character) {
      this.storeService.deleteCharacter(this.character.id);
      this.toastService.show('Character deleted successfully!', 'success');
      this.closeConfirmModal();
      this.close();
    }
  }

  /**
   * Opens the confirmation dialog before deleting.
   */
  openConfirmModal() {
    this.showConfirmModal = true;
  }

  /**
   * Closes the confirmation dialog.
   */
  closeConfirmModal() {
    this.showConfirmModal = false;
  }
}
