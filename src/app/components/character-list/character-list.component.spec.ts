import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterListComponent } from './character-list.component';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { CharacterStoreService } from '../../services/character-store.service';
import { ToastService } from '../../shared/toast.service';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CharacterListComponent', () => {
  let component: CharacterListComponent;
  let fixture: ComponentFixture<CharacterListComponent>;

  class MockRickAndMortyService {
    getCharacters = jasmine.createSpy().and.returnValue({ subscribe: () => {} });
  }

  class MockCharacterStoreService {
    currentCharacters = [];
    setCharacters = jasmine.createSpy();
    appendCharacters = jasmine.createSpy();
  }

  class MockToastService {
    show = jasmine.createSpy();
  }

  const mockActivatedRoute = {
    params: of({}),
    queryParams: of({}),
    snapshot: {
      params: {},
      queryParams: {}
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterListComponent],
      providers: [
        { provide: RickAndMortyService, useClass: MockRickAndMortyService },
        { provide: CharacterStoreService, useClass: MockCharacterStoreService },
        { provide: ToastService, useClass: MockToastService },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
