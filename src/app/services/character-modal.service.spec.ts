import { TestBed } from '@angular/core/testing';
import { CharacterModalService } from './character-modal.service';
import { Character } from '../models/character.model';
import {take} from 'rxjs';

describe('CharacterModalService', () => {
  let service: CharacterModalService;

  const mockCharacter: Character = {
    id: '1',
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    type: '',
    image: '',
    origin: { name: '' },
    location: { name: '' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open modal with character', (done) => {
    service.character$.subscribe(character => {
      if (character) { // garante que pegou a emissão do open()
        expect(character).toEqual(mockCharacter);
        done();
      }
    });

    service.open(mockCharacter);
  });

  it('should close modal', (done) => {
    service.character$.pipe(take(1)).subscribe(char => {
      expect(char).toBeNull();
      done();
    });

    service.close();
  });
});
