import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PromosService } from '../services/Promos.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-promo-apply-dialog',
  templateUrl: './promo-apply-dialog.component.html',
  styleUrls: ['./promo-apply-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
})
export class PromoApplyDialogComponent implements OnInit {
  applyPromoForm: FormGroup;
  products: any[] = [];
  promos: any[] = [];
  selectedPromoId: number | null = null; // Add a property to store the selected promo ID


  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PromoApplyDialogComponent>,
    private promosService: PromosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Form to select promo and products
    this.applyPromoForm = this.formBuilder.group({
      promo_id: ['', Validators.required],
      product_ids: [[], Validators.required], // Store selected product IDs as an array
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadPromos();
  }

  // Fetch all products
  loadProducts(): void {
    this.promosService.getProduits().subscribe(
      (response: any) => {
        // If the response is already an array, you can assign it directly
        if (Array.isArray(response)) {
          this.products = response;
        } else {
          console.error('Problème lors du chargement des produits:', response);
          this.products = [];
        }
      },
      (error: any) => {
        console.error('Erreur lors du chargement des produits:', error);
      }
    );
  }

  // Fetch all promos
  loadPromos(): void {
    this.promosService.getPromos().subscribe(
      (response: any) => {
        this.promos = response;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des promotions:', error);
      }
    );
  }

  // Close the dialog
  close(): void {
    this.dialogRef.close();
  }

  // Handle change event for promo selection
  onPromoChange(): void {
    this.selectedPromoId = this.applyPromoForm.get('promo_id')?.value; // Get the selected promo ID
    console.log('Selected Promo ID:', this.selectedPromoId);
  }
  // Submit form to apply the promo to selected products
  submit(): void {
    if (this.applyPromoForm.invalid) {
      return;
    }

    const formData = this.applyPromoForm.value;
    const promoId = formData.promo_id; // Get the promo ID
    const selectedProductIds = formData.product_ids; // Get selected product IDs

    // Call service to apply promo to multiple products
    this.promosService.applyExistingPromoToProducts(promoId, selectedProductIds).subscribe(
      (response) => {
        console.log('Promo appliquée avec succès:', response);
        this.dialogRef.close(response); // Close dialog with success response
      },
      (error) => {
        console.error('Erreur lors de l\'application de la promotion:', error);
      }
    );
  }
}
