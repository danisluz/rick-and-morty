import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CharacterFormComponent } from './character-form.component';
import { CharacterStoreService } from '../../services/character-store.service';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastService } from '../../shared/toast.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('CharacterFormComponent', () => {
  let component: CharacterFormComponent;
  let fixture: ComponentFixture<CharacterFormComponent>;
  let mockStore: jasmine.SpyObj<CharacterStoreService>;
  let mockApi: jasmine.SpyObj<RickAndMortyService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: any;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockToast: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('CharacterStoreService', ['getCharacterById', 'updateCharacter', 'addCharacterAtTop']);
    mockApi = jasmine.createSpyObj('RickAndMortyService', ['getCharacterById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockToast = jasmine.createSpyObj('ToastService', ['show']);
    mockRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => null // default: new character
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [CharacterFormComponent, ReactiveFormsModule],
      providers: [
        { provide: CharacterStoreService, useValue: mockStore },
        { provide: RickAndMortyService, useValue: mockApi },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Location, useValue: mockLocation },
        { provide: ToastService, useValue: mockToast },
        FormBuilder,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
    expect(component.characterForm).toBeDefined();
    expect(component.editing).toBeFalse();
  });

  it('should call onBack and location.back', () => {
    component.onBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should call onCancel and navigate to root', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show warning toast and mark form as touched if submit invalid', () => {
    component.onSubmit();
    expect(mockToast.show).toHaveBeenCalledWith('Fill in all required fields.', 'warning');
    expect(component.characterForm.touched).toBeTrue();
  });

  it('should add character on submit if not editing', () => {
    // Preenche todos campos obrigatórios
    component.characterForm.patchValue({
      name: 'Rick', species: 'Human', status: 'Alive',
      gender: 'Male', type: 'Main', origin: 'Earth', location: 'Garage', image: ''
    });
    component.editing = false;
    component.characterId = null;
    component.onSubmit();

    expect(mockStore.addCharacterAtTop).toHaveBeenCalled();
    expect(mockToast.show).toHaveBeenCalledWith('Character created successfully!', 'success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should update character on submit if editing', () => {
    component.characterForm.patchValue({
      name: 'Morty', species: 'Human', status: 'Alive',
      gender: 'Male', type: 'Sidekick', origin: 'Earth', location: 'School', image: ''
    });
    component.editing = true;
    component.characterId = '123';
    component.onSubmit();

    expect(mockStore.updateCharacter).toHaveBeenCalled();
    expect(mockToast.show).toHaveBeenCalledWith('Character updated successfully!', 'success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should patch form with character from local store if editing', fakeAsync(() => {
    const localCharacter = {
      id: '11',
      name: 'LocalPerson',
      species: 'Alien',
      status: 'Alive',
      gender: 'Male',
      type: 'Boss',
      origin: { name: 'Home' },
      location: { name: 'School' },
      image: '/localperson.jpg'
    };

    const store = TestBed.inject(CharacterStoreService) as jasmine.SpyObj<CharacterStoreService>;
    const route = TestBed.inject(ActivatedRoute);

    (route.snapshot.paramMap as any).get = (key: string) => key === 'id' ? '11' : null;
    store.getCharacterById.and.returnValue(localCharacter);

    fixture = TestBed.createComponent(CharacterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    expect(component.editing).toBeTrue();
    expect(component.characterForm.value.name).toBe('LocalPerson');
    expect(component.characterForm.value.location).toBe('School');
  }));


  it('should patch form with character from API if not in store', fakeAsync(() => {
    mockRoute.snapshot.paramMap.get = (key: string) => key === 'id' ? '51' : null;
    mockStore.getCharacterById.and.returnValue(undefined);

    const apiCharacter = {
      id: '51',
      name: 'Birdperson',
      species: 'Bird',
      status: 'Alive',
      gender: 'Male',
      type: 'Main',
      origin: { name: 'Bird World' },
      location: { name: 'Bird Nest' },
      image: '/birdperson.jpg'
    };

    mockApi.getCharacterById.and.returnValue(of(apiCharacter));

    fixture = TestBed.createComponent(CharacterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    tick();
    expect(component.editing).toBeTrue();
    expect(component.characterForm.value.name).toBe('Birdperson');
    expect(component.characterForm.value.origin).toBe('Bird World');
  }));

  it('should show error toast if API returns error searching character', fakeAsync(() => {
    mockRoute.snapshot.paramMap.get = () => '101';
    mockStore.getCharacterById.and.returnValue(undefined);
    mockApi.getCharacterById.and.returnValue(throwError(() => new Error('API fail')));

    fixture = TestBed.createComponent(CharacterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    tick();
    expect(mockToast.show).toHaveBeenCalledWith('Error searching for character', 'danger');
  }));


  it('should default image to /default-character.jpeg if not provided', () => {
    component.characterForm.patchValue({
      name: 'NoPic', species: 'Human', status: 'Alive',
      gender: 'Male', type: 'Main', origin: 'Earth', location: 'Earth', image: ''
    });
    component.editing = false;
    component.characterId = null;
    component.onSubmit();

    const callArgs = mockStore.addCharacterAtTop.calls.mostRecent().args[0];
    expect(callArgs.image).toBe('/default-character.jpeg');
  });
});
