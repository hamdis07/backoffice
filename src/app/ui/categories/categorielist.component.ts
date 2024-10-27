import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryDialogComponent } from '../../add-category-dialog.component/add-category-dialog.component';
import { EditCategoryDialogComponent } from '../../add-category-dialog.component/edit-category-dialog.component';

import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categorielist',
  standalone: true,
  templateUrl: './categorielist.component.html',
  styleUrls: ['./categorielist.component.scss'],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    FormsModule
  ]
})
export class CategorieListComponent implements OnInit {
  categories: any[] = [];
  search: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;

  selectedCategoryId: number | null = null; // Property to track the selected category

  constructor(private categoriesService: CategoriesService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadCategories(); // Call the function to load categories when the component initializes
  }

  // Function to load categories with optional search and pagination support
  loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (response) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.categories = response.data;  // Access the 'data' field of the response object
          this.totalPages = response.totalPages || 1;  // Set pagination info
          this.currentPage = response.currentPage || 1;
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  // Add a new category
  addCategorie() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent);
    dialogRef.afterClosed().subscribe((result: any) => { // Explicitly typing result as any
      if (result) {
        this.loadCategories(); // Refresh the list after adding a new category
      }
    });
  }

  // Edit a category by its ID
  editCategorie(id: number) {
    const category = this.categories.find(c => c.id === id);
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: { category }
    });
    dialogRef.afterClosed().subscribe((result: any) => { // Explicitly typing result as any
      if (result) {
        this.loadCategories(); // Refresh the list after editing a category
      }
    });
  }

  // Delete a category by its ID
  deleteCategorie(id: number) {
    const confirmDeletion = window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?');
    if (confirmDeletion) {
        this.categoriesService.deleteCategorie(id).subscribe({
            next: () => {
                this.categories = this.categories.filter(categorie => categorie.id !== id);
                console.log('Category deleted');
            },
            error: (err) => console.error('Error deleting category', err)
        });
    }
}


  // Search for categories
  searchCategories() {
    this.currentPage = 1; // Reset to the first page during search
    this.loadCategories(); // Reload categories (you may need to update the service to accept search queries)
  }

  // Change the current page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCategories();
    }
  }

  // Open the subcategory tab for a specific category
  openSubcategoryTab(categoryId: number) {
    // Toggle the selected category to open or close its subcategories
    if (this.selectedCategoryId === categoryId) {
      this.selectedCategoryId = null; // Close the section if it's already open
    } else {
      this.selectedCategoryId = categoryId; // Open the section for this category
    }
  }

  // Get the subcategories for the selected category
  getSubcategories(categoryId: number) {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.souscategories : [];
  }
}
