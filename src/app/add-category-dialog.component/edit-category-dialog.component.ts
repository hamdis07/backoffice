import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.scss'],
  standalone: true,
  host: { 'data-unique-id': 'my-component' } ,// Add a unique host attribute

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class EditCategoryDialogComponent {
  categoryForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditCategoryDialogComponent>, // Changed to public
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    @Inject(MAT_DIALOG_DATA) public data: { category: any }
  ) {
    this.categoryForm = this.fb.group({
      nom: [data.category.nom, Validators.required],
      description: [data.category.description],
    });
  }

  updateCategory() {
    if (this.categoryForm.valid) {
      this.categoriesService.updateCategorie(this.data.category.id, this.categoryForm.value).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (err) => console.error('Error updating category', err),
      });
    }
  }
}
