// view-publicite.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PubliciteService } from '../../services/publicites.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-publicite',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div *ngIf="publicite">
      <h1>Détails de la Publicité</h1>
      <p><strong>ID :</strong> {{ publicite.id }}</p>
      <p><strong>Nom :</strong> {{ publicite.nom }}</p>
      <p><strong>Description :</strong> {{ publicite.description }}</p>
      <p><strong>Date de début :</strong> {{ publicite.date_debut }}</p>
      <p><strong>Date de fin :</strong> {{ publicite.date_fin }}</p>
      <!-- Ajoutez plus de champs ici -->
    </div>
    <div *ngIf="loading">
      <p>Chargement...</p>
    </div>
    <div *ngIf="error">
      <p>Erreur lors de la récupération de la publicité.</p>
    </div>
  `
})
export class ViewPubliciteComponent implements OnInit {
  publicite: any;
  loading = true;
  error = false;

  constructor(
    private publiciteService: PubliciteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getPublicite(id);
    }
  }

  getPublicite(id: number): void {
    this.publiciteService.getPubliciteById(id).subscribe({
      next: (data) => {
        this.publicite = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
