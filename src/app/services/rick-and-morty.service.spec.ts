import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RickAndMortyService } from './rick-and-morty.service';
import { ToastService } from '../shared/toast.service';
import { CharactersResponse } from '../models/character.model';

describe('RickAndMortyService', () => {
  let service: RickAndMortyService;
  let httpMock: HttpTestingController;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RickAndMortyService,
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    });

    service = TestBed.inject(RickAndMortyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle 404 error on getCharacters and show warning toast', (done) => {
    service.getCharacters({ page: 999 }).subscribe(response => {
      expect(response).toBeNull();
      expect(toastServiceSpy.show).toHaveBeenCalledWith('No characters found with filters!', 'warning');
      done();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/?page=999`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle generic error on getCharacters and show danger toast', (done) => {
    service.getCharacters({ page: 1 }).subscribe({
      next: () => fail('should have failed with error'),
      error: error => {
        expect(error.status).toBe(500);
        expect(toastServiceSpy.show).toHaveBeenCalledWith('Rick and Morty system Error!', 'danger');
        done();
      }
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/?page=1`);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle non-HttpErrorResponse error (no status) in getCharacters', (done) => {
    // Simula erro SEM status (ex: erro de rede)
    const errorEvent = new ErrorEvent('Network error');

    service.getCharacters({ page: 1 }).subscribe({
      next: () => fail('should have failed'),
      error: err => {
        expect(toastServiceSpy.show).toHaveBeenCalledWith('Rick and Morty system Error!', 'danger');
        done();
      }
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/?page=1`);
    req.error(errorEvent as any);
  });

  it('should handle error on getCharacterById and show danger toast', (done) => {
    service.getCharacterById('999').subscribe({
      next: () => fail('should have failed with error'),
      error: error => {
        expect(error.status).toBe(500);
        expect(toastServiceSpy.show).toHaveBeenCalledWith('Error searching for character!', 'danger');
        done();
      }
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/999`);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });


  it('should handle getCharacterById with empty id and show error toast', (done) => {
    service.getCharacterById('').subscribe({
      next: () => fail('should have failed'),
      error: error => {
        expect(toastServiceSpy.show).toHaveBeenCalledWith('Error searching for character!', 'danger');
        done();
      }
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle 404 error on getCharacterById and show danger toast', (done) => {
    service.getCharacterById('404').subscribe({
      next: () => fail('should have failed with error'),
      error: error => {
        expect(error.status).toBe(404);
        expect(toastServiceSpy.show).toHaveBeenCalledWith('Error searching for character!', 'danger');
        done();
      }
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/404`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle network error on getCharacterById and show danger toast', (done) => {
    const errorEvent = new ErrorEvent('Network error');

    service.getCharacterById('1').subscribe({
      next: () => fail('should have failed'),
      error: error => {
        expect(toastServiceSpy.show).toHaveBeenCalledWith('Error searching for character!', 'danger');
        done();
      }
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/character/1`);
    req.error(errorEvent);
  });

});
