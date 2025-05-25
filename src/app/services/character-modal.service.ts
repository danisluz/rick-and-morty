import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterModalService {
  private characterSubject = new BehaviorSubject<Character | null>(null);
  character$ = this.characterSubject.asObservable();

  open(character: Character) {
    this.characterSubject.next(character);
  }

  close() {
    this.characterSubject.next(null);
  }
}
