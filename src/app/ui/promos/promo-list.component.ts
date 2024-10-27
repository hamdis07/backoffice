import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromosService } from '../../services/Promos.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog

import { PromoCreateDialogComponent } from '../../promo-create-dialog/promo-create-dialog.component';
import { PromoUpdateDialogComponent } from '../../promo-update-dialog/promo-update-dialog.component';
import { PromoApplyDialogComponent } from '../../promo-apply-dialog/promo-apply-dialog.component';
@Component({
  selector: 'app-promo-list',
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule] // Include FormsModule for ngModel
})
export class PromoListComponent implements OnInit {
  promos: any[] = [];
  search: string = '';
  currentPage: number = 1;
  totalPages: number = 1; // Set default value

  constructor(
    private promosService: PromosService,
    private router: Router,
    private dialog: MatDialog // Inject MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPromos();
  }

  // Load all promotions
  loadPromos(page: number = 1): void {
    this.promosService.getPromos(page).subscribe(
      (response: any) => {
        console.log(response); // Check the structure of the response
        this.promos = response.data || []; // Use response.data to get the promos array
        this.totalPages = response.last_page || 1; // Use response.last_page for pagination
        this.currentPage = response.current_page || 1; // Use response.current_page to set current page
      },
      (error) => {
        console.error('Error loading promotions:', error);
      }
    );
  }
  
  // Search promotions (assumes there is an API endpoint for searching)
  searchPromos(): void {
    // Add logic here to call a service method to search promos by name or other criteria
  }

  // Create a new promotion
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PromoCreateDialogComponent, {
      width: '600px',height:'600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle result (e.g., reload promotions)
        this.loadPromos();
      }
    });
  }

  // Update an existing promotion
  openUpdateDialog(promo: any): void {
    const dialogRef = this.dialog.open(PromoUpdateDialogComponent, {
      width: '600px',height:'600px',
      data: { promo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle result (e.g., reload promotions)
        this.loadPromos();
      }
    });
  }

  // Delete a promotion
  deletePromo(id: number): void {
    if (confirm('Are you sure you want to delete this promotion?')) {
      this.promosService.deletePromo(id).subscribe(
        () => {
          this.loadPromos(); // Reload promotions
        },
        (error) => {
          console.error('Error deleting promotion:', error);
        }
      );
    }
  }

  // Apply promotion to products
  openApplyDialog(promo: any): void {
    const dialogRef = this.dialog.open(PromoApplyDialogComponent, {
      width: '600px',height:'600px',
      data: { promo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle result (e.g., reload promotions)
        this.loadPromos();
      }
    });
  }

  // Apply existing promotion to products
  applyExistingPromoToProducts(promoId: number, promoData: any): void {
    this.promosService.applyExistingPromoToProducts(promoId, promoData).subscribe(
      () => {
        this.loadPromos(); // Reload promotions
      },
      (error) => {
        console.error('Error applying existing promotion to products:', error);
      }
    );
}

  // Navigate to create promo page
  navigateToCreatePromo(): void {
    this.router.navigate(['/create-promo']); // Adjust the path as necessary
  }

  // Change page
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.loadPromos(); // Reload promos for the new page
  }
}
