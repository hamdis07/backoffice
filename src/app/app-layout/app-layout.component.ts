import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu'; // Import MatMenuModule
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatExpansionModule,
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule // Add MatMenuModule here
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent { 
  isSidenavOpened = true; // Initialize sidenav state
  isProduitMenuOpen = false; // Initialize product menu state
  isLoggedIn: boolean = false; // Initialise à false
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.checkLoginStatus();
  }
  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  // Method to toggle product submenu
  toggleProduitMenu() {
    this.isProduitMenuOpen = !this.isProduitMenuOpen;
  }
  checkLoginStatus() {
    this.isLoggedIn = this.authService.isAuthenticated(); // Supposons que vous ayez une méthode pour vérifier l'authentification
  }
}
