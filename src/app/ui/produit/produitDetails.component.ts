import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../../services/Produit.service';  // Updated service
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-produit-Details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './produitDetails.component.html',
  styleUrls: ['produitDetails.component.scss'],
})
export class ProduitDetailsComponent implements OnInit {
  produit: any;
  categories: string[] = [];
  souscategories: string[] = [];
  genre: string = '';
  quantites: any[] = [];
  images: any[] = [];
  currentIndex: number = 0;
  imageRotation: number = 0;
  imagesDisponibles: string[] = [];
  error: string | null = null;
  allImages: string[] = [];
  promos: any = null; // Field to store promotion data

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService // Changed to ProduitService
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;

    // Using ProduitService instead of DataService to fetch product by id
    this.produitService.getProduitById(id).subscribe(data => {
      this.produit = data.produit;
      this.categories = data.categories || [];
      this.categories = typeof this.categories === 'string' ? [this.categories] : this.categories;
      this.souscategories = data.souscategories || [];
      this.souscategories = typeof this.souscategories === 'string' ? [this.souscategories] : this.souscategories;
      this.genre = data.genre;
      this.quantites = data.quantites || [];

      // Get promotion details if they exist
      this.promos = data.produit.promos || null; // Assuming promotion details are nested under produit.promos

      this.images = data.images.map((image: any) => {
        return {
          url: `http://localhost/storage/images/${image.nom_fichier}`,
          alt: image.alt || 'Image du produit'
        };
      });

      this.imagesDisponibles = data.produit.images.map((image: any) => image.chemin_image);

      this.allImages = [
        this.produit.image_url,
        ...this.imagesDisponibles
      ].filter(image => !!image && image.length > 0);

      console.log('allImages:', this.allImages);

    }, error => {
      console.error('Error fetching product details:', error);
    });
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  nextImage(): void {
    if (this.allImages.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.allImages.length;
    }
  }

  prevImage(): void {
    if (this.allImages.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.allImages.length) % this.allImages.length;
    }
  }

  rotateImage(): void {
    this.imageRotation = (this.imageRotation + 90) % 360;
  }

  isImage(url: string): boolean {
    return url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif');
  }

  addToCart(produit: any): void {
    this.router.navigate(['/paniersproduits/', produit.id]);
  }
}
