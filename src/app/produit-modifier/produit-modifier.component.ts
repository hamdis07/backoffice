import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProduitService } from '../services/Produit.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-produit-modifier',
  standalone:true,
  imports: [MatDialogModule,CommonModule, ReactiveFormsModule],

  templateUrl: './produit-modifier.component.html',
  styleUrls: ['./produit-modifier.component.scss']
})
export class ProduitModifierComponent implements OnInit {
  produitForm!: FormGroup;
  showPromo = false;

  constructor(
    public dialogRef: MatDialogRef<ProduitModifierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private fb: FormBuilder,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    this.produitForm = this.fb.group({
      references: [''],
      nom_produit: [''],
      description: [''],
      prix_initial: ['', Validators.min(1)],
      composition: [''],
      entretien: [''],
      genre: [''],
      categorie: [''],
      sous_categorie: [''],
      mots_cles: [''],
      images: [''],
      image_url: [''],
      magasins: this.fb.array([]),
      promo: this.fb.group({
        nom: [''],
        date_debut: [''],
        date_fin: [''],
        pourcentage_reduction: ['', [Validators.min(0), Validators.max(100)]]
      })
    });
  
    this.loadProduitDetails(this.data.id);
  }
  

  get magasins(): FormArray {
    return this.produitForm.get('magasins') as FormArray;
  }

  // Methods to dynamically add magasins, tailles, couleurs...
  addMagasin(): void {
    const magasinForm = this.fb.group({
      nom: [''], // Optional field, no Validators.required
      adresse: [''], // Optional field, no Validators.required
      ville: [''], // Optional field, no Validators.required
      code_postal: [''], // Optional field, no Validators.required
      responsable: [''], // Optional field, no Validators.required
      telephone: [''], // Optional field, no Validators.required
      tailles: this.fb.array([]) // Remains as is
    });
    this.magasins.push(magasinForm);
  }
  

  // Add Taille
  addTaille(magasinIndex: number): void {
    const taillesArray = (this.magasins.at(magasinIndex).get('tailles') as FormArray);
    const tailleForm = this.fb.group({
      nom: ['', Validators.required],
      couleurs: this.fb.array([])
    });
    taillesArray.push(tailleForm);
  }

  // Add Couleur
  addCouleur(magasinIndex: number, tailleIndex: number): void {
    const couleursArray = (this.magasins.at(magasinIndex).get('tailles') as FormArray).at(tailleIndex).get('couleurs') as FormArray;
    const couleurForm = this.fb.group({
      nom: ['', Validators.required],
      quantite: ['', [Validators.required, Validators.min(1)]]
    });
    couleursArray.push(couleurForm);
  }

  // Load product details (mockup; you can adjust as needed)
  loadProduitDetails(id: number): void {
    this.produitService.getProduitById(id).subscribe(produit => {
      // Patch basic product details
      this.produitForm.patchValue({
        references: produit.references || '',
        nom_produit: produit.nom_produit || '',
        description: produit.description || '',
        prix_initial: produit.prix_initial || '',
        composition: produit.composition || '',
        entretien: produit.entretien || '',
        genre: produit.genre || '',
        categorie: produit.categorie || '',
        sous_categorie: produit.sous_categorie || '',
        mots_cles: produit.mots_cles || ''
      });
  
      // Reset magasins form array
      this.magasins.clear();
  
      // Handle magasins, tailles, couleurs
      produit.magasins.forEach((magasin: any) => {
        const magasinGroup = this.fb.group({
          nom: [magasin.nom || ''],
          adresse: [magasin.adresse || ''],
          ville: [magasin.ville || ''],
          code_postal: [magasin.code_postal || ''],
          responsable: [magasin.responsable || ''],
          telephone: [magasin.telephone || ''],
          tailles: this.fb.array(magasin.tailles.map((taille: any) => this.fb.group({
            nom: [taille.nom || ''],
            couleurs: this.fb.array(taille.couleurs.map((couleur: any) => this.fb.group({
              nom: [couleur.nom || ''],
              quantite: [couleur.quantite || '', [Validators.min(1)]]
            })))
          })))
        });
        this.magasins.push(magasinGroup);
      });
    });
  }
  
  

