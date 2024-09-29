import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Ensure Router is imported

@Component({
    standalone: true,
    selector: 'app-admin-details',
    imports: [CommonModule, FormsModule],
    templateUrl: './admindetails.component.html',
    styleUrls: ['./AdminDetails.component.scss']
})
export class AdminDetailsComponent implements OnInit {
    adminId: string | null = null;
    adminData: any = {}; // Initialize as an empty object to bind with the form

    constructor(
        private adminService: AdminService,
        private route: ActivatedRoute,
        private router: Router // Use the correct type 'Router' here
    ) {}

    ngOnInit(): void {
        this.adminId = this.route.snapshot.paramMap.get('id');
        if (this.adminId) {
            this.loadAdminDetails(this.adminId);
        }
    }

    loadAdminDetails(id: string): void {
        this.adminService.getAdminById(id).subscribe(
            (response) => {
                this.adminData = response.user; // Adjusted to access 'user' from response
            },
            (error) => {
                console.error('Error fetching admin details', error);
            }
        );
    }
    navigateToUpdateAdmin(id: number): void {
        console.log('Navigating to update-admin with ID:', id);
        this.router.navigate(['/update-admin', id]);
      }
    
      deleteAdmin(id: number): void {
        if (confirm('Are you sure you want to delete this admin?')) {
          this.adminService.deleteAdmin(id).subscribe(
            () => {
              alert('Admin deleted successfully.');
              this.router.navigate(['/admin-list']); // Navigate back to the admin list
            },
            (error) => {
              console.error('Error deleting admin:', error);
            }
          );
        }
      }
    
      

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.adminData.user_image = file;
        }
    }
  
    // Add other methods as needed
}
