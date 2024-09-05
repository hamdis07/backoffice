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
        this.produitForm.patchValue(produit);
  
        // Assurez-vous que `produit.magasins` est bien un tableau
        const magasinsArray = Array.isArray(produit.magasins) ? produit.magasins : [];
        this.produitForm.setControl('magasins', this.fb.array(magasinsArray.map((magasin: Magasin) => this.createMagasinFromData(magasin))));
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
  }

  onSubmit(): void {
    if (this.produitForm.valid) {
      this.produitService.modifierProduit(this.produitId, this.produitForm.value)
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

  onFileChange(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      if (type === 'images') {
        const images = this.produitForm.get('images') as FormArray;
        files.forEach(file => {
          images.push(this.fb.control(file));
        });
      } else if (type === 'image_url') {
        this.produitForm.patchValue({ image_url: files[0] });
      }
    }
  }

  checkPromotion(): void {
    const promo = this.produitForm.get('promo')?.value;
    const dateDebut = new Date(promo.date_debut);
    const dateFin = new Date(promo.date_fin);
    const today = new Date();

    if (promo.date_debut && promo.date_fin && (today >= dateDebut && today <= dateFin)) {
      this.produitForm.get('prix_initial')?.setValue(this.prixOriginal - (this.prixOriginal * (promo.pourcentage_reduction || 0) / 100));
    } else {
      this.produitForm.get('prix_initial')?.setValue(this.prixOriginal);
    }
  }
}
