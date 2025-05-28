import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, Subject, fromEvent, of, finalize } from 'rxjs';
import { switchMap, map, catchError, scan, tap, takeUntil, throttleTime } from 'rxjs/operators';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { ToastService } from '../../shared/toast.service';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Gender, Species, Status } from '../../models/character.enums';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CharacterCardComponent, RouterLink],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent implements OnInit, OnDestroy {
  // Filter options for character search
  filters = {
    name: '',
    species: '',
    gender: '',
    status: '',
    page: 1
  };

  // Subjects for managing filter and loading state
  private filtersSubject = new BehaviorSubject<any>({ ...this.filters });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private showBackToTopSubject = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();

  // Observable streams for the template
  loading$ = this.loadingSubject.asObservable();
  showBackToTop$ = this.showBackToTopSubject.asObservable();

  // Enums for dropdowns/filters
  statusList = Object.values(Status);
  genderList = Object.values(Gender);
  speciesList = Object.values(Species);

  // Flag to check if running in browser (for SSR compatibility)
  isBrowser: boolean = false;

  // Main observable with the characters list
  characters$: Observable<Character[]> = this.filtersSubject.asObservable().pipe(
    tap(() => this.loadingSubject.next(true)), // Set loading state before fetching
    switchMap(filters =>
      this.rickAndMortyService.getCharacters(filters).pipe(
        map(characters => ({
          characters,
          page: filters.page
        })),
        catchError(err => {
          // Handle API errors and display a toast notification
          if (err.name !== 'AbortError') {
            this.toastService.show('Error fetching characters', 'danger');
          }
          return of({ characters: [], page: filters.page });
        }),
        finalize(() => this.loadingSubject.next(false)) // Reset loading state after fetching
      )
    ),
    scan((acc, curr) => {
      // Handle pagination and empty results
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
    // Set SSR compatibility flag
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Initial load with default filters
    this.filtersSubject.next({ ...this.filters });

    // Show "back to top" button on scroll (only in browser)
    if (this.isBrowser) {
      fromEvent(window, 'scroll')
        .pipe(
          throttleTime(100),
          map(() => window.pageYOffset || document.documentElement.scrollTop || 0),
          tap(scrollPosition => {
            // Update state inside Angular zone
            this.ngZone.run(() => {
              this.showBackToTopSubject.next(scrollPosition > 500);
            });
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  /**
   * Applies filters and resets to the first page.
   */
  applyFilters(): void {
    this.filters.page = 1;
    this.filtersSubject.next({ ...this.filters });
  }

  /**
   * Loads more characters (pagination).
   */
  loadMore(): void {
    this.filters.page += 1;
    this.filtersSubject.next({ ...this.filters });
  }

  /**
   * Smoothly scrolls the page to the top.
   */
  scrollToTop(): void {
    if (!this.isBrowser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Clean up subscriptions on component destroy.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
