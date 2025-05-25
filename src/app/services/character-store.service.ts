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
    return [...this.characters];
  }

  constructor() {}

  setCharacters(characters: Character[]) {
    this.characters = characters;
    this.charactersSubject.next([...this.characters]);
  }

  updateCharacter(updatedCharacter: Character) {
    this.characters = this.characters.map(char =>
      char.id === updatedCharacter.id ? updatedCharacter : char
    );
    this.charactersSubject.next([...this.characters]);
  }

  deleteCharacter(characterId: string) {
    this.characters = this.characters.filter((char: Character) => char.id !== characterId);
    this.charactersSubject.next([...this.characters]);
  }

  addCharacterAtTop(character: Character) {
    this.characters = [character, ...this.characters];
    this.charactersSubject.next([...this.characters]);
  }

}
