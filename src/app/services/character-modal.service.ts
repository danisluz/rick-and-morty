import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterModalService {
  // Holds the current character to display in the modal, or null if closed
  private characterSubject = new BehaviorSubject<Character | null>(null);

  // Observable to be used by components to react to modal open/close events
  character$ = this.characterSubject.asObservable();

  /**
   * Opens the modal with the given character.
   * @param character Character to display in the modal
   */
  open(character: Character) {
    this.characterSubject.next(character);
  }

  /**
   * Closes the modal.
   */
  close() {
    this.characterSubject.next(null);
  }
}
