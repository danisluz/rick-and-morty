import { TestBed } from '@angular/core/testing';
import { CharacterStoreService } from './character-store.service';
import { Character } from '../models/character.model';

describe('CharacterStoreService', () => {
  let service: CharacterStoreService;

  const mockCharacter1: Character = {
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

  const mockCharacter2: Character = {
    id: '2',
    name: 'Morty Smith',
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
    service = TestBed.inject(CharacterStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set characters', (done) => {
    service.setCharacters([mockCharacter1]);

    service.characters$.subscribe(characters => {
      expect(characters.length).toBe(1);
      expect(characters[0]).toEqual(mockCharacter1);
      done();
    });
  });

  it('should update a character', (done) => {
    service.setCharacters([mockCharacter1]);

    const updatedCharacter = { ...mockCharacter1, name: 'Updated Rick' };
    service.updateCharacter(updatedCharacter);

    service.characters$.subscribe(characters => {
      expect(characters[0].name).toBe('Updated Rick');
      done();
    });
  });

  it('should delete a character', (done) => {
    service.setCharacters([mockCharacter1, mockCharacter2]);

    service.deleteCharacter(mockCharacter1.id.toString());

    service.characters$.subscribe(characters => {
      expect(characters.length).toBe(1);
      expect(characters[0]).toEqual(mockCharacter2);
      done();
    });
  });

  it('should add character at top', (done) => {
    service.setCharacters([mockCharacter2]);

    service.addCharacterAtTop(mockCharacter1);

    service.characters$.subscribe(characters => {
      expect(characters[0]).toEqual(mockCharacter1);
      expect(characters[1]).toEqual(mockCharacter2);
      done();
    });
  });

  it('should append characters', (done) => {
    service.setCharacters([mockCharacter1]);

    service.appendCharacters([mockCharacter2]);

    service.characters$.subscribe(characters => {
      expect(characters.length).toBe(2);
      expect(characters[1]).toEqual(mockCharacter2);
      done();
    });
  });

  it('should get character by id', () => {
    service.setCharacters([mockCharacter1, mockCharacter2]);

    const found = service.getCharacterById(mockCharacter2.id.toString());
    expect(found).toEqual(mockCharacter2);
  });
});
