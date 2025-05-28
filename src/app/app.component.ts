import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CharacterModalComponent } from './components/character-modal/character-modal.component';
import { ToastComponent } from './shared/alert/toast.component';
import { ToastService } from './shared/toast.service';
import { AsyncPipe, isPlatformBrowser, NgIf } from '@angular/common';
import { CharacterModalService } from './services/character-modal.service';
import { Observable } from 'rxjs';
import { Character } from './models/character.model';

@Component({
  selector: 'app-root',
  standalone: true,
  // Only one RouterOutlet is needed; duplicates removed for clarity
  imports: [RouterOutlet, RouterLink, CharacterModalComponent, ToastComponent, AsyncPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Observable for the character currently shown in the modal (if any)
  character$!: Observable<Character | null>;

  // Toast message and type for global notifications
  message: string | null = null;
  type: 'success' | 'danger' | 'warning' | 'info' = 'info';

  constructor(
    private toastService: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public modalService: CharacterModalService
  ) {}

  /**
   * Lifecycle hook: initializes character modal stream and toast subscriptions.
   * Also hides any global loader overlay if present (browser only).
   */
  ngOnInit(): void {
    // Subscribe to the currently opened character in the modal
    this.character$ = this.modalService.character$;

    // Hide any global loader on app load (browser only)
    if (isPlatformBrowser(this.platformId)) {
      const loader = document.getElementById('global-loader');
      if (loader) {
        loader.style.display = 'none';
      }
    }

    // Subscribe to toast service to display global notifications
    this.toastService.message$.subscribe(msg => this.message = msg);
    this.toastService.type$.subscribe(type => this.type = type);
  }
}
