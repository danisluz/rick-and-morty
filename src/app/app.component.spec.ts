import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ToastService } from './shared/toast.service';
import {BehaviorSubject, of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

describe('AppComponent', () => {

  class MockToastService {
    message$ = new BehaviorSubject<string | null>(null).asObservable();
    type$ = new BehaviorSubject<'success' | 'danger' | 'warning' | 'info'>('info').asObservable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { params: {}, queryParams: {} }
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
