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
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {
  admins: any[] = [];
  filteredAdmins: any[] = [];
  searchFilters: { nom?: string; user_name?: string; prenom?: string; numero_telephone?: string } = {};
  search: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  perPage: number = 10;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadAdmins();
  }

  // Load all admins with pagination
  loadAdmins(page: number = this.currentPage): void {
    this.adminService.getAdmins(page, this.perPage).subscribe(
      data => {
        this.admins = data.data; // List of admins
        this.totalPages = data.total_pages; // Total number of pages
        this.currentPage = data.current_page; // Current page
        this.applySearchFilters(); // Apply filters after loading admins
      },
      error => {
        console.error('Error loading admins', error);
      }
    );
  }

  // Apply search filters to admins list
  applySearchFilters(): void {
    if (this.search) {
      this.filteredAdmins = this.admins.filter(admin =>
        admin.nom.toLowerCase().includes(this.search.toLowerCase()) ||
        admin.user_name.toLowerCase().includes(this.search.toLowerCase()) ||
        admin.prenom.toLowerCase().includes(this.search.toLowerCase()) ||
        admin.numero_telephone.includes(this.search)
      );
    } else {
      this.filteredAdmins = [...this.admins];
    }
  }

  // Search admins
  searchAdmins(): void {
    this.applySearchFilters(); // Apply filters to clients list

  }

  // Navigate to Add Admin page
  navigateToAddAdmin() {
    this.router.navigate(['/add-admin']);
  }

  // Navigate to Update Admin page
  navigateToUpdateAdmin(id: number) {
    this.router.navigate(['/update-admin', id]);
  }

  // Delete an admin
  deleteAdmin(id: number) {
    this.adminService.deleteAdmin(id).subscribe(() => {
      this.loadAdmins(); // Reload admins after deletion
    });
  }

  // Navigate to Admin Details page
  navigateToAdminDetails(id: number) {
    this.router.navigate([`/admindetails/${id}`]);
  }

  // Update admin status
  updateAdminStatus(admin: any) {
    this.adminService.updateAdminStatus(admin.id, admin.status).subscribe(
      response => {
        console.log('Admin status updated successfully:', response);
      },
      error => {
        console.error('Error updating admin status:', error);
      }
    );
  }

  // Change pagination page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAdmins(page); // Reload admins for the new page
    }
  }
}
