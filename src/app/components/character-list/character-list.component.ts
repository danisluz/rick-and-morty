import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {RickAndMortyService} from '../../services/rick-and-morty.service';
import {FormsModule} from '@angular/forms';
import {debounceTime, finalize, Subject, Subscription} from 'rxjs';
import {PLATFORM_ID} from '@angular/core';
import {CharacterCardComponent} from '../character-card/character-card.component';
import {CharacterStoreService} from '../../services/character-store.service';
import {RouterLink} from '@angular/router';
import {CharacterType, Gender, Species, Status} from '../../models/character.enums';
import {ToastService} from '../../shared/toast.service';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CharacterCardComponent, RouterLink],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit, OnDestroy {
  private nameChangedSub!: Subscription;
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
  }

  onNameChange(name: string) {
    this.nameChanged$.next(name);
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadCharacters();
  }


loadCharacters() {
  this.loading = true;
  const filters = { ...this.filters, page: this.currentPage };

  this.rickAndMortyService.getCharacters(filters).pipe(
    finalize(() => {
      this.loading = false;  // garante que loading sempre vai virar false
    })
  ).subscribe({
    next: (response) => {
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
        console.warn('No results found for next page!');
        this.toastService.show('No results found for next page!', 'warning');
      }
    },
    error: (err) => {
      console.error('Error when searching for characters:', err);
      this.toastService.show('Error when searching for characters!', 'danger');
    }
  });
}


loadMore() {
    this.isLoading = true;

    const filters = {...this.filters, page: this.currentPage};

    this.rickAndMortyService.getCharacters(filters).subscribe((res) => {
      if (res && res.results) {
        this.characterStoreService.appendCharacters(res.results);
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
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
