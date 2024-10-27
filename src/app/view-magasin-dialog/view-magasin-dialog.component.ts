// view-magasin-dialog.component.ts
import { Component, Inject } from '@angular/core';


import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MagasinService } from '../services/magasin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule],
  selector: 'app-view-magasin-dialog',
  templateUrl: './view-magasin-dialog.component.html',
  styleUrls: ['./view-magasin-dialog.component.scss']
})
export class ViewMagasinDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewMagasinDialog>
  ) {}
}
