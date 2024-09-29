
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';

interface Admin {
  nom: string;
  prenom: string;
  genre: string;
  date_de_naissance: string;
  addresse: string; // Assurez-vous que ce nom correspond à celui du backend
  occupation: string;
  etat_social: string;
  numero_telephone: string;
  user_name: string;
  email: string;
  password: string;
  role: string;
  user_image: string;
}

@Component({
  standalone: true,
  imports: [FormsModule,CommonModule, ReactiveFormsModule],
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']

})
export class AddAdminComponent {
  //updateAdminForm!: FormGroup;

  
  admin: Admin = {
    nom: '',
    prenom: '',
    genre: '',
    date_de_naissance: '',
    addresse: '', // Assurez-vous que ce nom correspond à celui du backend
    occupation: '',
    etat_social: '',
    numero_telephone: '',
    user_name: '',
    email: '',
    password: '',
    role: '',
    user_image: ''
  };
  selectedFile: File | null = null;
  errorMessage: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  addAdmin() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    const formData = new FormData();
    for (const key in this.admin) {
      if (this.admin.hasOwnProperty(key)) {
        formData.append(key, this.admin[key as keyof Admin]);
      }
    }
    if (this.selectedFile) {
      formData.append('user_image', this.selectedFile);
    }

    this.adminService.createAdministrateur(formData).subscribe(
      () => {
        this.router.navigate(['/admins']);
      },
      error => {
        console.error('Error:', error);
        if (error.error && error.error.errors) {
          const errorFields = Object.entries(error.error.errors).map(([field, messages]) => {
            const messageArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${messageArray.join(', ')}`;
          });
          const errorMessage = `Please fix the following errors:\n${errorFields.join('\n')}`;
          alert(errorMessage);
        } else {
          alert('An unexpected error occurred.');
        }
      }
    );
  }

  isFormValid(): boolean {
    const requiredFields = ['nom', 'prenom', 'genre', 'date_de_naissance', 'addresse', 'occupation', 'etat_social', 'numero_telephone', 'user_name', 'email', 'password', 'role'];
    for (const field of requiredFields) {
      if (!this.admin[field as keyof Admin] || this.admin[field as keyof Admin].trim() === '') {
        console.log(`Field ${field} is invalid`);
        return false;
      }
    }
    return true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log("Selected file: ", this.selectedFile);
    } else {
      console.log("No file selected.");
    }
  }
  
}
