import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterModalService } from '../../services/character-modal.service';
import { CharacterStoreService } from '../../services/character-store.service';
import { Character } from '../../models/character.model';
import {Router} from '@angular/router';
import {ConfirmModalComponent} from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-character-modal',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent],
  templateUrl: './character-modal.component.html',
  styleUrls: ['./character-modal.component.scss']
})
export class CharacterModalComponent {
  character: Character | null = null;
  showConfirmModal = false;

  constructor(
    private modalService: CharacterModalService,
    private storeService: CharacterStoreService,
    private router: Router
  ) {
    this.modalService.character$.subscribe(char => this.character = char);
  }

  close() {
    this.modalService.close();
  }

  edit(): void {
    if (this.character) {
      this.router.navigate(['/edit', this.character.id]);
      this.close();
    }
  }

  deleteCharacter() {
    if (this.character) {
      this.storeService.deleteCharacter(this.character.id);
      this.closeConfirmModal();
      this.close();
    }
  }

  openConfirmModal() {
    console.log('openConfirmModal');
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

}
