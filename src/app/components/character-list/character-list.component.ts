import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import {isPlatformBrowser, CommonModule} from '@angular/common';
import {PLATFORM_ID} from '@angular/core';
import {BehaviorSubject, Observable, Subject, fromEvent, of, finalize} from 'rxjs';
import {switchMap, map, catchError, scan, tap, takeUntil, throttleTime} from 'rxjs/operators';
import {RickAndMortyService} from '../../services/rick-and-morty.service';
import {ToastService} from '../../shared/toast.service';
import {CharacterCardComponent} from '../character-card/character-card.component';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {Gender, Species, Status} from '../../models/character.enums';
import {Character} from '../../models/character.model';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CharacterCardComponent, RouterLink],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent implements OnInit, OnDestroy {



  filters = {
    name: '',
    species: '',
    gender: '',
    status: '',
    page: 1
  };

  private filtersSubject = new BehaviorSubject<any>({...this.filters});

  private destroy$ = new Subject<void>();
  private showBackToTopSubject = new BehaviorSubject<boolean>(false);
  showBackToTop$ = this.showBackToTopSubject.asObservable();

  isBrowser: boolean = false;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  statusList = Object.values(Status);
  genderList = Object.values(Gender);
  speciesList = Object.values(Species);

  characters$: Observable<Character[]> = this.filtersSubject.asObservable().pipe(
    tap(() => this.loadingSubject.next(true)),
    switchMap(filters =>
      this.rickAndMortyService.getCharacters(filters).pipe(
        map(characters => ({
          characters,
          page: filters.page
        })),
        catchError(err => {
          if (err.name !== 'AbortError') {
            this.toastService.show('Erro ao buscar personagens', 'danger');
          }
          return of({ characters: [], page: filters.page });
        }),
        finalize(() => this.loadingSubject.next(false))
      )
    ),
    scan((acc, curr) => {
      if (!curr.characters.length) {
        this.toastService.show(
          curr.page === 1
            ? 'No characters found for the selected filters.'
            : 'No more characters to load.',
          'warning'
        );
      }
      return curr.page === 1 ? curr.characters : [...acc, ...curr.characters];
    }, [] as Character[])
  );


  constructor(
    private rickAndMortyService: RickAndMortyService,
    private toastService: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.filtersSubject.next({ ...this.filters });

    // Se quiser o back-to-top, mantém o scroll listener
    if (this.isBrowser) {
      fromEvent(window, 'scroll')
        .pipe(
          throttleTime(100),
          map(() => window.pageYOffset || document.documentElement.scrollTop || 0),
          tap(scrollPosition => {
            this.ngZone.run(() => {
              this.showBackToTopSubject.next(scrollPosition > 500);
            });
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }


  applyFilters(): void {
    this.filters.page = 1;
    this.filtersSubject.next({...this.filters});
  }

  loadMore(): void {
    this.filters.page += 1;
    this.filtersSubject.next({...this.filters});
  }

  scrollToTop(): void {
    if (!this.isBrowser) return;
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
