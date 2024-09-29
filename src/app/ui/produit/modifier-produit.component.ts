import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ProduitService } from '../../services/Produit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { isWithinInterval, parseISO } from 'date-fns';
import { catchError, throwError } from 'rxjs';

interface Couleur {
  nom: string;
  quantite: number;
}

interface Taille {
  nom: string;
  couleurs: Couleur[];
}

interface Magasin {
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
  responsable: string;
  telephone: string;
  tailles: Taille[];
  couleurs?: Couleur[];
}

interface Produit {
  references: string;
  nom_produit: string;
  description: string;
  prix_initial: number;
  composition: string;
  entretien: string;
  genre: string;
  categorie: string;
  sous_categorie: string;
  mots_cles: string[];
  images: File[];
  image_url: File;
  magasins: Magasin[];
  promo: {
    nom: string | null;
    pourcentage_reduction: number | null;
    date_debut: string | null;
    date_fin: string | null;
  };
}

@Component({
  selector: 'app-modifier-produit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './modifier-produit.component.html',
  styleUrls: ['./modifier-produit.component.scss']
})
export class ModifierProduitComponent implements OnInit {
  produitForm!: FormGroup;
  prixOriginal!: number;
  produitId!: number;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.produitId = +this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadProduit();
  }

  initializeForm(): void {
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
      images: this.fb.array([]), // Initialisation comme un tableau vide
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

    this.produitForm.get('promo.date_debut')?.valueChanges.subscribe(() => this.checkPromotion());
    this.produitForm.get('promo.date_fin')?.valueChanges.subscribe(() => this.checkPromotion());
  }

  createMagasin(): FormGroup {
    return this.fb.group({
      nom: [''],
      adresse: [''],
      ville: [''],
      code_postal: [''],
      responsable: [''],
      telephone: [''],
      tailles: this.fb.array([this.createTaille()]),
      couleurs: this.fb.array([]) // Initialisation à un tableau vide pour `couleurs`
    });
  }

  createTaille(): FormGroup {
    return this.fb.group({
      nom: [''],
      couleurs: this.fb.array([]) // Initialisation à un tableau vide pour `couleurs` dans une taille
    });
  }

  createCouleur(): FormGroup {
    return this.fb.group({
      nom: [''],
      quantite: ['']
    });
  }

  get magasins(): FormArray {
    return this.produitForm.get('magasins') as FormArray;
  }

  getTaille(magasinIndex: number): FormArray {
    return this.magasins.at(magasinIndex).get('tailles') as FormArray;
  }

  getCouleur(magasinIndex: number, tailleIndex: number): FormArray {
    return this.getTaille(magasinIndex).at(tailleIndex).get('couleurs') as FormArray;
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

  imagesValidator(control: AbstractControl) {
    if (control.value && control.value.length === 0) {
      return { required: true };
    }
    return null;
  }

  validateDateDebut(): Validators {
    return (control: AbstractControl) => {
      const endDate = this.produitForm?.get('promo.date_fin')?.value;
      const startDate = control.value;
      if (startDate && endDate && isWithinInterval(parseISO(startDate), { start: new Date(), end: parseISO(endDate) })) {
        return null;
      }
      return { invalidDateDebut: true };
    };
  }

  validateDateFin(): Validators {
    return (control: AbstractControl) => {
      const startDate = this.produitForm?.get('promo.date_debut')?.value;
      const endDate = control.value;
      if (startDate && endDate && isWithinInterval(parseISO(endDate), { start: parseISO(startDate), end: new Date() })) {
        return null;
      }
      return { invalidDateFin: true };
    };
  }

  validatePromoDates(group: FormGroup) {
    const startDate = group.get('date_debut')?.value;
    const endDate = group.get('date_fin')?.value;
    return startDate && endDate && startDate > endDate ? { invalidPromoDates: true } : null;
  }
  loadProduit(): void {
    this.produitService.getProduitById(this.produitId)
      .subscribe((produit: Produit) => {
        // Initialiser les valeurs du formulaire
        this.produitForm.patchValue({
          references: produit.references,
          nom_produit: produit.nom_produit,
          description: produit.description,
          prix_initial: produit.prix_initial,
          composition: produit.composition,
          entretien: produit.entretien,
          genre: produit.genre,
          categorie: produit.categorie,
          sous_categorie: produit.sous_categorie,
          mots_cles: produit.mots_cles,
          image_url: produit.image_url,
          promo: {
            nom: produit.promo.nom,
            pourcentage_reduction: produit.promo.pourcentage_reduction,
            date_debut: produit.promo.date_debut,
            date_fin: produit.promo.date_fin
          }
        });
  
        // Initialiser les images
        const imagesArray = this.produitForm.get('images') as FormArray;
        if (Array.isArray(produit.images)) {
          produit.images.forEach((image: File) => {
            imagesArray.push(this.fb.control(image));
          });
        }
  
        // Initialiser les magasins
        const magasinsArray = this.produitForm.get('magasins') as FormArray;
        if (Array.isArray(produit.magasins)) {
          produit.magasins.forEach((magasin: Magasin) => {
            magasinsArray.push(this.createMagasinFromData(magasin));
          });
        }
      }, error => console.error(error));
  }
  
  
  
  createMagasinFromData(data: Magasin): FormGroup {
    const magasin = this.createMagasin();
    magasin.patchValue(data);
    magasin.setControl('tailles', this.fb.array(data.tailles.map((taille: Taille) => this.createTailleFromData(taille))));
    magasin.setControl('couleurs', this.fb.array(data.couleurs ? data.couleurs.map((couleur: Couleur) => this.createCouleurFromData(couleur)) : []));
    return magasin;
  }

  createTailleFromData(data: Taille): FormGroup {
    const taille = this.createTaille();
    taille.patchValue(data);
    taille.setControl('couleurs', this.fb.array(data.couleurs ? data.couleurs.map((couleur: Couleur) => this.createCouleurFromData(couleur)) : []));
    return taille;
  }

  createCouleurFromData(data: Couleur): FormGroup {
    const couleur = this.createCouleur();
    couleur.patchValue(data);
    return couleur;
  }onFileChange(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      if (type === 'images') {
        const imagesArray = this.produitForm.get('images') as FormArray;
        files.forEach(file => {
          imagesArray.push(this.fb.control(file));
        });
      } else if (type === 'image_url') {
        if (files.length > 0) {
          this.produitForm.patchValue({ image_url: files[0] });
        }
      }
    }
  }
  

  onSubmit(): void {
    if (this.produitForm.valid) {
      const formData = new FormData();
      Object.keys(this.produitForm.controls).forEach((key) => {
        const control = this.produitForm.get(key);
        
        if (control instanceof FormArray) {
          control.controls.forEach((item, index) => {
            if (key === 'images') {
              const files: File[] = Array.from(item.value || []);
              files.forEach((file) => {
                formData.append(`${key}[${index}]`, file);
              });
            } else if (key === 'magasins') {
              formData.append(key, JSON.stringify(item.value));
            } else {
              formData.append(key, item.value);
            }
          });
        
        } else {
          formData.append(key, control?.value);
        }
      });
  
      this.produitService.modifierProduit(this.produitId, formData)
        .pipe(
          catchError(err => {
            console.error('Erreur lors de la modification du produit', err);
            return throwError(err);
          })
        )
        .subscribe(() => {
          this.router.navigate(['/produits']);
        });
    }
  }
  

  // onFileChange(event: Event, field: string): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files) {
  //     const file = input.files[0];
  //     this.produitForm.patchValue({
  //       [field]: file
  //     });
  //   }
  // }
  

  checkPromotion(): void {
    const promoControl = this.produitForm.get('promo');
    if (promoControl) {
      const startDate = promoControl.get('date_debut')?.value;
      const endDate = promoControl.get('date_fin')?.value;
      if (startDate && endDate) {
        const isValid = isWithinInterval(parseISO(startDate), { start: new Date(), end: parseISO(endDate) });
        promoControl.get('pourcentage_reduction')?.setValidators(isValid ? [Validators.required, Validators.min(0), Validators.max(100)] : null);
        promoControl.get('pourcentage_reduction')?.updateValueAndValidity();
      }
    }
  }
}
