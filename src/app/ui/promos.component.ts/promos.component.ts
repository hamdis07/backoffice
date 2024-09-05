import { Component, OnInit } from '@angular/core';
import { PromosService } from '../../services/Promos.service';

@Component({
  selector: 'app-promo-manager',
  standalone: true,
  template: '',
  styles: []
})
export class PromoManagerComponent implements OnInit {
  idProduit: number = 0;
  promo: string = '';
  message: string = '';

  constructor(private promosService: PromosService) {}

  ngOnInit(): void {}

  ajouterPromos(): void {
    this.promosService.addPromo(this.idProduit, { promo: this.promo }).subscribe(
      () => {
        this.message = 'Promotion ajoutée avec succès';
      },
      error => {
        this.message = `Erreur lors de l'ajout de la promotion: ${error.message}`;
      }
    );
  }

  updatePromos(): void {
    this.promosService.updatePromo(this.idProduit, { promo: this.promo }).subscribe(
      () => {
        this.message = 'Promotion mise à jour avec succès';
      },
      error => {
        this.message = `Erreur lors de la mise à jour de la promotion: ${error.message}`;
      }
    );
  }

  updateOrCreatePromos(): void {
    this.promosService.updateOrCreatePromo(this.idProduit, { promo: this.promo }).subscribe(
      () => {
        this.message = 'Promotion mise à jour ou créée avec succès';
      },
      error => {
        this.message = `Erreur lors de la mise à jour ou de la création de la promotion: ${error.message}`;
      }
    );
  }

  removePromos(): void {
    this.promosService.removePromo(this.idProduit).subscribe(
      () => {
        this.message = 'Promotion supprimée avec succès';
      },
      error => {
        this.message = `Erreur lors de la suppression de la promotion: ${error.message}`;
      }
    );
  }
}
