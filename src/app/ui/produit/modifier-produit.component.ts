import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../../services/Produit.service'; // Import your service
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor, *ngIf
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule for formGroup and formGroupName

@Component({
  selector: 'app-modifier-produit',
  templateUrl: './modifier-produit.component.html',
  styleUrls: ['./modifier-produit.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule] // Include CommonModule and ReactiveFormsModule here
})
export class ModifierProduitComponent implements OnInit {
  produitForm!: FormGroup;
  produitId!: number;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.produitId = this.route.snapshot.params['id']; // Get product ID from the route
    this.initForm();
    this.loadProduit();
  }

  initForm(): void {
    this.produitForm = this.fb.group({
      references: [''],
      nom_produit: ['', Validators.required],
      description: [''],
      composition: [''],
      entretien: [''],
      prix_initial: [0, [Validators.required, Validators.min(0)]],
      image_url: [''],
      images: this.fb.array([]), // FormArray for images
      mots_cles: [''],
      magasins: this.fb.array([]), // FormArray for magasins
      promo: this.fb.group({
        nom: [''],
        pourcentage_reduction: [''],
        date_debut: [''],
        date_fin: [''],
      }),
    });
  }

  loadProduit(): void {
    this.produitService.getProduitById(this.produitId).subscribe((response) => {
      const produit = response.produit;

      // Patch values for basic fields
      this.produitForm.patchValue({
        references: produit.references,
        nom_produit: produit.nom_produit,
        description: produit.description,
        composition: produit.composition,
        entretien: produit.entretien,
        prix_initial: produit.prix_initial,
        image_url: produit.image_url,
        mots_cles: produit.mots_cles,
        promo: {
          nom: produit.promos?.nom,
          pourcentage_reduction: produit.promos?.pourcentage_reduction,
          date_debut: produit.promos?.date_debut,
          date_fin: produit.promos?.date_fin,
        }
      });

      // Populate magasins and their nested sizes/colors
      produit.magasins.forEach((magasin: any) => {
        this.magasins.push(this.createMagasin(magasin));
      });

      // Populate images (if any)
      if (produit.images && produit.images.length > 0) {
        produit.images.forEach((image: any) => {
          this.images.push(this.fb.control(image));
        });
      }
    });
  }

  // Create magasin FormGroup with nested fields
  createMagasin(magasin: any = {}): FormGroup {
    return this.fb.group({
      nom: [magasin.nom || '', Validators.required],
      taille: [magasin.taille || '', Validators.required],
      couleur: [magasin.couleur || '', Validators.required],
      quantite: [magasin.quantite || 0, [Validators.required, Validators.min(1)]],
    });
  }

  // Add magasin
  addMagasin(): void {
    this.magasins.push(this.createMagasin());
  }

  // Remove magasin
  removeMagasin(index: number): void {
    this.magasins.removeAt(index);
  }

  // On image change
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.addImage(input.files[0]);
    }
  }

  // Add image to FormArray
  addImage(image: File | null): void {
    if (image) {
      this.images.push(this.fb.control(image));
    }
  }

  // Submit form data with FormData (for file handling)
  onSubmit(): void {
    if (this.produitForm.valid) {
      const formData = new FormData();
      const formValue = this.produitForm.value;

      // Append each field to FormData
      Object.keys(formValue).forEach((key) => {
        if (key === 'magasins' || key === 'promo') {
          formData.append(key, JSON.stringify(formValue[key]));
        } else if (key === 'images') {
          // Handle images as files
          formValue.images.forEach((image: File) => {
            formData.append('images[]', image);
          });
        } else {
          formData.append(key, formValue[key]);
        }
      });

      this.produitService.modifierProduit(this.produitId, formData).subscribe(
        (response) => {
          console.log('Produit mis à jour avec succès', response);
          this.router.navigate(['/produits']);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du produit', error);
        }
      );
    }
  }

  // Get magasins FormArray
  get magasins(): FormArray {
    return this.produitForm.get('magasins') as FormArray;
  }

  // Get images FormArray
  get images(): FormArray {
    return this.produitForm.get('images') as FormArray;
  }
}
