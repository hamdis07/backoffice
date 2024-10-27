import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe(
      response => {
        console.log('Response:', response); // Affiche la réponse complète
        if (response.token) {
          localStorage.setItem('token', response.token); // Sauvegarde du token
          this.router.navigate(['/dashboard']);
        } else {
          alert('Login failed');
        }
      },
      error => {
        console.error('Login error:', error);
        alert('An error occurred during login');
      }
    );
  }
}
