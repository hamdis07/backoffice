import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule here
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class AddCategoryDialogComponent {
  categoryForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    private fb: FormBuilder,
    private categoriesService: CategoriesService
  ) {
    this.categoryForm = this.fb.group({
      nom: ['', Validators.required], // Required field for the category name
      //description: [''], // Optional description field
    });
  }

  // Method to add a category
  addCategory(): void {
    if (this.categoryForm.valid) {
        console.log(this.categoryForm.value); // Add this line to debug

      this.categoriesService.createCategorie(this.categoryForm.value).subscribe({
        next: (response) => {
          this.dialogRef.close(response); // Close the dialog and return the response
        },
        error: (err) => console.error('Error adding category', err), // Log any errors
      });
    }
  }

  // Optional: Method to close the dialog
  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog without passing any data
  }
}
