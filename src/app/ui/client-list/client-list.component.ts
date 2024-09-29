import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../services/client.service';
import { ClientDialogComponent } from '../../client-dialog/client-dialog.component'; // Import Dialog Component
import { ClientEditDialogComponent } from '../../client-edit-dialog/client-edit-dialog.component';
@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];
  filteredClients: any[] = [];
  searchFilters: { nom?: string; user_name?: string; prenom?: string; numero_telephone?: string } = {};
  search: string = ''; // Define the search property
  currentPage = 1;
  totalPages = 1;
  perPage = 10;

  constructor(private clientService: ClientService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadClients();
  }

  // Load clients with pagination
  loadClients(page: number = this.currentPage): void {
    this.clientService.getClients(this.perPage, page).subscribe(data => {
      this.clients = data.data; // List of clients
      this.totalPages = data.total_pages; // Total number of pages
      this.currentPage = data.current_page; // Current page
      this.applySearchFilters(); // Apply filters after loading clients
    }, error => {
      console.error('Error loading clients', error);
    });
  }

  // Apply search filters to clients list
  applySearchFilters(): void {
    if (this.search) {
      this.filteredClients = this.clients.filter(client =>
        client.nom.toLowerCase().includes(this.search.toLowerCase()) ||
        client.user_name.toLowerCase().includes(this.search.toLowerCase()) ||
        client.prenom.toLowerCase().includes(this.search.toLowerCase()) ||
        client.numero_telephone.includes(this.search)
      );
    } else {
      this.filteredClients = [...this.clients];
    }
  }

  // Search clients
  searchClients(): void {
    this.applySearchFilters(); // Apply filters to clients list
  }

  // View client details
  viewClient(client: any): void {
    this.dialog.open(ClientDialogComponent, {
      data: { client, isEditMode: false } // Data to pass to the dialog
    });
  }

  // Edit client details
  editClient(client: any): void {
    const dialogRef = this.dialog.open(ClientEditDialogComponent, {
      data: { client, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.updateClient(client.id, result).subscribe(() => {
          this.loadClients(); // Reload clients after updating
        });
      }
    });
  }

  // Create a new client
  createClient(): void {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      data: { isEditMode: true } // Empty form for creating a new client
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.createClient(result).subscribe(() => {
          this.loadClients(); // Reload clients after creation
        });
      }
    });
  }

  // Delete a client
  deleteClient(id: number): void {
    this.clientService.deleteClient(id).subscribe(() => {
      this.loadClients(); // Reload clients after deletion
    });
  }

  // Update a client's status
  updateClientStatus(id: number, status: string): void {
    this.clientService.updateClientStatus(id, status).subscribe(() => {
      this.loadClients(); // Reload clients after status update
    });
  }

  // Navigate to a different route
  navigateToAddClient(): void {
    this.router.navigate(['/create-client']);
  }

  navigateToClientDetails(id: number): void {
    this.router.navigate([`/clientdetails/${id}`]);
  }

  navigateToUpdateClient(id: number): void {
    this.router.navigate([`/update-client/${id}`]);
  }

  // Pagination method
  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.loadClients(page);
    }
  }
}
