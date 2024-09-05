import { Component, OnInit } from '@angular/core';
import { MagasinService } from '../../services/magasin.service';

@Component({
  selector: 'app-magasin-list',
  template: `
    <div>
      <h2>Magasins</h2>
      <input type="text" placeholder="Rechercher par nom" #nomInput>
      <button (click)="searchByName(nomInput.value)">Rechercher</button>

      <div *ngIf="searchResults.length > 0">
        <h3>Résultats de la recherche</h3>
        <ul>
          <li *ngFor="let magasin of searchResults">
            {{ magasin.nom }} ({{ magasin.id }})
          </li>
        </ul>
      </div>

      <h3>Tous les Magasins</h3>
      <ul>
        <li *ngFor="let magasin of magasins">
          {{ magasin.nom }} ({{ magasin.id }})
          <button (click)="deleteMagasin(magasin.id)">Supprimer</button>
        </li>
      </ul>
    </div>
  `,
  styles: []
})
export class MagasinListComponent implements OnInit {
  magasins: any[] = [];
  searchResults: any[] = [];

  constructor(private magasinService: MagasinService) {}

  ngOnInit(): void {
    this.loadMagasins();
  }

  loadMagasins(): void {
    this.magasinService.getAllMagasins().subscribe(data => {
      this.magasins = data;
    });
  }

  deleteMagasin(id: number): void {
    this.magasinService.deleteMagasin(id).subscribe(() => {
      this.loadMagasins(); // Recharger la liste des magasins après la suppression
    });
  }

  searchByName(name: string): void {
    if (name) {
      this.magasinService.getAllMagasins().subscribe(data => {
        this.searchResults = data.filter(magasin => magasin.nom.includes(name));
      });
    } else {
      this.searchResults = [];
    }
  }
}
