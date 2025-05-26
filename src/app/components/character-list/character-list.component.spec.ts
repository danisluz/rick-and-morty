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

  const mockActivatedRoute = {
    params: of({}),
    queryParams: of({}),
    snapshot: {
      params: {},
      queryParams: {}
    }
  };

  const mockCharacter = {
    id: '1',
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    image: 'https://example.com/rick.png',
    type: '',
    gender: 'Male'
  };

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
    rickAndMortyService.getCharacters.and.returnValue(of({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: []
    }));

    mockCharacterStoreService = new MockCharacterStoreService();

    toastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [CharacterListComponent],
      providers: [
        { provide: RickAndMortyService, useValue: rickAndMortyService },
        { provide: CharacterStoreService, useValue: mockCharacterStoreService },
        { provide: ToastService, useValue: toastService },
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

  it('should load characters successfully', () => {
    const mockResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [mockCharacter]
    };
    rickAndMortyService.getCharacters.and.returnValue(of(mockResponse));

    component.loadCharacters();

    expect(rickAndMortyService.getCharacters).toHaveBeenCalled();
    expect(mockCharacterStoreService.setCharacters).toHaveBeenCalledWith(mockResponse.results);
  });

  it('should handle error when loadCharacters fails', () => {
    rickAndMortyService.getCharacters.and.returnValue(throwError(() => new Error('API error')));

    component.loadCharacters();

    expect(toastService.show).toHaveBeenCalledWith('Error when searching for characters!', 'danger');
    expect(component.loading).toBeFalse();
  });

  it('should handle loadCharacters with null response', () => {
    rickAndMortyService.getCharacters.and.returnValue(of(null as any));

    component.loadCharacters();

    expect(component.loading).toBeFalse();
  });

  it('should apply filters and reset page', () => {
    spyOn(component, 'loadCharacters');

    component.applyFilters();

    expect(component.currentPage).toBe(1);
    expect(component.loadCharacters).toHaveBeenCalled();
  });

  it('should handle onNameChange with debounce', fakeAsync(() => {
    spyOn(component, 'applyFilters');

    component.onNameChange('Morty');

    tick(300);

    expect(component.filters.name).toBe('Morty');
    expect(component.applyFilters).toHaveBeenCalled();
  }));

  it('should handle onNameChange with empty string', fakeAsync(() => {
    spyOn(component, 'applyFilters');

    component.onNameChange('');

    tick(300);

    expect(component.filters.name).toBe('');
    expect(component.applyFilters).toHaveBeenCalled();
  }));

  it('should load more characters', () => {
    const mockResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [mockCharacter]
    };
    rickAndMortyService.getCharacters.and.returnValue(of(mockResponse));

    component.loadMore();

    expect(rickAndMortyService.getCharacters).toHaveBeenCalled();
    expect(mockCharacterStoreService.appendCharacters).toHaveBeenCalledWith(mockResponse.results);
    expect(component.currentPage).toBeGreaterThan(1);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle loadMore with no results', () => {
    rickAndMortyService.getCharacters.and.returnValue(of(null as any));

    component.loadMore();

    expect(rickAndMortyService.getCharacters).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should show warning when no results found for next page', () => {
    rickAndMortyService.getCharacters.and.returnValue(of({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: []
    }));

    component.currentPage = 2;  // Simula página > 1
    component.loadCharacters();

    expect(toastService.show).toHaveBeenCalledWith('No results found for next page!', 'warning');
  });

  it('should set empty characters when no results on first page', () => {
    rickAndMortyService.getCharacters.and.returnValue(of({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: []
    }));

    component.currentPage = 1;
    component.loadCharacters();

    expect(mockCharacterStoreService.setCharacters).toHaveBeenCalledWith([]);
    expect(component.info).toBeNull();
  });

  it('should handle onScroll and show back to top', () => {
    spyOnProperty(window, 'pageYOffset').and.returnValue(600);

    component.onScroll();

    expect(component.showBackToTop).toBeTrue();
  });

  it('should not do anything if not browser in onScroll', () => {
    component.isBrowser = false;

    component.showBackToTop = false;

    component.onScroll();

    expect(component.showBackToTop).toBeFalse();
  });

  it('should scroll to top', () => {
    const scrollSpy = spyOn(window, 'scrollTo');

    component.scrollToTop();

    const args = scrollSpy.calls.mostRecent().args[0];

    expect(args).toEqual(jasmine.objectContaining({
      top: 0,
      behavior: 'smooth'
    }));
  });

  it('should not scroll if not browser', () => {
    component.isBrowser = false;

    const scrollSpy = spyOn(window, 'scrollTo');

    component.scrollToTop();

    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it('should unsubscribe from nameChanged$ on destroy', () => {
    component['nameChangedSub'] = jasmine.createSpyObj('Subscription', ['unsubscribe']);

    component.ngOnDestroy();

    expect(component['nameChangedSub'].unsubscribe).toHaveBeenCalled();
  });


  it('should handle loadMore with empty results', () => {
    rickAndMortyService.getCharacters.and.returnValue(of({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: []
    }));

    component.loadMore();

    expect(rickAndMortyService.getCharacters).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should handle loadCharacters with undefined response', () => {
    rickAndMortyService.getCharacters.and.returnValue(of(undefined as any));

    component.loadCharacters();

    expect(component.loading).toBeFalse();
  });

  it('should handle loadCharacters with undefined results', () => {
    rickAndMortyService.getCharacters.and.returnValue(of({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: []
    }));

    component.currentPage = 2;

    component.loadCharacters();

    expect(toastService.show).toHaveBeenCalledWith('No results found for next page!', 'warning');
    expect(component.loading).toBeFalse();
  });
});
