import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { RickAndMortyService } from './rick-and-morty.service';
import { ToastService } from '../shared/toast.service';
import { CharactersResponse } from '../models/character.model';

describe('RickAndMortyService', () => {
  let service: RickAndMortyService;
  let httpMock: HttpTestingController;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    const toastSpy = jasmine.createSpyObj('ToastService', ['show']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RickAndMortyService,
        { provide: ToastService, useValue: toastSpy }
      ]
    });

    service = TestBed.inject(RickAndMortyService);
    httpMock = TestBed.inject(HttpTestingController);
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get characters successfully with filters', () => {
    const mockResponse: CharactersResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{
        id: '1',
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        type: '',
        image: '',
        origin: { name: '' },
        location: { name: '' }
      }]
    };

    service.getCharacters({ page: 1, name: 'Rick' }).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req =>
      req.url.includes('/character/') && req.params.get('name') === 'Rick'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle 404 error on getCharacters and show warning toast', () => {
    service.getCharacters({ page: 999 }).subscribe(response => {
      expect(response).toBeNull();
      expect(toastServiceSpy.show).toHaveBeenCalledWith('No characters found with filters!', 'warning');
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/?page=999`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle generic error on getCharacters and show danger toast', () => {
    service.getCharacters({ page: 1 }).subscribe({
      next: () => fail('should have failed with error'),
      error: error => {
        expect(error.status).toBe(500);
        expect(toastServiceSpy.show).toHaveBeenCalledWith('Rick and Morty system Error!', 'danger');
      }
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/?page=1`);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should get character by id successfully', () => {
    const mockCharacter = { id: 1, name: 'Rick Sanchez' };

    service.getCharacterById('1').subscribe(response => {
      expect(response).toEqual(mockCharacter);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacter);
  });

  it('should handle error on getCharacterById and show danger toast', () => {
    service.getCharacterById('999').subscribe({
      next: () => fail('should have failed with error'),
      error: error => {
        expect(error.status).toBe(500);
        expect(toastServiceSpy.show).toHaveBeenCalledWith('Error searching for character!', 'danger');
      }
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/999`);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  // Extra: test empty filters (page only)
  it('should call getCharacters with only page filter when others are empty', () => {
    const mockResponse: CharactersResponse = {
      info: { count: 0, pages: 0, next: null, prev: null },
      results: []
    };

    service.getCharacters({ page: 1, name: '', species: '', gender: '', status: '' }).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req =>
      req.url.includes('/character/') &&
      !req.params.has('name') &&
      !req.params.has('species') &&
      !req.params.has('gender') &&
      !req.params.has('status')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
