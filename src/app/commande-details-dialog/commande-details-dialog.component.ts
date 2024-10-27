import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommandeService } from '../services/commande.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule for mat-dialog-content
//import { MatExpansionModule } from '@angular/material/expansion';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-commande-details-dialog',
  standalone: true,
  templateUrl: './commande-details-dialog.component.html',
  styleUrls: ['./commande-details-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class CommandeDetailsDialogComponent implements OnInit {
  commandeDetails: any;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    const commandeId = this.route.snapshot.paramMap.get('id');
    console.log('Commande ID:', commandeId); // Vérifiez l'ID
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
