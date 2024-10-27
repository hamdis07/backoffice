import { Component, OnInit } from '@angular/core';
import { PubliciteService } from '../../services/publicites.service';
import { MatDialog } from '@angular/material/dialog';
import { EditPubliciteDialogComponent } from '../../adddpublicitedialog/edit-publicite-dialog.component';
//import { AddCategoryDialogComponent } from '../../add-category-dialog.component/add-category-dialog.component';
//import { EditCategoryDialogComponent } from '../../add-category-dialog.component/edit-category-dialog.component';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AddPubliciteDialogComponent } from '../../adddpublicitedialog/add-publicite-dialog.component';
@Component({
  selector: 'app-publicite-list',
  standalone: true,
  templateUrl: './publicite-list.component.html',
  styleUrls: ['./publicite-list.component.scss'],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    FormsModule
  ]
})
export class PubliciteListComponent implements OnInit {
  publicites: any[] = [];
  search: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  errorMessage: string | null = null;

  constructor(private publiciteService: PubliciteService, private router:Router ,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPublicites();
  }
  createPublicite(): void {
    const dialogRef = this.dialog.open(AddPubliciteDialogComponent, {
      width: '600px',height:'600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPublicites(); // Reload publicités after adding
      }
    });
  }
  // Méthode pour charger les publicités avec pagination
  loadPublicites(): void {
    this.publiciteService.getPublicites(this.currentPage).subscribe({
      next: (response: any) => {
        this.publicites = response.data;
        this.totalPages = response.totalPages;
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'Erreur lors de la récupération des publicités';
      }
    });
  }
  
//   searchPublicites(): void {
//     this.publiciteService.searchPublicites(this.search).subscribe({
//       next: (response: any) => {
//         this.publicites = response.data;
//         this.totalPages = response.totalPages;
//       },
//       error: (error: any) => {
//         this.errorMessage = error.message || 'Erreur lors de la recherche des publicités';
//       }
//     });
//   }
  

viewPublicite(id: number): void {
  this.publiciteService.getPubliciteById(id).subscribe({
    next: (data) => {
      console.log('Affichage des détails de la publicité avec ID :', id);
      // Naviguer vers la page des détails de la publicité en passant l'ID
      this.router.navigate(['/publicite', id]);
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des détails de la publicité', error);
    }
  });
}

  editPublicite(publicite: any): void {
    console.log('Publicite à éditer:', publicite); // Vérifiez que l'ID est bien défini
    const dialogRef = this.dialog.open(EditPubliciteDialogComponent, {
        data: { publicite },       width: '600px',height:'600px',
        // Pass the publicite to be edited
    });

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            // Update the publicite list after successful edit
            this.loadPublicites();
        }
    });
}

  // Méthode pour supprimer une publicité
  deletePublicite(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      this.publiciteService.deletePublicite(id).subscribe({
        next: () => {
          this.publicites = this.publicites.filter(publicite => publicite.id !== id);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erreur lors de la suppression de la publicité';
        }
      });
    }
  }

  // Méthode pour changer de page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPublicites();
    }
  }
}
