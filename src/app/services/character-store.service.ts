import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterStoreService {
  // Holds the current list of characters as an observable state
  private charactersSubject = new BehaviorSubject<Character[]>([]);

  // Observable stream for components to subscribe to character list updates
  characters$ = this.charactersSubject.asObservable();

  constructor() {}

  /**
   * Returns the current character list value (not reactive).
   */
  get currentCharacters(): Character[] {
    return this.charactersSubject.getValue();
  }

  /**
   * Overwrites the character list with a new array.
   * @param characters The new character array
   */
  setCharacters(characters: Character[]): void {
    this.charactersSubject.next(characters);
  }

  /**
   * Updates a character in the list.
   * @param updated The updated character
   */
  updateCharacter(updated: Character): void {
    const updatedList = this.currentCharacters.map(char =>
      char.id.toString() === updated.id.toString() ? { ...updated } : char
    );
    this.setCharacters(updatedList);
  }

  /**
   * Deletes a character by its ID.
   * @param characterId The ID of the character to delete
   */
  deleteCharacter(characterId: string): void {
    const updatedList = this.currentCharacters.filter(char => char.id !== characterId);
    this.setCharacters(updatedList);
  }

  /**
   * Adds a new character at the top of the list.
   * @param character The character to add
   */
  addCharacterAtTop(character: Character): void {
    const updatedList = [character, ...this.currentCharacters];
    this.setCharacters(updatedList);
  }

  /**
   * Appends new characters to the end of the current list.
   * @param newCharacters Characters to append
   */
  appendCharacters(newCharacters: Character[]): void {
    const current = this.charactersSubject.getValue(); // Always gets the most up-to-date value
    const updatedList = [...current, ...newCharacters];
    this.setCharacters(updatedList);
  }

  /**
   * Finds a character by its ID.
   * @param id The character ID
   * @returns Character if found, otherwise undefined
   */
  getCharacterById(id: string): Character | undefined {
    return this.currentCharacters.find(c => c.id === id);
  }
}
