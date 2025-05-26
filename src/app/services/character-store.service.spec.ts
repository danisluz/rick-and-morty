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

  it('should return currentCharacters correctly', () => {
    service.setCharacters([mockCharacter1]);
    expect(service.currentCharacters).toEqual([mockCharacter1]);
  });

  it('should set characters and update observable', (done) => {
    service.setCharacters([mockCharacter1]);

    service.characters$.subscribe(chars => {
      expect(chars.length).toBe(1);
      expect(chars[0]).toEqual(mockCharacter1);
      done();
    });
  });

  it('should update a character if exists', (done) => {
    service.setCharacters([mockCharacter1]);

    const updatedCharacter = { ...mockCharacter1, name: 'Updated Rick' };
    service.updateCharacter(updatedCharacter);

    service.characters$.subscribe(chars => {
      expect(chars[0].name).toBe('Updated Rick');
      done();
    });
  });

  it('should not update if character does not exist', (done) => {
    service.setCharacters([mockCharacter1]);

    const nonExistingCharacter = { ...mockCharacter2, name: 'Non Existing' };
    service.updateCharacter(nonExistingCharacter);

    service.characters$.subscribe(chars => {
      expect(chars.length).toBe(1);
      expect(chars[0]).toEqual(mockCharacter1);
      done();
    });
  });

  it('should update character when id types differ but values equal', (done) => {
    // id as string in store, but number in update
    service.setCharacters([{ ...mockCharacter1, id: '1' }]);

    const updatedCharacter = { ...mockCharacter1, id: 1 as any, name: 'Updated Rick' };
    service.updateCharacter(updatedCharacter);

    service.characters$.subscribe(chars => {
      expect(chars[0].name).toBe('Updated Rick');
      done();
    });
  });

  it('should delete a character if exists', (done) => {
    service.setCharacters([mockCharacter1, mockCharacter2]);

    service.deleteCharacter(mockCharacter1.id);

    service.characters$.subscribe(chars => {
      expect(chars.length).toBe(1);
      expect(chars[0]).toEqual(mockCharacter2);
      done();
    });
  });

  it('should not delete if character does not exist', (done) => {
    service.setCharacters([mockCharacter1]);

    service.deleteCharacter('999');

    service.characters$.subscribe(chars => {
      expect(chars.length).toBe(1);
      expect(chars[0]).toEqual(mockCharacter1);
      done();
    });
  });

  it('should delete character from empty list gracefully', (done) => {
    service.setCharacters([]);

    service.deleteCharacter('1');

    service.characters$.subscribe(chars => {
      expect(chars.length).toBe(0);
      done();
    });
  });

  it('should add character at top', (done) => {
    service.setCharacters([mockCharacter2]);

    service.addCharacterAtTop(mockCharacter1);

    service.characters$.subscribe(chars => {
      expect(chars[0]).toEqual(mockCharacter1);
      expect(chars[1]).toEqual(mockCharacter2);
      done();
    });
  });

  it('should add character at top when list is empty', (done) => {
    service.setCharacters([]);

    service.addCharacterAtTop(mockCharacter1);

    service.characters$.subscribe(chars => {
      expect(chars.length).toBe(1);
      expect(chars[0]).toEqual(mockCharacter1);
      done();
    });
  });

  it('should append characters', (done) => {
    service.setCharacters([mockCharacter1]);

    service.appendCharacters([mockCharacter2]);

    service.characters$.subscribe(chars => {
      expect(chars.length).toBe(2);
      expect(chars[1]).toEqual(mockCharacter2);
      done();
    });
  });

  it('should append characters to empty list', (done) => {
    service.setCharacters([]);

    service.appendCharacters([mockCharacter1, mockCharacter2]);

    service.characters$.subscribe(chars => {
      expect(chars.length).toBe(2);
      expect(chars[0]).toEqual(mockCharacter1);
      expect(chars[1]).toEqual(mockCharacter2);
      done();
    });
  });

  it('should get character by id if exists', () => {
    service.setCharacters([mockCharacter1, mockCharacter2]);

    const found = service.getCharacterById(mockCharacter2.id);
    expect(found).toEqual(mockCharacter2);
  });

  it('should return undefined if character not found by id', () => {
    service.setCharacters([mockCharacter1]);

    const found = service.getCharacterById('999');
    expect(found).toBeUndefined();
  });

  it('should return undefined if getCharacterById called on empty list', () => {
    service.setCharacters([]);

    const found = service.getCharacterById('1');
    expect(found).toBeUndefined();
  });
});
