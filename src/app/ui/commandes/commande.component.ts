import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeService } from '../../services/commande.service';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule if required
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, matDialogAnimations } from '@angular/material/dialog';
import { CommandeDetailsDialogComponent } from '../../commande-details-dialog/commande-details-dialog.component';
@Component({
  selector: 'app-commande',
  standalone: true, // Enable standalone mode
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss'],
  imports: [CommonModule,FormsModule, HttpClientModule] // Import required modules
})
export class CommandeComponent implements OnInit {
    commandes: any[] = [];  query: string = ''; // Ajout de la propriété query

    commandeDetails: any;
  
    // Pagination variables
    currentPage: number = 1; // Starting page
    itemsPerPage: number = 10; // Items per page
    totalItems: number = 0; // Total items, set dynamically
    totalPages: number = 0; // Total pages, calculated dynamically
  
    search: string = '';
  
    constructor(private commandeService: CommandeService,private dialog: MatDialog, private router: Router) {}
  
    ngOnInit(): void {
      this.loadCommandes();
    }
  
    loadCommandes(): void {
        this.commandeService.getCommandesPaginated(this.currentPage, this.itemsPerPage).subscribe(
          (data: { commandes: any[], totalItems: number }) => {
            this.commandes = data.commandes;
            this.totalItems = data.totalItems;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Calculate total pages
          },
          (error: any) => {
            console.error('Erreur lors du chargement des commandes', error);
          }
        );
      }
      
      rechercherCommande(): void {
        this.commandeService.rechercherCommande(this.query).subscribe(
          (data) => {
            this.commandes = data;
          },
          (error) => {
            console.error('Erreur lors de la recherche', error);
          }
        );
      }
  
    changePage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.loadCommandes(); // Reload data for the new page
      }
    }
  
    
    viewCommandeDetails(commandeId: number): void {
        this.commandeService.getCommandeDetails(commandeId).subscribe(
          data => {
            this.commandeDetails = data;
            // Une fois que les détails de la commande ont été chargés, on peut naviguer vers la nouvelle page
            this.router.navigate([`/commande/${commandeId}`]);
          },
          error => {
            console.error('Erreur lors du chargement des détails de la commande', error);
          }
        );
      }
  
    changeStatut(commandeId: number, statut: string): void {
      this.commandeService.changerStatutCommande(commandeId, statut).subscribe(
        () => {
          console.log('Statut mis à jour avec succès');
          this.loadCommandes(); // Reload the commandes after status change
        },
        error => {
          console.error('Erreur lors de la mise à jour du statut', error);
        }
      );
    }
  
    exportCommandePDF(commandeId: number): void {
      this.commandeService.exporterCommandePDF(commandeId).subscribe(
        (pdfBlob) => {
          const blobUrl = URL.createObjectURL(pdfBlob);
          window.open(blobUrl);
        },
        error => {
          console.error('Erreur lors de l\'exportation en PDF', error);
        }
      );
    }
  
    exportToutesCommandes(): void {
      this.commandeService.exporterToutesCommandes().subscribe(
        (excelBlob) => {
          const blobUrl = URL.createObjectURL(excelBlob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'commandes.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        error => {
          console.error('Erreur lors de l\'exportation des commandes', error);
        }
      );
    }
    deleteCommande(commandeId: number): void {
        this.commandeService.deleteCommande(commandeId).subscribe(
          () => {
            console.log('Commande supprimée avec succès');
            this.loadCommandes(); // Refresh the list of commands after deletion
          },
          (error) => {
            console.error('Erreur lors de la suppression de la commande', error);
          }
        );
      }
      
      navigateTosubmitCommande(): void {
       
            this.router.navigate(['/create-commande']); // Navigation vers le composant CreateCommandeComponent
     
      }
      openCommandeDetails(commandeId: number): void {
        if (commandeId) { // Check if commandeId is defined
          this.commandeService.getCommandeDetails(commandeId).subscribe(data => {
            if (data) {
              this.dialog.open(CommandeDetailsDialogComponent, {
                data: data.commande,
                width: '80%',
              });
            }
          }, error => {
            console.error('Erreur lors du chargement des détails de la commande', error);
          });
        } else {
          console.error('Commande ID est undefined');
        }
      }
    }      