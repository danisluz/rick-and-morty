import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { CharacterStoreService } from '../../services/character-store.service';
import { ToastService } from '../../shared/toast.service';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CharacterType, Gender, Species, Status } from '../../models/character.enums';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CharacterCardComponent, RouterLink],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit, OnDestroy {
  private nameChangedSub!: Subscription;
  private nameChanged$ = new Subject<string>();

  currentPage = 1;
  loading = false;
  isLoading = false;
  showBackToTop = false;
  isBrowser = false;

  info: any = null;

  filters = {
    name: '',
    species: '',
    gender: '',
    status: ''
  };

  statusList = Object.values(Status);
  genderList = Object.values(Gender);
  speciesList = Object.values(Species);
  typesList = Object.values(CharacterType);

  constructor(
    private rickAndMortyService: RickAndMortyService,
    protected characterStoreService: CharacterStoreService,
    private toastService: ToastService,
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

    this.nameChangedSub = this.nameChanged$.pipe(
      debounceTime(300)
    ).subscribe(name => {
      this.filters.name = name;
      this.applyFilters();
    });

    if (this.characterStoreService.currentCharacters.length === 0) {
      this.loadCharacters();
    }
  }

  ngOnDestroy(): void {
    if (this.nameChangedSub) {
      this.nameChangedSub.unsubscribe();
    }
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }

  onNameChange(name: string): void {
    this.nameChanged$.next(name);
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.loading = true;
    const filters = { ...this.filters, page: this.currentPage };

    this.rickAndMortyService.getCharacters(filters).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: response => {
        if (response?.results?.length) {
          if (this.currentPage === 1) {
            this.characterStoreService.setCharacters(response.results);
          } else {
            this.characterStoreService.appendCharacters(response.results);
          }
          this.info = response.info;
          this.currentPage++;
        } else if (this.currentPage === 1) {
          this.characterStoreService.setCharacters([]);
          this.info = null;
        } else {
          this.toastService.show('No results found for next page!', 'warning');
        }
      },
      error: err => {
        this.toastService.show('Error when searching for characters!', 'danger');
      }
    });
  }

  loadMore(): void {
    if (this.loading || this.isLoading) {
      return; // evita chamadas paralelas
    }

    this.isLoading = true;
    const filters = { ...this.filters, page: this.currentPage };

    this.rickAndMortyService.getCharacters(filters).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: response => {
        if (response?.results?.length) {
          this.characterStoreService.appendCharacters(response.results);
          this.currentPage++;
        } else {
          this.toastService.show('No more characters to load.', 'warning');
        }
      },
      error: err => {
        this.toastService.show('Failed to load more characters. Please try again later.', 'danger');
      }
    });
  }

  onScroll(): void {
    if (!this.isBrowser || this.loading || this.isLoading) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 100; // 100px antes do fim

    if (scrollPosition >= threshold) {
      this.loadMore();
    }

    this.showBackToTop = (window.pageYOffset || document.documentElement.scrollTop || 0) > 500;
  }

  scrollToTop(): void {
    if (!this.isBrowser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