  // Handle file changes
  onFileChange(event: any, controlName: string): void {
    const file = event.target.files[0]; // assuming single file upload; adjust for multiple files
    if (file) {
      this.produitForm.get(controlName)?.setValue(file);
    }
  }

  // Handle form submission
  onSubmit(): void {
    // Initialize FormData
    const formData = new FormData();
  
    // Iterate over form controls to append data to FormData
    Object.keys(this.produitForm.controls).forEach(key => {
      const control = this.produitForm.get(key);
  
      // Check if control is a FormArray (for magasins and other collections)
      if (control instanceof FormArray) {
        control.controls.forEach((ctrl, index) => {
          // If it's the 'magasins' FormArray, handle nested tailles and couleurs
          if (key === 'magasins') {
            const magasin = ctrl.value;
            magasin.tailles.forEach((taille: any, tailleIndex: number) => {
              taille.couleurs.forEach((couleur: any, couleurIndex: number) => {
                // Append nested color quantities to FormData
                formData.append(`magasins[${index}][tailles][${tailleIndex}][couleurs][${couleurIndex}][quantite]`, couleur.quantite);
                formData.append(`magasins[${index}][tailles][${tailleIndex}][couleurs][${couleurIndex}][nom]`, couleur.nom);
              });
              // Append size names
              formData.append(`magasins[${index}][tailles][${tailleIndex}][nom]`, taille.nom);
            });
            // Append magasin fields
            formData.append(`magasins[${index}][nom]`, magasin.nom);
            formData.append(`magasins[${index}][adresse]`, magasin.adresse);
            formData.append(`magasins[${index}][ville]`, magasin.ville);
            formData.append(`magasins[${index}][code_postal]`, magasin.code_postal);
            formData.append(`magasins[${index}][responsable]`, magasin.responsable);
            formData.append(`magasins[${index}][telephone]`, magasin.telephone);
          } else {
            // For other FormArrays, append values
            formData.append(`${key}[${index}]`, JSON.stringify(ctrl.value));
          }
        });
      } else {
        // Handle normal controls (non-FormArray)
        const value = control?.value;
        if (value !== null && value !== undefined && value !== '') {
          // Check if the control is for files (images)
          if (key === 'images' || key === 'image_url') {
            const files = (control as FormControl).value as FileList;
            if (files) {
              for (let i = 0; i < files.length; i++) {
                formData.append(`${key}[]`, files[i]);
              }
            }
          } else {
            // Append other control values
            formData.append(key, value);
          }
        }
      }
    });
  
    // Check if the form is valid before submission
    if (this.produitForm.valid) {
      if (this.data.id) {
        // Modify product if ID exists
        this.produitService.modifierProduit(this.data.id, formData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: err => {
            console.error('Error updating product:', err);
          }
        });
      } else {
        console.error('Product ID is undefined');
      }
    }
  }
  
  removeCouleur(magasinIndex: number, tailleIndex: number, couleurIndex: number): void {
    const couleursArray = this.getCouleur(magasinIndex, tailleIndex);
    couleursArray.removeAt(couleurIndex);
  }
  
  removeTaille(magasinIndex: number, tailleIndex: number) {
    const magasins = this.produitForm.get('magasins') as FormArray;
    const tailles = magasins.at(magasinIndex).get('tailles') as FormArray;
    tailles.removeAt(tailleIndex);
  }

  // Define the removeMagasin method
  removeMagasin(magasinIndex: number) {
    const magasins = this.produitForm.get('magasins') as FormArray;
    magasins.removeAt(magasinIndex);
  }

  // Define the save method
  save() {
    if (this.produitForm.valid) {
      // Handle saving logic here
      console.log('Form saved', this.produitForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
  getTaille(magasinIndex: number): FormArray {
    return this.magasins.at(magasinIndex).get('tailles') as FormArray;
  }

  getCouleur(magasinIndex: number, tailleIndex: number): FormArray {
    return this.getTaille(magasinIndex).at(tailleIndex).get('couleurs') as FormArray;
  }

  // Cancel dialog
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  togglePromo() {
    this.showPromo = !this.showPromo;
  }

}
