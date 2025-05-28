import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterStoreService } from '../../services/character-store.service';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { Character } from '../../models/character.model';
import { Location } from '@angular/common';
import { CharacterType, Gender, Species, Status } from '../../models/character.enums';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './character-form.component.html',
  styleUrls: ['./character-form.component.scss']
})
export class CharacterFormComponent implements OnInit {
  characterForm: FormGroup;
  editing = false;
  characterId: string | null = null;

  // Dropdown lists
  statusList = Object.values(Status);
  genderList = Object.values(Gender);
  speciesList = Object.values(Species);
  typesList = Object.values(CharacterType);

  constructor(
    private fb: FormBuilder,
    private characterStoreService: CharacterStoreService,
    private rickAndMortyService: RickAndMortyService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastService: ToastService
  ) {
    // Form initialization with validation
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      status: ['', Validators.required],
      gender: ['', Validators.required],
      type: ['', Validators.required],
      origin: [''],
      location: [''],
      image: ['']
    });
  }

  /**
   * On component initialization: if there's an ID, set editing mode and patch the form.
   */
  ngOnInit(): void {
    this.characterId = this.route.snapshot.paramMap.get('id');

    if (this.characterId) {
      this.editing = true;

      // Try to get the character from local store first
      const localCharacter = this.characterStoreService.getCharacterById(this.characterId);

      if (localCharacter) {
        this.patchForm(localCharacter);
      } else {
        // Fallback to API if not in local store
        this.rickAndMortyService.getCharacterById(this.characterId).subscribe({
          next: (character: Character) => {
            this.patchForm(character);
          },
          error: (err) => {
            console.error('Error searching for character in API:', err);
            this.toastService.show('Error searching for character', 'danger');
          }
        });
      }
    }
  }

  /**
   * Fills the form with character data.
   */
  private patchForm(character: Character): void {
    this.characterForm.patchValue({
      name: character.name,
      species: character.species,
      status: character.status,
      gender: character.gender,
      type: character.type,
      origin: character.origin?.name || '',
      location: character.location?.name || '',
      image: character.image
    });
  }

  /**
   * Handles form submission for creating or updating a character.
   */
  onSubmit(): void {
    if (this.characterForm.invalid) {
      this.characterForm.markAllAsTouched();
      this.toastService.show('Fill in all required fields.', 'warning');
      return;
    }

    const formValue = this.characterForm.value;

    // Construct character object based on form input
    const character: Character = {
      id: this.characterId ?? Math.random().toString(36).substring(2, 9),
      name: formValue.name,
      species: formValue.species,
      status: formValue.status,
      gender: formValue.gender,
      type: formValue.type,
      origin: { name: formValue.origin },
      location: { name: formValue.location },
      image: formValue.image || 'assets/default-character.jpeg',
      episode: [],
      edited: true
    };

    if (this.editing) {
      this.characterStoreService.updateCharacter(character);
      this.toastService.show('Character updated successfully!', 'success');
    } else {
      this.characterStoreService.addCharacterAtTop(character);
      this.toastService.show('Character created successfully!', 'success');
    }

    // Redirect to main page after submission
    this.router.navigate(['/']);
  }

  /**
   * Cancel and return to main page.
   */
  onCancel(): void {
    this.router.navigate(['/']);
  }

  /**
   * Go back to previous location in history.
   */
  onBack(): void {
    this.location.back();
  }
}
