import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterStoreService } from '../../services/character-store.service';
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
      origin: [''],
      location: [''],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.characterId = this.route.snapshot.paramMap.get('id');

    if (this.characterId) {
      this.editing = true;

      const current = this.characterStoreService.currentCharacters;
      const character = current.find(c => c.id === this.characterId);

      if (character) {
        this.characterForm.patchValue(character);
      } else {
        console.warn('Personagem não encontrado para edição:', this.characterId);
      }
    }
  }


  onSubmit(): void {
    const character: Character = this.characterForm.value;

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
