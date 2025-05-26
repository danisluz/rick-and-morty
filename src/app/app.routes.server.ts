import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'new', renderMode: RenderMode.Prerender },
  { path: 'edit/:id', renderMode: RenderMode.Server },
];
