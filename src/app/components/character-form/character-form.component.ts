import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CharacterStoreService} from '../../services/character-store.service';
import {RickAndMortyService} from '../../services/rick-and-morty.service';
import {Character} from '../../models/character.model';
import {Location} from '@angular/common';
import {CharacterType, Gender, Species, Status} from '../../models/character.enums';

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
    private location: Location
  ) {
    this.characterForm = this.fb.group({
      name: [''],
      species: [''],
      status: [''],
      gender: [''],
      type: [''],
      origin: [''],
      location: [''],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.characterId = this.route.snapshot.paramMap.get('id');

    if (this.characterId) {
      this.editing = true;

      const localCharacter = this.characterStoreService.getCharacterById(this.characterId);

      if (localCharacter) {
        this.patchForm(localCharacter);
      } else {
        this.rickAndMortyService.getCharacterById(this.characterId).subscribe({
          next: (character: Character) => {
            this.patchForm(character);
          },
          error: (err) => {
            console.error('Erro ao buscar personagem na API:', err);
          }
        });
      }
    }
  }

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


  onSubmit(): void {
    const formValue = this.characterForm.value;

    const character: Character = {
      id: this.characterId ?? Math.random().toString(36).substring(2, 9),
      name: formValue.name,
      species: formValue.species,
      status: formValue.status,
      gender: formValue.gender,
      type: formValue.type,
      origin: {name: formValue.origin},
      location: {name: formValue.location},
      image: formValue.image,
      episode: [],
      edited: true
    };

    if (this.editing) {
      this.characterStoreService.updateCharacter(character);
    } else {
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
