import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterFormComponent } from './character-form.component';
import { CharacterStoreService } from '../../services/character-store.service';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastService } from '../../shared/toast.service';

describe('CharacterFormComponent', () => {
  let component: CharacterFormComponent;
  let fixture: ComponentFixture<CharacterFormComponent>;

  class MockCharacterStoreService {
    getCharacterById = jasmine.createSpy().and.returnValue(undefined);
    updateCharacter = jasmine.createSpy();
    addCharacterAtTop = jasmine.createSpy();
  }

  class MockRickAndMortyService {
    getCharacterById = jasmine.createSpy().and.returnValue({ subscribe: () => {} });
  }

  class MockRouter {
    navigate = jasmine.createSpy();
  }

  class MockActivatedRoute {
    snapshot = { paramMap: new Map().set('id', null) };
  }

  class MockLocation {
    back = jasmine.createSpy();
  }

  class MockToastService {
    show = jasmine.createSpy();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFormComponent],
      providers: [
        { provide: CharacterStoreService, useClass: MockCharacterStoreService },
        { provide: RickAndMortyService, useClass: MockRickAndMortyService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Location, useClass: MockLocation },
        { provide: ToastService, useClass: MockToastService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
