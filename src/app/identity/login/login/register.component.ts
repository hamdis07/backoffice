import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

 
})
export class RegisterComponent {
  user = {
    nom: '',
    prenom: '',
    genre: '',
    date_de_naissance: '',
    Addresse: '',
    occupation: '',
    etat_social: '',
    numero_telephone: '',
    user_name: '',
    email: '',
    password: ''
  };

  selectedFile: File | null = null;
  errors: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
  }

  registre() {
    const formData = new FormData();
    for (const key in this.user) {
      if (Object.prototype.hasOwnProperty.call(this.user, key)) {
        formData.append(key, (this.user as any)[key]);
      }
    }
    if (this.selectedFile) {
      formData.append('user_image', this.selectedFile);
    }
  
    // Log FormData entries
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
    this.authService.registre(formData).subscribe(
      response => {
        if (response.message === 'User Created') {
          this.router.navigate(['/login']);
        } else {
          this.errors = response.errors; // Assuming the response contains an 'errors' array
          console.error('Errors:', this.errors);
        }
      },
      error => {
        console.error('Error:', error);
        if (error.status === 422) {
          // Extracting detailed error messages
          this.errors = error.error.errors 
            ? Object.values(error.error.errors).flat() as string[]
            : ['Unknown error'];
          console.log('Detailed validation errors:', this.errors);
        } else {
          this.errors = ['Registration failed. Please try again.'];
        }
      }
    );
  }
  
}
