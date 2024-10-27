import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { PubliciteService } from '../services/publicites.service';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-publicite-dialog',
  standalone: true,
  templateUrl: './add-publicite-dialog.component.html',
  styleUrls: ['./add-publicite-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogContent,
    MatDialogActions
  ]
})
export class AddPubliciteDialogComponent implements OnInit {
  publiciteForm!: FormGroup;
  imageError: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddPubliciteDialogComponent>,
    private fb: FormBuilder,
    private publiciteService: PubliciteService // Injectez le service

  ) {}

  ngOnInit(): void {
    this.publiciteForm = this.fb.group({
      nom: ['', Validators.required],
      detail: ['', Validators.required],
      date_lancement: ['', Validators.required],
      date_fin: ['', Validators.required],
      montant_paye: ['', [Validators.required, Validators.min(0)]],
      image: [null, Validators.required],
      video: [null],
      affiche: [null]
    });
  }
  
  onSave(): void {
    if (this.publiciteForm.valid) {
      const formData = new FormData();
      Object.keys(this.publiciteForm.value).forEach(key => {
        formData.append(key, this.publiciteForm.value[key]);
      });
  
      console.log('Données à envoyer:', this.publiciteForm.value); // Ajoutez cette ligne
  
      this.publiciteService.createPublicite(formData).subscribe(
        response => {
          this.dialogRef.close(response);
        },
        error => {
          console.error('Erreur lors de la création de la publicité', error);
        }
      );
    } else {
      console.log('Formulaire invalide:', this.publiciteForm.errors); // Ajoutez cette ligne
    }
  }
  
  onCancel(): void {
    this.dialogRef.close(null);
  }

  onFileSelected(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (field === 'image' && file.type.startsWith('image/')) {
        this.imageError = null;
        this.publiciteForm.patchValue({ image: file });
      } else if (field === 'video' && file.type.startsWith('video/')) {
        this.publiciteForm.patchValue({ video: file });
      } else if (field === 'affiche' && file.type.startsWith('image/')) {
        this.publiciteForm.patchValue({ affiche: file });
      } else {
        this.imageError = 'Veuillez sélectionner un fichier valide.';
      }
    }
  }
}
