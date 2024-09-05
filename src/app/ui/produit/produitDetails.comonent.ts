import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../../services/Produit.service'; // Assurez-vous que le chemin du service est correct
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-produit-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './produitdetails.component.html'
})
export class ProduitDetailsComponent implements OnInit {
  produit$!: Observable<any>;

  constructor(
    private produitService: ProduitService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.produit$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = +params.get('id')!;
        return this.produitService.getProduitById(id);
      })
    );
  }
}
