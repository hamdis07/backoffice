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
import { MessageListComponent } from './ui/messages/message.component';
import { PromoManagerComponent } from './ui/promos.component.ts/promos.component';
import { AuthGuard } from './services/auth.guard';
import { AjouterProduitComponent } from './ui/produit/ajouter-produit.component';
//import { ModifierProduitComponent } from './ui/produit/modifier-produit.component';
import { ProduitDetailsComponent } from './ui/produit/produitDetails.comonent';
import { FiltreProduitsComponent } from './ui/produit/filtrerproduits.component';
export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { pageName: 'dashboard' }, canActivate: [AuthGuard] },
      { path: 'admins', component: AdminListComponent, canActivate: [AuthGuard] },
      { path: 'admin-list', component: AdminListComponent },
      { path: 'add-admin', component: AddAdminComponent, canActivate: [AuthGuard] },
      { path: 'update-admin/:id', component: UpdateAdminComponent, canActivate: [AuthGuard] },
      { path: 'AdminDetails/:id', component: AdminDetailsComponent, canActivate: [AuthGuard] },

      { path: 'clients', component: ClientListComponent, canActivate: [AuthGuard] },
      { path: 'produit', component: ProduitListComponent, canActivate: [AuthGuard] },
      //{ path: 'modifier-produit/:id', component: ModifierProduitComponent },
      { path: 'produitDetails/:id', component: ProduitDetailsComponent },

      { path: 'produits/recherche', component: FiltreProduitsComponent },


      { path: 'ajouter-produit', component: AjouterProduitComponent, canActivate: [AuthGuard] },
      { path: 'depots', component: MagasinListComponent, canActivate: [AuthGuard] },
      { path: 'messages', component: MessageListComponent, canActivate: [AuthGuard] },
      { path: 'promos', component: PromoManagerComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'logout', component: LogoutComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  }
];
