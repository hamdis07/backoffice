import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service'; // Assurez-vous que le service est correctement configuré
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';

interface Client {
  nom: string;
  prenom: string;
  genre: string;
  date_de_naissance: string;
  addresse: string;
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
  imports: [FormsModule, CommonModule],
  selector: 'app-add-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent {
  client: Client = {
    nom: '',
    prenom: '',
    genre: '',
    date_de_naissance: '',
    addresse: '',
    occupation: '',
    etat_social: '',
    numero_telephone: '',
    user_name: '',
    email: '',
    password: '',
    role: '', // Ajustez ce champ selon les besoins
    user_image: ''
  };
  selectedFile: File | null = null;
  errorMessage: string = '';

  constructor(private clientService: ClientService, private router: Router) {}

  CreateClient() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    const formData = new FormData();
    for (const key in this.client) {
      if (this.client.hasOwnProperty(key)) {
        formData.append(key, this.client[key as keyof Client]);
      }
    }
    if (this.selectedFile) {
      formData.append('user_image', this.selectedFile);
    }

    this.clientService.createClient(formData).subscribe(
      () => {
        this.router.navigate(['/clients']); // Redirigez vers la page des clients
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
      if (!this.client[field as keyof Client] || this.client[field as keyof Client].trim() === '') {
        console.log(`Field ${field} is invalid`);
        return false;
      }
    }
    return true;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
