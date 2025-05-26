import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RickAndMortyService } from './rick-and-morty.service';
import { ToastService } from '../shared/toast.service';
import { CharactersResponse } from '../models/character.model';

describe('RickAndMortyService', () => {
  let service: RickAndMortyService;
  let httpMock: HttpTestingController;
  let toastService: ToastService;

  class MockToastService {
    show(message: string, type: string) {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RickAndMortyService,
        { provide: ToastService, useClass: MockToastService }
      ]
    });

    service = TestBed.inject(RickAndMortyService);
    httpMock = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get characters successfully', () => {
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

    service.getCharacters({ page: 1 }).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/?page=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle 404 error on getCharacters', () => {
    spyOn(toastService, 'show');

    service.getCharacters({ page: 999 }).subscribe(response => {
      expect(response).toBeNull();
      expect(toastService.show).toHaveBeenCalledWith('No characters found with filters!', 'warning');
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/?page=999`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
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

  it('should handle error on getCharacterById', () => {
    spyOn(toastService, 'show');

    service.getCharacterById('999').subscribe({
      next: () => fail('should have failed with error'),
      error: error => {
        expect(error.status).toBe(500);
        expect(toastService.show).toHaveBeenCalledWith('Error searching for character!', 'danger');
      }
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/999`);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});
