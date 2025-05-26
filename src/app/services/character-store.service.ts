import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterStoreService {
  private charactersSubject = new BehaviorSubject<Character[]>([]);
  characters: Character[] = [];

  characters$ = this.charactersSubject.asObservable();

  get currentCharacters(): Character[] {
    return this.charactersSubject.getValue();
  }

  constructor() {}

  setCharacters(characters: Character[]): void {
    this.charactersSubject.next(characters);
  }

  updateCharacter(updated: Character): void {
    const updatedList = this.currentCharacters.map(char =>
      char.id === updated.id ? updated : char
    );
    this.setCharacters(updatedList);
  }


  deleteCharacter(characterId: string): void {
    const updatedList = this.currentCharacters.filter(char => char.id !== characterId);
    this.setCharacters(updatedList);
  }


  addCharacterAtTop(character: Character): void {
    const updatedList = [character, ...this.currentCharacters];
    this.setCharacters(updatedList);
  }

  appendCharacters(newCharacters: Character[]): void {
    const current = this.charactersSubject.getValue();  // PEGA valor mais atualizado.
    const updatedList = [...current, ...newCharacters];
    this.setCharacters(updatedList);
  }

  getCharacterById(id: string): Character | undefined {
    return this.currentCharacters.find(c => c.id === id);
  }

}
