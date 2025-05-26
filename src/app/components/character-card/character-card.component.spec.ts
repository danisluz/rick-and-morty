import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterCardComponent } from './character-card.component';
import { CharacterModalService } from '../../services/character-modal.service';

describe('CharacterCardComponent', () => {
  let component: CharacterCardComponent;
  let fixture: ComponentFixture<CharacterCardComponent>;

  class MockCharacterModalService {
    open(character: any) {}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCardComponent],
      providers: [{ provide: CharacterModalService, useClass: MockCharacterModalService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
