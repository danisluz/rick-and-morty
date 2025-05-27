import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CharacterListComponent } from './character-list.component';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { CharacterStoreService } from '../../services/character-store.service';
import { ToastService } from '../../shared/toast.service';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('CharacterListComponent', () => {
  let component: CharacterListComponent;
  let fixture: ComponentFixture<CharacterListComponent>;
  let rickAndMortyService: jasmine.SpyObj<RickAndMortyService>;
  let toastService: jasmine.SpyObj<ToastService>;

  class MockCharacterStoreService {
    private _currentCharacters: any[] = [];

    get currentCharacters() {
      return this._currentCharacters;
    }

    setCharacters = jasmine.createSpy();
    appendCharacters = jasmine.createSpy();
  }

  let mockCharacterStoreService: MockCharacterStoreService;

  beforeEach(async () => {
    rickAndMortyService = jasmine.createSpyObj('RickAndMortyService', ['getCharacters']);

    mockCharacterStoreService = new MockCharacterStoreService();

    toastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [CharacterListComponent],
      providers: [
        { provide: RickAndMortyService, useValue: rickAndMortyService },
        { provide: CharacterStoreService, useValue: mockCharacterStoreService },
        { provide: ToastService, useValue: toastService },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ActivatedRoute, useValue: { params: of({}), queryParams: of({}), snapshot: { params: {}, queryParams: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to top smoothly if browser', () => {
    const scrollSpy = spyOn(window, 'scrollTo');

    component.isBrowser = true;
    component.scrollToTop();

    const args = scrollSpy.calls.mostRecent().args[0];
    expect(args).toEqual(jasmine.objectContaining({ top: 0, behavior: 'smooth' }));
  });

  it('should not scroll if not browser', () => {
    const scrollSpy = spyOn(window, 'scrollTo');

    component.isBrowser = false;
    component.scrollToTop();

    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it('should scrollToTop only when isBrowser is true', () => {
    const scrollSpy = spyOn(window, 'scrollTo').and.callFake(() => {});

    component.isBrowser = false;
    component.scrollToTop();
    expect(scrollSpy).not.toHaveBeenCalled();

    component.isBrowser = true;
    component.scrollToTop();

    expect(scrollSpy).toHaveBeenCalled();
    const args = scrollSpy.calls.mostRecent().args[0];
    expect(args).toEqual(jasmine.objectContaining({ top: 0, behavior: 'smooth' }));
  });
});
