import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CharacterModalComponent} from './components/character-modal/character-modal.component';
import {ToastComponent} from './shared/alert/toast.component';
import {ToastService} from './shared/toast.service';
import {AsyncPipe, isPlatformBrowser, NgIf} from '@angular/common';
import {CharacterModalService} from './services/character-modal.service';
import {Observable} from 'rxjs';
import {Character} from './models/character.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterOutlet, RouterLink, CharacterModalComponent, ToastComponent, AsyncPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  character$!: Observable<Character | null>;
  message: string | null = null;
  type: 'success' | 'danger' | 'warning' | 'info' = 'info';

  constructor(
    private toastService: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public modalService: CharacterModalService
  ) {}

  ngOnInit(): void {
    this.character$ = this.modalService.character$

    if (isPlatformBrowser(this.platformId)) {
      const loader = document.getElementById('global-loader');
      if (loader) {
        loader.style.display = 'none';
      }
    }

    this.toastService.message$.subscribe(msg => this.message = msg);
    this.toastService.type$.subscribe(type => this.type = type);
  }
}
