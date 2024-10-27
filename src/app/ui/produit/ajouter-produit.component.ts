import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ProduitService } from '../../services/Produit.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { isWithinInterval, parseISO } from 'date-fns';

@Component({
  selector: 'app-ajouter-produit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './ajouter-produit.component.html',
  styleUrls:   ['ajouter-produit.component.scss'],
})
export class AjouterProduitComponent implements OnInit {
  produitForm!: FormGroup;
  prixOriginal!: number;

  constructor(private fb: FormBuilder, private produitService: ProduitService) {}

  ngOnInit(): void {
    this.produitForm = this.fb.group({
      references: ['', Validators.required],
      nom_produit: ['', Validators.required],
      description: ['', Validators.required],
      prix_initial: ['', [Validators.required, Validators.min(0)]],
      composition: ['', Validators.required],
      entretien: ['', Validators.required],
      genre: ['', Validators.required],
      categorie: ['', Validators.required],
      sous_categorie: ['', Validators.required],
      mots_cles: [''],
      images: [[], [Validators.required, this.imagesValidator]],
      image_url: [''],
      magasins: this.fb.array([this.createMagasin()]),
      promo: this.fb.group({
        nom: [null],
        pourcentage_reduction: [null, [Validators.min(0), Validators.max(100)]],
        date_debut: [null, this.validateDateDebut()],
        date_fin: [null, this.validateDateFin()],
      }, { validator: this.validatePromoDates })
    });


    this.prixOriginal = this.produitForm.get('prix_initial')?.value;
    this.checkPromotion();
    
    // Observers for date_debut and date_fin
    this.produitForm.get('promo.date_debut')?.valueChanges.subscribe(() => this.checkPromotion());
    this.produitForm.get('promo.date_fin')?.valueChanges.subscribe(() => this.checkPromotion());

  }

  imagesValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const files: File[] = control.value;
    if (!files.length) {
      return { 'required': true };
    }
    for (let file of files) {
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
        return { 'mimes': true };
      }
      if (file.size > 2048 * 1024) { // 2048 KB
        return { 'max': true };
      }
    }
    return null;
  }

  validateDateDebut(): (control: AbstractControl) => { [key: string]: any } | null {
    return (control: AbstractControl) => {
      const dateDebut = control.value;
      if (dateDebut && isNaN(Date.parse(dateDebut))) {
        return { 'invalidDateDebut': 'Invalid start date' };
      }
      return null;
    };
  }

  validateDateFin(): (control: AbstractControl) => { [key: string]: any } | null {
    return (control: AbstractControl) => {
      const dateFin = control.value;
      if (dateFin && isNaN(Date.parse(dateFin))) {
        return { 'invalidDateFin': 'Invalid end date' };
      }
      return null;
    };
  }

  validatePromoDates(group: FormGroup): { [key: string]: any } | null {
    const dateDebut = group.get('date_debut')?.value;
    const dateFin = group.get('date_fin')?.value;
    if (dateDebut && dateFin && new Date(dateDebut) > new Date(dateFin)) {
      return { 'dateMismatch': 'End date must be after start date' };
    }
    return null;
  }

  get magasins(): FormArray {
    return this.produitForm.get('magasins') as FormArray;
  }

  createMagasin(): FormGroup {
    return this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      code_postal: ['', Validators.required],
      responsable: ['', Validators.required],
      telephone: ['', Validators.required],
      tailles: this.fb.array([this.createTaille()])
    });
  }

  getTaille(magasinIndex: number): FormArray {
    return this.magasins.at(magasinIndex).get('tailles') as FormArray;
  }

  createTaille(): FormGroup {
    return this.fb.group({
      nom: ['', Validators.required],
      couleurs: this.fb.array([this.createCouleur()])
    });
  }

  getCouleur(magasinIndex: number, tailleIndex: number): FormArray {
    return this.getTaille(magasinIndex).at(tailleIndex).get('couleurs') as FormArray;
  }

  createCouleur(): FormGroup {
    return this.fb.group({
      nom: ['', Validators.required],
      quantite: ['', [Validators.required, Validators.min(1)]]
    });
  }

  addMagasin(): void {
    this.magasins.push(this.createMagasin());
  }

  removeMagasin(index: number): void {
    this.magasins.removeAt(index);
  }

  addTaille(magasinIndex: number): void {
    this.getTaille(magasinIndex).push(this.createTaille());
  }

  removeTaille(magasinIndex: number, tailleIndex: number): void {
    this.getTaille(magasinIndex).removeAt(tailleIndex);
  }

  addCouleur(magasinIndex: number, tailleIndex: number): void {
    this.getCouleur(magasinIndex, tailleIndex).push(this.createCouleur());
  }

  removeCouleur(magasinIndex: number, tailleIndex: number, couleurIndex: number): void {
    this.getCouleur(magasinIndex, tailleIndex).removeAt(couleurIndex);
  }

  onFileChange(event: any, controlName: string): void {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.produitForm.patchValue({
        [controlName]: files
      });
    }
  }


  checkPromotion(): void {
    const promoGroup = this.produitForm.get('promo') as FormGroup;
    const dateDebut = promoGroup.get('date_debut')?.value;
    const dateFin = promoGroup.get('date_fin')?.value;
    const prixInitial = this.prixOriginal;

    if (dateDebut && dateFin) {
        const start = parseISO(dateDebut).getTime();
        const end = parseISO(dateFin).getTime();
        const currentDate = Date.now();
        const pourcentageReduction = promoGroup.get('pourcentage_reduction')?.value || 0;

        // Si la date de début est dans le futur, ou si la date de fin est passée, pas de promotion
        if (currentDate < start || currentDate > end) {
            this.produitForm.patchValue({ prix_initial: prixInitial });
        } else if (currentDate >= start && currentDate <= end) {
            // Si la promotion est active
            const prixReduit = prixInitial * (1 - pourcentageReduction / 100);
            this.produitForm.patchValue({ prix_initial: prixReduit });
        }
    } else {
        // Revenir au prix initial si les dates sont manquantes ou non valides
        this.produitForm.patchValue({ prix_initial: prixInitial });
    }
}



  onSubmit(): void {
    if (this.produitForm.valid) {
      const formData = new FormData();
      
      Object.keys(this.produitForm.controls).forEach(key => {
        const control = this.produitForm.get(key);
        
        if (control instanceof FormArray) {
          control.controls.forEach((group, index) => {
            if (group instanceof FormGroup) {
              Object.keys(group.controls).forEach(subKey => {
                const subControl = group.get(subKey);
                if (subControl instanceof FormArray) {
                  subControl.controls.forEach((subGroup, subIndex) => {
                    if (subGroup instanceof FormGroup) {
                      Object.keys(subGroup.controls).forEach(subSubKey => {
                        const subSubControl = subGroup.get(subSubKey);
                        if (subSubControl instanceof FormArray && subSubKey === 'couleurs') {
                          subSubControl.controls.forEach((subSubSubGroup, subSubIndex) => {
                            if (subSubSubGroup instanceof FormGroup) {
                              Object.keys(subSubSubGroup.controls).forEach(subSubSubKey => {
                                formData.append(`${key}[${index}][${subKey}][${subIndex}][${subSubKey}][${subSubIndex}][${subSubSubKey}]`, subSubSubGroup.get(subSubSubKey)?.value);
                              });
                            }
                          });
                        } else {
                          formData.append(`${key}[${index}][${subKey}][${subIndex}][${subSubKey}]`, subSubControl?.value);
                        }
                      });
                    }
                  });
                } else {
                  formData.append(`${key}[${index}][${subKey}]`, subControl?.value);
                }
              });
            }
          });
        } else if (control instanceof FormGroup && key === 'promo') {
          // Handle promo group specifically
          Object.keys(control.controls).forEach(subKey => {
            if (control.get(subKey)?.value !== null) {
              formData.append(`${key}[${subKey}]`, control.get(subKey)?.value);
            }
          });
        } else {
          if (key === 'images') {
            const files: File[] = Array.from(control?.value || []);
            files.forEach((file, index) => {
              formData.append(`${key}[${index}]`, file);
            });
          } else if (key === 'image_url') {
            const files: File[] = Array.from(control?.value || []);
            if (files.length > 0) {
              formData.append(key, files[0]);
            }
          } else {
            formData.append(key, control?.value);
          }
        }
      });
  
      this.produitService.ajouterProduit(formData).subscribe(
        (response: any) => {
          console.log('Produit ajouté avec succès', response);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout du produit', error);
          if (error.status === 400) {
            console.error('Validation errors:', error.error.errors);
          }
        }
      );
    } else {
      console.error('Le formulaire est invalide');
    }
  }
}
