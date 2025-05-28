import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Character, CharacterFilters, CharactersResponse } from '../models/character.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {

  // Base API URL for Rick and Morty API
  private baseUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  /**
   * Fetches a list of characters with optional filters (pagination, name, species, gender, status).
   * @param filters Filtering options for the API call
   * @returns Observable of Character array
   */
  getCharacters(filters: CharacterFilters): Observable<Character[]> {
    let params = new HttpParams().set('page', filters.page?.toString() || '1');

    if (filters.name) params = params.set('name', filters.name);
    if (filters.species) params = params.set('species', filters.species);
    if (filters.gender) params = params.set('gender', filters.gender);
    if (filters.status) params = params.set('status', filters.status);

    return this.http.get<CharactersResponse>(`${this.baseUrl}/character/`, { params }).pipe(
      map(response => {
        // Return results or empty array if not present
        return response.results ?? [];
      }),
      catchError((error: HttpErrorResponse) => {
        // If 404, treat as "no results found" (return empty array), otherwise throw error
        if (error.status === 404) {
          return of([]);
        }
        throw error;
      })
    );
  }

  /**
   * Fetches a single character by its ID.
   * @param id The character ID
   * @returns Observable of Character
   */
  getCharacterById(id: string): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/character/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log error and propagate it to the subscriber
        console.error(`Error searching for character ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
}
