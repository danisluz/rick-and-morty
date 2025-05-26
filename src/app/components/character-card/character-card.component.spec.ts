import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterCardComponent } from './character-card.component';
import { CharacterModalService } from '../../services/character-modal.service';

describe('CharacterCardComponent', () => {
  let component: CharacterCardComponent;
  let fixture: ComponentFixture<CharacterCardComponent>;
  let modalService: CharacterModalService;

  class MockCharacterModalService {
    open = jasmine.createSpy('open');
  }

  const mockCharacter = {
    id: '1',
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    image: 'https://example.com/rick.png',
    type: '',
    gender: 'Male'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCardComponent],
      providers: [{ provide: CharacterModalService, useClass: MockCharacterModalService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCardComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(CharacterModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display character data', () => {
    component.character = mockCharacter;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h5')?.textContent).toContain('Rick Sanchez');
    expect(compiled.querySelector('img')?.getAttribute('src')).toBe('https://example.com/rick.png');
  });

  it('should render correct status badge class', () => {
    component.character = { ...mockCharacter, status: 'Alive' };
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.badge');
    expect(badge.classList).toContain('bg-success');

    component.character = { ...mockCharacter, status: 'Dead' };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.badge').classList).toContain('bg-danger');

    component.character = { ...mockCharacter, status: 'unknown' };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.badge').classList).toContain('bg-secondary');
  });

  it('should call openModal on click', () => {
    component.character = mockCharacter;
    fixture.detectChanges();

    const spy = spyOn(component, 'openModal').and.callThrough();

    const card = fixture.nativeElement.querySelector('.card');
    card.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should call CharacterModalService.open with character', () => {
    component.character = mockCharacter;
    fixture.detectChanges();

    component.openModal();

    expect(modalService.open).toHaveBeenCalledWith(mockCharacter);
  });

  it('should handle undefined character safely', () => {
    component.character = undefined;
    fixture.detectChanges();

    component.openModal();

    expect(modalService.open).not.toHaveBeenCalled();

    const compiled = fixture.nativeElement as HTMLElement;

    const title = compiled.querySelector('h5');
    expect(title).not.toBeNull();
    expect(title?.textContent?.trim()).toBe('');
  });


  it('should handle character with empty image', () => {
    component.character = { ...mockCharacter, image: '' };
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');
    expect(img?.getAttribute('src')).toBe('');
  });

  it('should handle character with empty name', () => {
    component.character = { ...mockCharacter, name: '' };
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h5');
    expect(title?.textContent).toBe('');
  });
});
