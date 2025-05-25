import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';
import {map, Observable} from 'rxjs';
import {gql} from '@apollo/client';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {

  constructor(private apollo: Apollo) { }

  getCharacters(page: number = 1, name: string = ''): Observable<any> {
    const GET_CHARACTERS = gql`
      query ($page: Int, $name: String) {
        characters(page: $page, filter: { name: $name }) {
          info {
            count
            pages
            next
            prev
          }
          results {
            id
            name
            status
            species
            type
            gender
            image
          }
        }
      }
    `;

    return this.apollo.watchQuery<any>({
      query: GET_CHARACTERS,
      variables: { page, name }
    })
      .valueChanges
      .pipe(
        map(result => result.data.characters)
      );
  }
}
