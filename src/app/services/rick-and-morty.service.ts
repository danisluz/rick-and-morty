import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError, Observable, of, throwError} from 'rxjs';
import {Character, CharacterFilters, CharactersResponse} from '../models/character.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {

  private baseUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  getCharacters(filters: CharacterFilters): Observable<Character[]> {
    let params = new HttpParams().set('page', filters.page?.toString() || '1');

    if (filters.name) params = params.set('name', filters.name);
    if (filters.species) params = params.set('species', filters.species);
    if (filters.gender) params = params.set('gender', filters.gender);
    if (filters.status) params = params.set('status', filters.status);

    return this.http.get<CharactersResponse>(`${this.baseUrl}/character/`, { params }).pipe(
      map(response => {
        return response.results ?? [];
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of([]);
        }
        throw error;
      })
    );
  }

  getCharacterById(id: string): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/character/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error searching for character ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
}
