import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from '../../services/Produit.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-produit-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './produit-list.component.html',
})
export class ProduitListComponent implements OnInit {
  produits: any[] = [];
  errorMessage: string | null = null;

  constructor(private produitService: ProduitService, private router: Router) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getProduits().subscribe(
      data => {
        console.log('API response:', data);
        this.produits = data.produits.map((item: any) => {
          return {
            id: item.produit.id,
            references: item.produit.references,
            nom_produit: item.produit.nom_produit,
            description: item.produit.description,
            prix_initial: item.produit.prix_initial,
            prix: item.produit.prix,
            composition: item.produit.composition,
            entretien: item.produit.entretien,
            mots_cles: item.produit.mots_cles,
            image_url: item.produit.image_url,
            created_at: item.produit.created_at,
            updated_at: item.produit.updated_at,
            promo_id: item.produit.promo_id,
            categorie_id: item.produit.categorie_id,
            souscategories_id: item.produit.souscategories_id,
            genre_id: item.produit.genre_id,
            quantites: item.quantites.map((quantite: any) => {
              return {
                quantite: quantite.quantite,
                taille: quantite.taille || 'Non spécifié',
                couleur: quantite.couleur || 'Non spécifié',
                magasin: quantite.magasin || 'Non spécifié'
              };
            }),
            images: item.images.map((image: any) => {
              return {
                url: image.url,
                alt: image.alt || 'Image du produit'
              };
            })
          };
        });
      },
      error => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Une erreur est survenue lors du chargement des produits.';
      }
    );
  }
  navigateToAjouterProduit(): void {
    this.router.navigate(['/ajouter-produit']);
  }
  navigateToModifierProduit(id: number): void {
    this.router.navigate(['/modifier-produit', id]);

  }

  navigateToProduitDetails(id: number):void{
    this.router.navigate(['/produitDetails', id]);

  }

  supprimerProduit(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.produitService.supprimerProduit(id).subscribe(
        () => {
          this.produits = this.produits.filter(produit => produit.id !== id);
          console.log('Produit supprimé avec succès.');
        },
        error => {
          console.error('Error deleting produit:', error);
          this.errorMessage = 'Une erreur est survenue lors de la suppression du produit.';
        }
      );
    }
  }
}
