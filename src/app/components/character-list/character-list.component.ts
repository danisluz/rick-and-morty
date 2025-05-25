import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { Character } from '../../models/character.model';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  currentPage = 1;
  isLoading = false;
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
      this.applyFilters();
    });

    this.loadCharacters();
  }

  onNameChange(name: string) {
    this.nameChanged$.next(name);
  }

  applyFilters() {
    this.currentPage = 1;
    this.characters = [];
    this.loadCharacters();
  }

  loadCharacters() {
    this.loading = true;

    const filters = { ...this.filters, page: this.currentPage };

    this.rickAndMortyService.getCharacters(filters).subscribe({
      next: (response) => {
        if (response) {
          this.characters = response.results;
          this.info = response.info;

          // ✅ Importante: já preparar para próxima página
          this.currentPage = 2;
        } else {
          this.characters = [];
          this.info = null;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error when searching for characters:', err);
        this.loading = false;
      }
    });
  }

  loadMore() {
    this.isLoading = true;

    const filters = { ...this.filters, page: this.currentPage };

    this.rickAndMortyService.getCharacters(filters).subscribe((res) => {
      if (res && res.results) {
        this.characters = this.characters.concat(res.results);
        this.currentPage++;
      }
      this.isLoading = false;
    });
  }
}
