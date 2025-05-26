import { Routes } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
  { path: '', component: CharacterListComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'new',
    loadComponent: () => import('./components/character-form/character-form.component')
      .then(m => m.CharacterFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/character-form/character-form.component')
      .then(m => m.CharacterFormComponent)
  }
];
