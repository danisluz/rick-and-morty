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

  it('should load characters successfully on loadCharacters (page 1)', () => {
    const mockResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{
        id: '1',
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        image: '',
        origin: { name: '' },
        location: { name: '' }
      }]
    };

    rickAndMortyService.getCharacters.and.returnValue(of(mockResponse));
    component.currentPage = 1;

    component.loadCharacters();

    expect(rickAndMortyService.getCharacters).toHaveBeenCalledWith(jasmine.objectContaining({ page: 1 }));
    expect(mockCharacterStoreService.setCharacters).toHaveBeenCalledWith(mockResponse.results);
    expect(component.info).toEqual(mockResponse.info);
    expect(component.currentPage).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should append characters on loadCharacters if page > 1', () => {
    const mockResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{
        id: '1',
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        image: '',
        origin: { name: '' },
        location: { name: '' }
      }]
    };

    rickAndMortyService.getCharacters.and.returnValue(of(mockResponse));
    component.currentPage = 2;

    component.loadCharacters();

    expect(mockCharacterStoreService.appendCharacters).toHaveBeenCalledWith(mockResponse.results);
    expect(component.currentPage).toBe(3);
  });

  it('should clear characters and info if no results on first page', () => {
    const mockResponse = {
      info: {
        count: 0,
        pages: 0,
        next: null,
        prev: null
      },
      results: []
    };

    rickAndMortyService.getCharacters.and.returnValue(of(mockResponse));
    component.currentPage = 1;

    component.loadCharacters();

    expect(mockCharacterStoreService.setCharacters).toHaveBeenCalledWith([]);
    expect(component.info).toBeNull();
  });

  it('should show warning toast if no results found on pages > 1', () => {
    const mockResponse = {
      info: {
        count: 0,
        pages: 0,
        next: null,
        prev: null
      },
      results: []
    };

    rickAndMortyService.getCharacters.and.returnValue(of(mockResponse));
    component.currentPage = 2;

    component.loadCharacters();

    expect(toastService.show).toHaveBeenCalledWith('No results found for next page!', 'warning');
  });

  it('should show error toast on loadCharacters error', () => {
    rickAndMortyService.getCharacters.and.returnValue(throwError(() => new Error('API error')));

    component.loadCharacters();

    expect(toastService.show).toHaveBeenCalledWith('Error when searching for characters!', 'danger');
    expect(component.loading).toBeFalse();
  });

  it('should handle loadCharacters with null/undefined response gracefully', () => {
    rickAndMortyService.getCharacters.and.returnValue(of(null as any));
    component.loadCharacters();
    expect(component.loading).toBeFalse();

    rickAndMortyService.getCharacters.and.returnValue(of(undefined as any));
    component.loadCharacters();
    expect(component.loading).toBeFalse();
  });

  it('should apply filters reset page and call loadCharacters', () => {
    spyOn(component, 'loadCharacters');

    component.applyFilters();

    expect(component.currentPage).toBe(1);
    expect(component.loadCharacters).toHaveBeenCalled();
  });

  it('should debounce onNameChange and apply filters', fakeAsync(() => {
    spyOn(component, 'applyFilters');

    component.onNameChange('Rick');
    tick(300);

    expect(component.filters.name).toBe('Rick');
    expect(component.applyFilters).toHaveBeenCalled();
  }));

  it('should load more characters successfully', () => {
    const mockResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{ id: '3', name: 'Summer', status: 'Alive', species: 'Human', type: '', gender: 'Female', image: '', origin: { name: '' }, location: { name: '' } }]
    };

    rickAndMortyService.getCharacters.and.returnValue(of(mockResponse));

    component.currentPage = 1; // define antes
    mockCharacterStoreService.appendCharacters = jasmine.createSpy(); // garante spy configurado

    component.loadMore();

    expect(rickAndMortyService.getCharacters).toHaveBeenCalledWith(jasmine.objectContaining({ page: 1 }));
    expect(mockCharacterStoreService.appendCharacters).toHaveBeenCalledWith(mockResponse.results);
    expect(component.currentPage).toBe(2); // espera que incremente após loadMore
    expect(component.isLoading).toBeFalse();
  });


  it('should show warning toast if no more characters to load on loadMore', () => {
    rickAndMortyService.getCharacters.and.returnValue(of({
        info: {
          count: 0,
          pages: 0,
          next: null,
          prev: null
        },
        results: []
      })
    );
    component.loadMore();

    expect(toastService.show).toHaveBeenCalledWith('No more characters to load.', 'warning');
    expect(component.isLoading).toBeFalse();
  });

  it('should show error toast on loadMore error', () => {
    rickAndMortyService.getCharacters.and.returnValue(throwError(() => new Error('Failed')));

    component.loadMore();

    expect(toastService.show).toHaveBeenCalledWith('Failed to load more characters. Please try again later.', 'danger');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle onScroll and call loadMore when near bottom', () => {
    spyOn(component, 'loadMore');
    spyOnProperty(window, 'innerHeight').and.returnValue(1000);
    spyOnProperty(window, 'scrollY').and.returnValue(900);
    spyOnProperty(document.body, 'offsetHeight').and.returnValue(1900);

    component.loading = false;
    component.isLoading = false;
    component.isBrowser = true;

    component.onScroll();

    expect(component.loadMore).toHaveBeenCalled();
    expect(component.showBackToTop).toBeFalse();
  });

  it('should set showBackToTop true if scroll past 500px', () => {
    spyOnProperty(window, 'pageYOffset').and.returnValue(600);

    component.isBrowser = true;
    component.loading = false;
    component.isLoading = false;

    component.onScroll();

    expect(component.showBackToTop).toBeTrue();
  });

  it('should do nothing onScroll if not browser or loading', () => {
    component.isBrowser = false;
    component.loading = false;
    component.isLoading = false;

    component.onScroll();
    expect(component.showBackToTop).toBeFalse();

    component.isBrowser = true;
    component.loading = true;
    component.isLoading = false;

    component.onScroll();
    expect(component.showBackToTop).toBeFalse();

    component.loading = false;
    component.isLoading = true;

    component.onScroll();
    expect(component.showBackToTop).toBeFalse();
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

  it('should unsubscribe nameChanged$ on destroy', () => {
    component['nameChangedSub'] = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.ngOnDestroy();
    expect(component['nameChangedSub'].unsubscribe).toHaveBeenCalled();
  });

});
