import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from '../../services/Produit.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal,NgbModalModule  } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal
import { ProduitModifierComponent } from '../../produit-modifier/produit-modifier.component';

@Component({
  standalone: true,
  selector: 'app-produit-list',
  imports: [FormsModule, CommonModule,NgbModalModule ], // Change NgbModule to NgbModal
  templateUrl: './produit-list.component.html',
  styleUrls: ['./produit-list.component.scss']
})
export class ProduitListComponent implements OnInit {
  produits: any[] = [];
  errorMessage: string | null = null;
  currentPage = 1;
  totalPages = 0;
  search: string = ''; // Initialize search term as an empty string

  constructor(
    private produitService: ProduitService,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal // Inject NgbModal
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getProduits(this.currentPage).subscribe(
      data => {
        console.log('API response:', data);
        this.produits = data.produits.map((item: any) => ({
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
          quantites: item.quantites.map((quantite: any) => ({
            quantite: quantite.quantite,
            taille: quantite.taille || 'Non spécifié',
            couleur: quantite.couleur || 'Non spécifié',
            magasin: quantite.magasin || 'Non spécifié'
          })),
          images: item.images.map((image: any) => ({
            url: image.url,
            alt: image.alt || 'Image du produit'
          }))
        }));
        this.totalPages = data.total_pages;
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

  navigateToProduitDetails(id: number): void {
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

  featureProduct(id: number): void {
    this.produitService.featureProduct(id).subscribe(
      () => {
        console.log('Produit mis en avant.');
        this.loadProduits(); // Recharger les produits après modification
      },
      error => {
        console.error('Error featuring product:', error);
      }
    );
  }

  unfeatureProduct(id: number): void {
    this.produitService.unfeatureProduct(id).subscribe(
      () => {
        console.log('Produit retiré de la mise en avant.');
        this.loadProduits();
      },
      error => {
        console.error('Error unfeaturing product:', error);
      }
    );
  }

  hideProduct(id: number): void {
    this.produitService.hideProduct(id).subscribe(
      () => {
        console.log('Produit masqué.');
        this.loadProduits();
      },
      error => {
        console.error('Error hiding product:', error);
      }
    );
  }

  unhideProduct(id: number): void {
    this.produitService.unhideProduct(id).subscribe(
      () => {
        console.log('Produit rendu visible.');
        this.loadProduits();
      },
      error => {
        console.error('Error unhiding product:', error);
      }
    );
  }

  // Pagination
  changePage(page: number): void {
    this.currentPage = page;
    this.loadProduits();
  }

  searchProduits(searchTerm: string): void {
    if (searchTerm) {
      // Apply search logic, e.g., filter products by name or other criteria
      this.produits = this.produits.filter(product => 
        product.nom_produit.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // If search is empty, reload all products
      this.loadProduits();
    }
  }

  toggleVisibility(produitId: number, isHidden: boolean): void {
    if (isHidden) {
      this.hideProduct(produitId);
    } else {
      this.unhideProduct(produitId);
    }
  }

  toggleFeature(id: number, isFeatured: boolean): void {
    if (isFeatured) {
      this.unfeatureProduct(id); // Calls the method to remove the product from being featured
    } else {
      this.featureProduct(id); // Calls the method to feature the product
    }
  }

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(ProduitModifierComponent, {
      // Ensure productId is correctly set
     width: '1000px',
     height:'1000px',
      data: { id: id } // Pass the product ID to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
