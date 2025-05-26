import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CharacterModalComponent} from './components/character-modal/character-modal.component';
import {ToastComponent} from './shared/alert/toast.component';
import {ToastService} from './shared/toast.service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterOutlet, RouterLink, CharacterModalComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  message: string | null = null;
  type: 'success' | 'danger' | 'warning' | 'info' = 'info';

  constructor(
    private toastService: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
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
