import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div>
      <h2>Clients</h2>
      <input type="text" placeholder="Search by username" #userNameInput>
      <button (click)="searchByUsername(userNameInput.value)">Search</button>

      <div *ngIf="searchResults.length > 0">
        <h3>Search Results</h3>
        <ul>
          <li *ngFor="let user of searchResults">
            {{ user.name }} ({{ user.email }})
          </li>
        </ul>
      </div>

      <h3>All Clients</h3>
      <ul>
        <li *ngFor="let client of clients">
          {{ client.name }} ({{ client.email }})
          <button (click)="deleteUser(client.id)">Delete</button>
        </li>
      </ul>
    </div>
  `,
  styles: []
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];
  searchResults: any[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.userService.getClients().subscribe(data => {
      this.clients = data;
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.loadClients(); // Reload clients after deletion
    });
  }

  searchByUsername(userName: string): void {
    if (userName) {
      this.userService.searchByUsername(userName).subscribe(data => {
        this.searchResults = data;
      });
    } else {
      this.searchResults = [];
    }
  }
}
