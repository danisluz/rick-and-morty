import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharactersResponse } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {

  private baseUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  getCharacters(page: number = 1, name: string = ''): Observable<CharactersResponse> {
    const url = `${this.baseUrl}/character/?page=${page}&name=${name}`;
    return this.http.get<CharactersResponse>(url);
  }
}
