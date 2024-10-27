import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule,CommonModule, ReactiveFormsModule],
  // Include CommonModule in imports
  // template: 'passed in {{ data.name }}',

  templateUrl: './client-dialog.component.html',
  styleUrls: ['./client-dialog.component.scss']
})
export class ClientDialogComponent {

  clientData: any = {};
  isEditMode = false; // To check if it's edit mode or view mode

  constructor(
    public dialogRef: MatDialogRef<ClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.client) {
      this.clientData = data.client;
      this.isEditMode = data.isEditMode;
    }
  }

  saveClient(): void {
    this.dialogRef.close(this.clientData); // Return client data on save
  }

  close(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }
}
