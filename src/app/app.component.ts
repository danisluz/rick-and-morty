import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {MATERIAL_MODULES} from './shared/material';
import {FlexLayoutModule} from '@angular/flex-layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButton, MatToolbar, FlexLayoutModule, ...MATERIAL_MODULES],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
