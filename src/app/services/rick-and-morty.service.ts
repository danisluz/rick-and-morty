import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError, Observable, of, throwError} from 'rxjs';
import { CharactersResponse } from '../models/character.model';
import {ToastService} from '../shared/toast.service';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {

  private baseUrl = 'https://rickandmortyapi.com/api';

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  getCharacters(filters: any): Observable<CharactersResponse | null> {
    let params = new HttpParams().set('page', filters.page || 1);

    if (filters.name) params = params.set('name', filters.name);
    if (filters.species) params = params.set('species', filters.species);
    if (filters.gender) params = params.set('gender', filters.gender);
    if (filters.status) params = params.set('status', filters.status);

    return this.http.get<CharactersResponse>(`${this.baseUrl}/character/`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.warn('No characters found with filters:', filters);
          this.toastService.show('No characters found with filters!', 'warning');
          return of(null);
        } else {
          console.error('Erro na API Rick and Morty:', error);
          this.toastService.show('Rick and Morty system Error!', 'danger');
          return throwError(() => error);
        }
      })
    );
  }

  getCharacterById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/character/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error searching for character ${id}:`, error);
        this.toastService.show('Error searching for character!', 'danger');
        return throwError(() => error);
      })
    );
  }
}
