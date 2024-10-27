import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-client-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './clientdetails.component.html',
  styleUrls: ['./clientdetails.component.scss']
})
export class ClientDetailsComponent implements OnInit {
  clientId: string | null = null;
  clientData: any = {};

  constructor(
    public dialog: MatDialog,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    console.log('Client ID:', this.clientId);
    if (this.clientId) {
      this.loadClientDetails(this.clientId);
    }
  }
  
 
loadClientDetails(id: string): void {
    this.clientService.showClient(id).subscribe(
      (response) => {
        console.log('Client data:', response);
        this.clientData = response.client;
        this.cdr.detectChanges(); // Manually trigger change detection if needed
      },
      (error) => {
        console.error('Error fetching client details', error);
      }
    );
  }
  
  
  navigateToUpdateClient(id: number): void {
    console.log('Navigating to update-client with ID:', id);
    this.router.navigate(['/update-client', id]);
  }

  deleteClient(id: number): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id).subscribe(
        () => {
          alert('Client deleted successfully.');
          this.router.navigate(['/client-list']);
        },
        (error) => {
          console.error('Error deleting client:', error);
        }
      );
    }
  }

  navigateToUpdateclient(id: number): void {
    console.log('Navigating to update-client with ID:', id);
    this.router.navigate(['/update-client', id]);
  }

  deleteclient(id: number): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id).subscribe(
        () => {
          alert('client deleted successfully.');
          this.router.navigate(['/client-list']); // Navigate back to the client list
        },
        (error) => {
          console.error('Error deleting client:', error);
        }
      );
    }
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.clientData.user_image = file;
    }
  }
}
