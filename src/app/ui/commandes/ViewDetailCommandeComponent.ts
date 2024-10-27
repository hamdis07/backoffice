import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule if needed
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-view-detail-commande',
  standalone: true,
  templateUrl: './view-detail-commande.component.html',
  styleUrls: ['./view-detail-commande.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule, // Add MatExpansionModule here
    MatListModule, // Add MatListModule here
    MatIconModule, // Add MatIconModule if needed
    MatProgressSpinnerModule,
        MatGridListModule
  ]
})
export class ViewDetailCommandeComponent implements OnInit {
  commandeDetails: any;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    const commandeId = this.route.snapshot.paramMap.get('id');
    if (commandeId) {
      const id = Number(commandeId);
      if (!isNaN(id)) {
        this.loadCommandeDetails(id);
      } else {
        this.error = 'ID de commande invalide';
      }
    } else {
      this.error = 'ID de commande manquant';
    }
  }

  loadCommandeDetails(id: number): void {
    this.commandeService.getCommandeDetails(id).pipe(
      catchError(err => {
        this.error = 'Erreur lors du chargement des détails de la commande';
        console.error(err);
        return of(null);
      })
    ).subscribe(data => {
      console.log('Données reçues :', data); // Ajoutez ce log
      if (data) {
        this.commandeDetails = data.commande;
        this.error = ''; // Réinitialiser l'erreur uniquement si les détails sont chargés avec succès
      }
    });
  }
  
  
  

  exportCommandePDF(commandeId: number): void {
    this.commandeService.exporterCommandePDF(commandeId).pipe(
      catchError(err => {
        this.error = 'Erreur lors de l\'exportation en PDF';
        console.error(err);
        return [];
      })
    ).subscribe((pdfBlob: Blob) => {
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl);
    });
  }
}
