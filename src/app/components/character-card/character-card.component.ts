import { Component, Input } from '@angular/core';
import { Character } from '../../models/character.model';
import { CharacterModalService } from '../../services/character-modal.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  imports: [
    NgClass
  ],
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent {
  // Input property: receives character data from parent component
  @Input() character: Character | undefined;

  constructor(private modalService: CharacterModalService) {}

  /**
   * Opens the character details modal with the selected character.
   */
  openModal() {
    if (this.character) {
      this.modalService.open(this.character);
    }
  }
}
