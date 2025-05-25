import { Component, OnInit } from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { Character } from '../../models/character.model';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { PLATFORM_ID, Inject } from '@angular/core';
import {CharacterCardComponent} from '../character-card/character-card.component';


@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CharacterCardComponent],
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
  showBackToTop = false;
  isBrowser = false;


  filters = {
    name: '',
    species: '',
    gender: '',
    status: ''
  };

  speciesList = ['Human', 'Alien', 'Robot', 'Animal', 'Mythological', 'Unknown'];

  constructor(
    private rickAndMortyService: RickAndMortyService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      console.log('Browser width:', window.innerWidth);
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      window.addEventListener('scroll', this.onScroll.bind(this));
    }

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

  onScroll() {
    if (!this.isBrowser) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showBackToTop = scrollTop > 500;
  }

  scrollToTop() {
    if (!this.isBrowser) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
