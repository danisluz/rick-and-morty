import { Component, Input } from '@angular/core';
import { Character } from '../../models/character.model';
import { CharacterModalService } from '../../services/character-modal.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  imports: [
    NgClass
  ],
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent {
  @Input() character!: Character;

  constructor(private modalService: CharacterModalService) {}

  openModal() {
    this.modalService.open(this.character);
  }
}
