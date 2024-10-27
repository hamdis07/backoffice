import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PromosService } from '../services/Promos.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-promo-update-dialog',
  templateUrl: './promo-update-dialog.component.html',
  styleUrls: ['./promo-update-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class PromoUpdateDialogComponent implements OnInit {
  promoForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PromoUpdateDialogComponent>,
    private promosService: PromosService,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject promo data
  ) {
    // Initialize the form with promo data
    this.promoForm = this.formBuilder.group({
      nom: [data.promo.nom || '', [Validators.required, Validators.minLength(3)]],
      pourcentage_reduction: [data.promo.pourcentage_reduction || '', [Validators.required, Validators.min(1)]],
      date_debut: [data.promo.date_debut || '', Validators.required],
      date_fin: [data.promo.date_fin || '', Validators.required],
    });
  }

  ngOnInit(): void {}

  // Close the dialog
  close(): void {
    this.dialogRef.close();
  }

  // Submit the updated promo
  submit(): void {
    if (this.promoForm.invalid) {
      return;
    }

    const updatedPromo = this.promoForm.value;

    // Call service to update promo
    this.promosService.updatePromo(this.data.promo.id, updatedPromo).subscribe(
      (response) => {
        // Close the dialog and pass the result back
        this.dialogRef.close(response);
      },
      (error) => {
        console.error('Error updating promotion:', error);
      }
    );
  }
}
