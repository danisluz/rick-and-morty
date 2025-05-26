import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterModalService } from '../../services/character-modal.service';
import { CharacterStoreService } from '../../services/character-store.service';
import { Character } from '../../models/character.model';
import {Router} from '@angular/router';

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

  delete() {
    if (this.character && confirm('Tem certeza que deseja excluir este personagem?')) {
      this.storeService.deleteCharacter(this.character.id);
      this.close();
    }
  }


}
