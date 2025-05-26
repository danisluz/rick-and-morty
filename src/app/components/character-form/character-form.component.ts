import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  speciesList = ['Human', 'Alien', 'Robot', 'Cronenberg', 'Mythological Creature'];
  typesList = ['Hero', 'Villain', 'Neutral', 'Unknown'];

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

      this.rickAndMortyService.getCharacterById(this.characterId).subscribe({
        next: (character: Character) => {
          console.log('Personagem carregado da API:', character);

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
        },
        error: (err) => {
          console.error('Erro ao buscar personagem:', err);
        }
      });
    }
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
      origin: { name: formValue.origin },
      location: { name: formValue.location },
      image: formValue.image,
      episode: [],
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
