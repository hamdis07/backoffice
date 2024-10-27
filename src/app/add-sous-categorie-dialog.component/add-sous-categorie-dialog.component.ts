import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SousCategorieService } from '../services/souscategories.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-sous-categorie-dialog',
  standalone: true,
  templateUrl: './add-sous-categorie-dialog.component.html',
  styleUrls: ['./add-sous-categorie-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AddSousCategorieDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddSousCategorieDialogComponent>, // Changed to public
    private fb: FormBuilder,
    private sousCategorieService: SousCategorieService
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      categorie_nom: ['', Validators.required],
    });
  }

  addSousCategorie() {
    if (this.form.valid) {
      this.sousCategorieService.createSousCategorie(this.form.value).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
