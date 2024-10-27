import { Component, OnInit } from '@angular/core';
import { SousCategorieService } from '../../services/souscategories.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddSousCategorieDialogComponent } from '../../add-sous-categorie-dialog.component/add-sous-categorie-dialog.component';
import { EditSousCategorieDialogComponent } from '../../add-sous-categorie-dialog.component/edit-sous-categorie-dialog.component'; 
    @Component({
  selector: 'app-sous-categorie-list',
  standalone: true,
  templateUrl: './sous-categorie-list.component.html',
  styleUrls: ['./sous-categorie-list.component.scss'],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    FormsModule
  ]
})
export class SousCategorieListComponent implements OnInit {
  sousCategories: any[] = [];
  currentPage: number = 1;
  perPage: number = 10;
  totalItems: number = 0;
  search: string = '';

  constructor(private sousCategorieService: SousCategorieService, private dialog: MatDialog) { } // Inject MatDialog

  ngOnInit() {
    this.loadSousCategories();
  }

  loadSousCategories() {
    this.sousCategorieService.getSousCategories(this.perPage, this.currentPage).subscribe(
      (data: any) => {
        this.sousCategories = data.data; 
        this.totalItems = data.total; 
      },
      (error: any) => {
        console.error('Error fetching sous-catégories', error);
      }
    );
  }

  searchCategories() {
    this.currentPage = 1;
    this.loadSousCategories();
  }

  addSousCategorie() {
    const dialogRef = this.dialog.open(AddSousCategorieDialogComponent,{  width: '600px',height:'600px',
      
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadSousCategories(); // Refresh the list after adding a new sous-catégorie
      }
    });
  }

  editSousCategorie(id: number) {
    const sousCategorie = this.sousCategories.find(sc => sc.id === id);
    const dialogRef = this.dialog.open(EditSousCategorieDialogComponent, {  width: '600px',height:'600px',
      data: { sousCategorie, categorie_nom: sousCategorie.categorie_nom } // Ensure sousCategorie is defined
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadSousCategories(); // Refresh the list after editing a sous-catégorie
      }
    });
  }


    deleteSousCategorie(id: number) {
        const confirmDeletion = window.confirm('Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?');
        if (confirmDeletion) {
          this.sousCategorieService.deleteSousCategorie(id).subscribe(() => {
            // Gérer le succès, par exemple, rafraîchir la liste des sous-catégories
            console.log('Sous-catégorie supprimée avec succès');
          }, error => {
            console.error('Erreur lors de la suppression de la sous-catégorie', error);
          });
        }
      }
        
  openSubcategoryTab(id: number): void {
    // Implement your logic here, for example, opening a detailed view for the subcategory
    console.log('Opening subcategory with ID:', id);
    // You could navigate to a detail page or open a modal, for instance
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadSousCategories();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadSousCategories();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.perPage);
  }
}
