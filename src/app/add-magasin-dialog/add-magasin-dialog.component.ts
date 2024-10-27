import { Component } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MagasinService } from '../services/magasin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'app-add-magasin-dialog',
  templateUrl: './add-magasin-dialog.component.html',
  styleUrls: ['./add-magasin-dialog.component.scss']
})
export class AddMagasinDialog {
  newMagasin = {
    nom: '',
    adresse: '',
    ville: '',
    code_postal: '',
    responsable: '',
    telephone: ''
  }; // Define your magasin fields here

  constructor(
    private magasinService: MagasinService,
    public dialogRef: MatDialogRef<AddMagasinDialog>,  
  ) {}

  save(): void {
    this.magasinService.addMagasin(this.newMagasin).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
  
  
}
