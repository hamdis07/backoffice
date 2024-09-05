import { Component } from '@angular/core';
import { ProduitService } from '../../services/Produit.service'; // Adjust the import path as needed
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-filtre-produits',
  standalone: true,
  templateUrl: './filtrerproduits.component.html',
  styleUrls: ['./filtrerproduits.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class FiltreProduitsComponent {
  produits: any[] = [];
  filters: { [key: string]: string } = {
    categories: '',
    souscategories: '',
    genre: '',
    min_price: '',
    max_price: '',
    color: '',
    size: '',
    keyword: ''
  };

  constructor(private produitService: ProduitService) { }

  fetchProduits(): void {
    this.produitService.index(this.filters)
      .pipe(tap(data => this.produits = data))
      .subscribe({
        next: (data) => this.produits = data,
        error: (err) => console.error('Error fetching produits', err)
      });
  }

  applyFilters(): void {
    this.fetchProduits();
  }
}
