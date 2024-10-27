import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PromosService } from '../services/Promos.service'; // Import the service

@Component({
  selector: 'app-promo-create-dialog',
  templateUrl: './promo-create-dialog.component.html',
  styleUrls: ['./promo-create-dialog.component.scss'],
  standalone: true, // Standalone component
  imports: [CommonModule, ReactiveFormsModule] // Add necessary modules for the form
})
export class PromoCreateDialogComponent {
  promoForm: FormGroup; // Define the form group

  constructor(
    private dialogRef: MatDialogRef<PromoCreateDialogComponent>,
    private fb: FormBuilder, // FormBuilder for form creation
    private promosService: PromosService // Inject promo service to submit data
  ) {
    // Initialize the form group with form controls and validation
    this.promoForm = this.fb.group({
      nom: ['', Validators.required],
      pourcentage_reduction: ['', [Validators.required, Validators.min(1)]],
      date_debut: ['', Validators.required],
      date_fin: ['', [Validators.required]],
    });
  }

  // Function to handle form submission
  submit(): void {
    if (this.promoForm.valid) {
      const promoData = this.promoForm.value;

      // Submit data to the backend
      this.promosService.createPromo(promoData).subscribe(
        (response) => {
          this.dialogRef.close(response); // Close dialog and send response
        },
        (error) => {
          console.error('Error creating promo:', error);
          // Handle error (e.g., show a notification)
        }
      );
    }
  }

  // Close the dialog without saving
  close(): void {
    this.dialogRef.close();
  }
}
