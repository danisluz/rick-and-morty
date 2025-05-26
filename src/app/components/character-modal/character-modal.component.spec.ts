import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterModalComponent } from './character-modal.component';
import { CharacterModalService } from '../../services/character-modal.service';
import { CharacterStoreService } from '../../services/character-store.service';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/toast.service';

describe('CharacterModalComponent', () => {
  let component: CharacterModalComponent;
  let fixture: ComponentFixture<CharacterModalComponent>;

  class MockCharacterModalService {
    character$ = { subscribe: (fn: any) => fn(null) };
    close = jasmine.createSpy();
  }

  class MockCharacterStoreService {
    deleteCharacter = jasmine.createSpy();
  }

  class MockRouter {
    navigate = jasmine.createSpy();
  }

  class MockToastService {
    show = jasmine.createSpy();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterModalComponent],
      providers: [
        { provide: CharacterModalService, useClass: MockCharacterModalService },
        { provide: CharacterStoreService, useClass: MockCharacterStoreService },
        { provide: Router, useClass: MockRouter },
        { provide: ToastService, useClass: MockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
