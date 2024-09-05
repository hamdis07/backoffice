// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="login()">
      <label>Email:</label>
      <input type="email" [(ngModel)]="credentials.email" name="email" required>
      <label>Password:</label>
      <input type="password" [(ngModel)]="credentials.password" name="password" required>
      <button type="submit">Login</button>
    </form>
  `,
  styles: []
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe(response => {
      console.log('Response:', response); // Affiche la réponse complète
    
      // Assure-toi que la propriété 'token' est bien définie dans la réponse
      if (response.token) {
        localStorage.setItem('token', response.token); // Sauvegarde du token
        this.router.navigate(['/dashboard']);
      } else {
        alert('Login failed');
      }
    }, error => {
      console.error('Login error:', error);
      alert('An error occurred during login');
    });
    
  }}
