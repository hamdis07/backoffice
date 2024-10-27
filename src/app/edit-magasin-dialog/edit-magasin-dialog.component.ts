import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MagasinService } from '../services/magasin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'app-edit-magasin-dialog',
  templateUrl: './edit-magasin-dialog.component.html',
  styleUrls: ['./edit-magasin-dialog.component.scss']
})
export class EditMagasinDialog {
  magasin = {
    nom: '',
    adresse: '',
    ville: '',
    code_postal: '',
    responsable: '',
    telephone: ''
  }; // Define yo

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private magasinService: MagasinService,
    public dialogRef: MatDialogRef<EditMagasinDialog>,  // Changed to public
  ) {
    this.loadMagasin();
  }

  loadMagasin(): void {
    this.magasinService.getMagasins(this.data.id).subscribe(data => {
      this.magasin = data;
    });
  }

  save(): void {
    this.magasinService.updateMagasin(this.data.id, this.magasin).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
