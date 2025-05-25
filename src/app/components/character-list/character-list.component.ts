import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import {Character, CharactersResponse} from '../../models/character.model';
import {FormsModule} from '@angular/forms';
import {debounceTime, Subject} from 'rxjs';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  info: any;
  loading = true;
  nameChanged$ = new Subject<string>();

  filters = {
    name: '',
    species: '',
    gender: '',
    status: ''
  };

  speciesList = ['Human', 'Alien', 'Robot', 'Animal', 'Mythological', 'Unknown'];

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    this.nameChanged$.pipe(
      debounceTime(300)
    ).subscribe(name => {
      this.filters.name = name;
      this.loadCharacters();
    });

    this.loadCharacters();
  }

  onNameChange(name: string) {
    this.nameChanged$.next(name);
  }

  applyFilters() {
    this.loadCharacters();
  }

  loadCharacters() {
    this.loading = true;

    const params: any = {};

    if (this.filters.name) params.name = this.filters.name;
    if (this.filters.species) params.species = this.filters.species;
    if (this.filters.gender) params.gender = this.filters.gender;
    if (this.filters.status) params.status = this.filters.status;

    this.rickAndMortyService.getCharacters(params).subscribe({
      next: (response) => {
        if (response) {
          this.characters = response.results;
          this.info = response.info;
        } else {
          this.characters = [];
          this.info = null;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar personagens:', err);
        this.loading = false;
      }
    });
  }
}
