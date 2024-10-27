import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommandeService } from '../../services/commande.service';
import { UserService } from '../../services/user.service';
import { ProduitService } from '../../services/Produit.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-create-commande',
  templateUrl: './create-commande.component.html',
  styleUrls: ['./create-commande.component.scss']
})


export class CreateCommandeComponent implements OnInit {
  commandeForm: FormGroup;
  loading = false;
  users: any[] = [];
  availableProducts: any[] = [];
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private commandeService: CommandeService,
    private router: Router
  ) {
    this.commandeForm = this.fb.group({
      user_id: ['', [Validators.required]],
      adresse: ['', [Validators.required, Validators.maxLength(255)]],
      ville: ['', [Validators.required, Validators.maxLength(255)]],
      code_postal: ['', [Validators.required, Validators.maxLength(10)]],
      telephone: ['', [Validators.required, Validators.maxLength(20)]],
      methode_paiement: ['', [Validators.required]],
      description:['', [Validators.required]],
      
      produits: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadProducts();
  }

  loadUsers() {
    this.commandeService.getUsers().subscribe(
      (data: any[]) => {
        this.users = data;
        console.log('Users loaded:', this.users); // Vérifiez que les utilisateurs sont chargés
      },
      (error: any) => {
        console.error('Error loading users:', error);
      }
    );
  }

  loadProducts() {
    this.commandeService.getProduits().subscribe(
      (data: any[]) => {
        this.availableProducts = data;
        console.log('Products loaded:', this.availableProducts); // Vérifiez que les produits sont chargés
      },
      (error: any) => {
        console.error('Error loading products:', error);
      }
    );
  }

  get produits(): FormArray {
    return this.commandeForm.get('produits') as FormArray;
  }

  addProduit(): void {
    this.produits.push(this.fb.group({
      id: ['', [Validators.required]],
      quantite: [1, [Validators.required, Validators.min(1)]],
      taille: [''],
      couleur: ['']
    }));
  }

  removeProduit(index: number): void {
    this.produits.removeAt(index);
  }

  onClientChange(event: Event): void {
    const selectedClientId = (event.target as HTMLSelectElement).value;
    console.log('Client selected:', selectedClientId); // Vérification de l'ID du client

    const selectedClient = this.users.find(user => user.id === selectedClientId);

    if (selectedClient) {
      this.commandeForm.patchValue({
        adresse: selectedClient.adresse,
        ville: selectedClient.ville,
        code_postal: selectedClient.code_postal,
        telephone: selectedClient.telephone
      });
    }
  }

  onProduitChange(index: number): void {
    const selectedProductId = this.produits.at(index).get('id')?.value;
    console.log('Product selected:', selectedProductId);
  }

  onSubmit(): void {
    if (this.commandeForm.invalid) {
      return;
    }
  
    this.loading = true;
    const commandeData = this.commandeForm.value;
  
    console.log('Données de la commande envoyée:', commandeData); // Ajoutez cette ligne pour vérifier les données
  
    this.commandeService.commanderPourClient(commandeData).subscribe({
      next: (response) => {
        console.log('Commande créée avec succès:', response);
        this.router.navigate(['/commandes']);
      },
      error: (err) => {
        console.error('Erreur lors de la création de la commande:', err);
        this.error = 'Une erreur est survenue lors de la création de la commande.';
        this.loading = false;
      }
    });
  }
}  