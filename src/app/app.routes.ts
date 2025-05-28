import { Routes } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
  // Home page: shows the character list
  { path: '', component: CharacterListComponent },

  // About page: project or team info
  { path: 'about', component: AboutComponent },

  // New character form (lazy-loaded for performance)
  {
    path: 'new',
    loadComponent: () =>
      import('./components/character-form/character-form.component')
        .then(m => m.CharacterFormComponent)
  },

  // Edit character form (also lazy-loaded)
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/character-form/character-form.component')
        .then(m => m.CharacterFormComponent)
  }
];
