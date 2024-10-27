import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SousCategorieService } from '../services/souscategories.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-sous-categorie-dialog',
  standalone: true,
  templateUrl: './edit-sous-categorie-dialog.component.html',
  styleUrls: ['./edit-sous-categorie-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class EditSousCategorieDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditSousCategorieDialogComponent>, // Change to public
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private sousCategorieService: SousCategorieService
  ) {
    this.form = this.fb.group({
      nom: [data.sousCategorie.nom, Validators.required],
      categorie_nom: [data.categorie_nom || null], // Initialize as null if undefined
    });
  }

  editSousCategorie() {
    if (this.form.valid) {
      this.sousCategorieService.updateSousCategorie(this.data.sousCategorie.id, this.form.value).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
