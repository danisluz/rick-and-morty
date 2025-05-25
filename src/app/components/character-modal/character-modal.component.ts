import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterModalService } from '../../services/character-modal.service';
import { CharacterStoreService } from '../../services/character-store.service';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-character-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-modal.component.html',
  styleUrls: ['./character-modal.component.scss']
})
export class CharacterModalComponent {
  character: Character | null = null;

  constructor(
    private modalService: CharacterModalService,
    private storeService: CharacterStoreService
  ) {
    this.modalService.character$.subscribe(char => this.character = char);
  }

  close() {
    this.modalService.close();
  }

  edit() {
    if (!this.character) return;

    const updatedCharacter = { ...this.character, name: this.character.name + ' (Editado)' };
    this.storeService.updateCharacter(updatedCharacter);
    this.close();
  }

  delete() {
    if (!this.character) return;

    this.storeService.deleteCharacter(this.character.id);
    this.close();
  }

}
