import { Routes } from '@angular/router';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AdminDetailsComponent } from './ui/admin-list/AdminDetails.component';
import { AdminListComponent } from './ui/admin-list/admin-list.component';
import { AddAdminComponent } from './ui/admin-list/add-admin.component';
import { UpdateAdminComponent } from './ui/admin-list/updateadmin.component';
import { ClientListComponent } from './ui/client-list/client-list.component';
import { DashboardComponent } from './ui/dashboard/dashboard.component';
import { LoginComponent } from './identity/login/login/login.component';
import { RegisterComponent } from './identity/login/login/register.component';
import { LogoutComponent } from './identity/login/login/logout.component';
import { ProduitListComponent } from './ui/produit/produit-list.component';
import { MagasinListComponent } from './ui/depots/depots-list.component';
import { MessageListComponent } from './ui/messages/message-list.component';
import { CommandeComponent } from './ui/commandes/commande.component';
import { PromoListComponent } from './ui/promos/promo-list.component';
import { AuthGuard } from './services/auth.guard';
import { AjouterProduitComponent } from './ui/produit/ajouter-produit.component';
import { ModifierProduitComponent } from './ui/produit/modifier-produit.component';
import { ProduitDetailsComponent } from './ui/produit/produitDetails.comonent';
import { FiltreProduitsComponent } from './ui/produit/filtrerproduits.component';
import { CreateClientComponent } from './ui/client-list/create-client.component';
import { CreateCommandeComponent } from './ui/commandes/create-commande.component';
import { ClientDetailsComponent } from './ui/client-list/clientdetails.component';
import { ViewDetailCommandeComponent } from './ui/commandes/ViewDetailCommandeComponent';
import { CategorieListComponent } from './ui/categories/categorielist.component';
import { SousCategorieListComponent } from './ui/souscategories/sous-categorie-list.component';
import { PubliciteListComponent } from './ui/publicite/publicite-list.component';
import { NotificationsComponent } from './ui/notification/notifications.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { pageName: 'dashboard' }, canActivate: [AuthGuard] },
      { path: 'admins', component: AdminListComponent, canActivate: [AuthGuard] },
      { path: 'admin-list', component: AdminListComponent },
      { path: 'add-admin', component: AddAdminComponent, canActivate: [AuthGuard] },
      { path:'commande',component:CommandeComponent,canActivate:[AuthGuard]},
      { path: 'commande/:id', component: ViewDetailCommandeComponent, canActivate:[AuthGuard]},

      { path: 'message-list', component: MessageListComponent,canActivate:[AuthGuard] },
      { path: 'create-commande', component: CreateCommandeComponent,canActivate:[AuthGuard] },

{path:'publicite',component:PubliciteListComponent },

      { path: 'update-admin/:id', component: UpdateAdminComponent, canActivate: [AuthGuard] },
      { path: 'admindetails/:id', component: AdminDetailsComponent, canActivate: [AuthGuard] },

      
      { path: 'clients', component: ClientListComponent, canActivate: [AuthGuard] },
      { path: 'create-client', component: CreateClientComponent, canActivate: [AuthGuard] },
      { path: 'clientdetails/:id', component: ClientDetailsComponent, canActivate: [AuthGuard] },
      

      { path: 'produit', component: ProduitListComponent, canActivate: [AuthGuard] },
      { path: 'modifier-produit/:id', component: ModifierProduitComponent,canActivate:[AuthGuard] },
      { path: 'produitDetails/:id', component: ProduitDetailsComponent,canActivate:[AuthGuard] },

      { path: 'produits/recherche', component: FiltreProduitsComponent },
      {path:'categories',component:CategorieListComponent},
      {path:'souscategories',component:SousCategorieListComponent},
      { path: 'notifications',component:NotificationsComponent},
      { path: 'ajouter-produit', component: AjouterProduitComponent, canActivate: [AuthGuard] },
      { path: 'depots', component: MagasinListComponent, canActivate: [AuthGuard] },
      { path: 'messages', component: MessageListComponent, canActivate: [AuthGuard] },
      { path: 'promos', component: PromoListComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'logout', component: LogoutComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
      
    ]
  }
];
