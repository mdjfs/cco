import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
