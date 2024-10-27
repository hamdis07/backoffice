import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { PubliciteService } from '../services/publicites.service';

@Component({
  selector: 'app-edit-publicite-dialog',
  templateUrl: './edit-publicite-dialog.component.html',
  styleUrls: ['./edit-publicite-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class EditPubliciteDialogComponent {
  publiciteData: any = {};
  selectedFiles: { [key: string]: File } = {}; // Pour stocker les fichiers sélectionnés (image, video, affiche)

  constructor(
    public dialogRef: MatDialogRef<EditPubliciteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private publiciteService: PubliciteService
) {
    console.log('Données de la publicité:', data.publicite); // Vérifiez que les données sont correctes
    this.publiciteData = { ...data.publicite };
}

onSave(): void {
  const formData = new FormData();
  
  for (const key in this.publiciteData) {
      if (this.publiciteData.hasOwnProperty(key) && !this.selectedFiles[key]) {
          formData.append(key, this.publiciteData[key]);
      }
  }

  for (const key in this.selectedFiles) {
      if (this.selectedFiles.hasOwnProperty(key)) {
          formData.append(key, this.selectedFiles[key]);
      }
  }

  console.log('Données de publiciteData:', this.publiciteData); // Ajoutez ce log
  console.log('ID de la publicité:', this.publiciteData.id); // Ajoutez ce log ici
  this.publiciteService.updatePublicite(this.publiciteData.id, formData).subscribe(
      (response) => {
          console.log('Mise à jour réussie', response);
          this.dialogRef.close(response);
      },
      (error) => {
          console.error('Erreur lors de la mise à jour', error);
      }
  );
}

  onCancel(): void {
    this.dialogRef.close(null);
  }

  // Méthode pour gérer les fichiers sélectionnés
  onFileChange(event: any, fileType: string): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles[fileType] = event.target.files[0];
    }
  }
}
