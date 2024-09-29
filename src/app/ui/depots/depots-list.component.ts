import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MagasinService } from '../../services/magasin.service';
import { AddMagasinDialog } from '../../add-magasin-dialog/add-magasin-dialog.component';
import { EditMagasinDialog } from '../../edit-magasin-dialog/edit-magasin-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewMagasinDialog } from '../../view-magasin-dialog/view-magasin-dialog.component';
interface Magasin {
  id: number;
  nom: string;
  adresse:string,
  // Add other fields if necessary
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  selector: 'app-depots-list',
  templateUrl: './depots-list.component.html',
  styleUrls: ['./depots-list.component.scss']
})
export class MagasinListComponent implements OnInit {
  magasins: Magasin[] = [];
  searchResults: Magasin[] = [];
  search: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  errorMessage: string | null = null; // Add this line


  constructor(
    private magasinService: MagasinService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMagasins();
  }

  loadMagasins(page: number = 1): void {
    this.magasinService.getMagasins(page, 10).subscribe(data => {
      console.log('API Response:', data); // Log the response
      this.magasins = data.data;
      this.totalPages = data.last_page;
      this.currentPage = data.current_page;
    }, error => {
      console.error('API Error:', error); // Log any errors
    });
  }
  

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.loadMagasins(page);
    }
  }

  deleteMagasin(id: number): void {
    this.magasinService.deleteMagasin(id).subscribe(() => {
      this.loadMagasins(); // Reload the list after deletion
    });
  }

  searchByName(name: string): void {
    if (name) {
      this.magasinService.getMagasins().subscribe(data => {
        this.searchResults = data.filter((magasin: Magasin) => magasin.nom.includes(name));
      });
    } else {
      this.searchResults = [];
    }
  }

  navigateToAddMagasin(): void {
    const dialogRef = this.dialog.open(AddMagasinDialog,{ width: '800vw',   // Adjusting the width to 80% of the viewport
      maxWidth: '600px', // Maximum width to prevent it from getting too wide
      height: '600px',});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMagasins(); // Reload the list after adding a new magasin
      }
    });
  }

  viewMagasin(magasin: Magasin): void {
    const dialogRef = this.dialog.open(ViewMagasinDialog, {
      data: magasin, width: '800vw',   // Adjusting the width to 80% of the viewport
      maxWidth: '600px', // Maximum width to prevent it from getting too wide
      height: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle after the dialog is closed if needed
    });
  }

  editMagasin(id: number): void {
    const dialogRef = this.dialog.open(EditMagasinDialog, {
      data: { id },
      width: '800vw',   // Adjusting the width to 80% of the viewport
      maxWidth: '600px', // Maximum width to prevent it from getting too wide
      height: '600px', // Let the height be dynamic based on content
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMagasins(); // Reload the list after editing
      }
    });
  }
}
