import { Categories } from './categories';
import { Genre } from './genre';
import { SousCategories } from './Souscategories';
import { Taille } from './taille';
import { Couleur } from './couleur';
import { Promo } from './Promo';

export interface Product {
  id: number;
  reference: string;
  nomProduit: string;
  categories_id: number;
  genre_id: number;
  sous_categories_id: number;
  tailles_id: number;
  couleurs_id: number;
  promos_id: number;
  quantite: number;
  categories: Categories[];
  genres: Genre[];
  sousCategories: SousCategories[];
  tailles: Taille[];
  couleurs: Couleur[];
  promos: Promo[];
}
