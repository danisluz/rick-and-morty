import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MATERIAL_MODULES} from './shared/material';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MATERIAL_MODULES],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Rick and Morty';
}
