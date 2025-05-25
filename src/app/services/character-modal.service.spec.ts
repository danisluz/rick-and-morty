import { TestBed } from '@angular/core/testing';

import { CharacterModalService } from './character-modal.service';

describe('CharacterModalService', () => {
  let service: CharacterModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
