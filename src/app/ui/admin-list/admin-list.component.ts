import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-list.component.html',
  styles: []
})
export class AdminListComponent implements OnInit {
  admins: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  perPage: number = 10;
  totalItems: number = 0;
  search: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadAdmins();
  }

  loadAdmins() {
    this.adminService.getAdmins(this.currentPage, this.perPage).subscribe(
      response => {
        console.log('Received data:', response); // Inspect the structure
        if (response && response.data) {
          this.admins = response.data;
          this.currentPage = response.current_page;
          this.totalPages = response.total_pages;
          this.totalItems = response.total_items;
        } else {
          console.error('Expected a data field but got:', response);
        }
      },
      error => {
        console.error('Error loading admins:', error);
      }
    );
  }

  navigateToAddAdmin() {
    this.router.navigate(['/add-admin']);
  }

  navigateToUpdateAdmin(id: number) {
    console.log('Navigating to update-admin with ID:', id);
    this.router.navigate(['/update-admin', id]);
  }
  
  deleteAdmin(id: number) {
    this.adminService.deleteAdmin(id).subscribe(() => {
      this.loadAdmins();
    });
  }
  navigateToAdminDetails(id: number){
    console.log('navigate to AdminDetails with ID:',id);
    this.router.navigate(['/AdminDetails',id]);
  }

  searchAdmins(): void {
    this.currentPage = 1; // Reset to first page on new search
    this.loadAdmins();}

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAdmins();
    }
  }
}
