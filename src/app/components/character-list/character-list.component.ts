import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent {
  characters: Character[] = [];
  info: any;
  loading = true;

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    this.getCharacters(1, 'rick');
  }

  getCharacters(page: number, name: string): void {
    this.loading = true;
    this.rickAndMortyService.getCharacters(page, name).subscribe({
      next: data => {
        this.characters = data.results;
        this.info = data.info;
        this.loading = false;
      },
      error: err => {
        console.error('Erro ao buscar personagens:', err);
        this.loading = false;
      }
    });
  }
}
