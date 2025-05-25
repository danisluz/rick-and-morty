import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CharacterModalComponent} from './components/character-modal/character-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterOutlet, RouterLink, CharacterModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { }
