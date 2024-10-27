import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-edit-dialog',
  templateUrl: './client-edit-dialog.component.html',
  styleUrls: ['./client-edit-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class ClientEditDialogComponent implements OnInit {
  clientForm: FormGroup;
  selectedFile: File | null = null;
  updateAdminForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    public dialogRef: MatDialogRef<ClientEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client?: any; isEditMode: boolean }
  ) {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      genre: [''],
      date_de_naissance: [''],
      adresse: [''],
      occupation: [''],
      etat_social: [''],
      numero_telephone: [''],
      user_name: [''],
      email: [''],
      password: [''], // Ajouter validation pour le mot de passe
      status: ['actif'],
      role: ['client'],
      user_image: [null] // Update this line
    });
  }

  ngOnInit(): void {
    if (this.data.client) {
      this.clientForm.patchValue(this.data.client);
    }
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.clientForm.patchValue({ user_image: file });
    } else {
      this.clientForm.patchValue({ user_image: null }); // Clear the field if no file is selected
    }
  }


  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  
      if (allowedTypes.includes(file.type)) {
        this.selectedFile = file;
        this.clientForm.patchValue({
          user_image: this.selectedFile
        });
      } else {
        alert('Please select a valid image file (jpeg, png, jpg, gif).');
        this.selectedFile = null;
      }
    } else {
      // No file selected
      this.selectedFile = null;
      this.clientForm.patchValue({
        user_image: null // Ensure to clear the form control if no file is selected
      });
    }
  }
  

  save(): void {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      const formData = new FormData();
      
      Object.keys(clientData).forEach(key => {
        formData.append(key, clientData[key]);
      });
  
      // Only append the file if it exists
      if (this.selectedFile) {
        formData.append('user_image', this.selectedFile);
      }
  
      if (this.data.isEditMode && this.data.client) {
        this.clientService.updateClient(this.data.client.id, formData).subscribe(() => {
          this.dialogRef.close(clientData);
        });
      } else {
        this.clientService.createClient(formData).subscribe(() => {
          this.dialogRef.close(clientData);
        });
      }
    }
  }
  

  cancel(): void {
    this.dialogRef.close();
  }
}
