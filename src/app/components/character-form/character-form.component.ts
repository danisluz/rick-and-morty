import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterStoreService } from '../../services/character-store.service';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { Character } from '../../models/character.model';
import { Location } from '@angular/common';

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

  statusList = ['Alive', 'Dead', 'unknown'];
  genderList = ['Male', 'Female', 'Genderless', 'unknown'];

  constructor(
    private fb: FormBuilder,
    private characterStoreService: CharacterStoreService,
    private rickAndMortyService: RickAndMortyService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.characterForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      species: [''],
      status: ['unknown'],
      gender: ['unknown'],
      type: [''],
      origin: this.fb.group({
        name: [{ value: '', disabled: true }],
        url: [{ value: '', disabled: true }]
      }),
      location: this.fb.group({
        name: [{ value: '', disabled: true }],
        url: [{ value: '', disabled: true }]
      }),
      image: [{ value: '', disabled: true }]
    });

  }

  ngOnInit(): void {
    this.characterId = this.route.snapshot.paramMap.get('id');

    if (this.characterId) {
      this.editing = true;

      this.rickAndMortyService.getCharacterById(this.characterId).subscribe({
        next: (character: Character) => {
          console.log('Personagem carregado da API:', character);
          this.characterForm.patchValue(character);
        },
        error: (err) => {
          console.error('Erro ao buscar personagem:', err);
        }
      });
    }
  }


  onSubmit(): void {
    const formValue = this.characterForm.getRawValue();

    const character: Character = {
      id: formValue.id,
      name: formValue.name,
      species: formValue.species,
      status: formValue.status,
      gender: formValue.gender,
      type: formValue.type,
      image: formValue.image
    };

    if (this.editing) {
      this.characterStoreService.updateCharacter(character);
    } else {
      character.id = Math.random().toString(36).substring(2, 9);
      this.characterStoreService.addCharacterAtTop(character);
    }

    this.router.navigate(['/']);
  }


  onCancel(): void {
    this.router.navigate(['/']);
  }

  onBack(): void {
    this.location.back();
  }
}
