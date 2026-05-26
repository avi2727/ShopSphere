import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ProductsComponent } from './components/products/products.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { AdminDashboardComponent } from './components/dashboard/admin/admin-dashboard.component';
import { UserDashboardComponent } from './components/dashboard/user/user-dashboard.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-success', component: OrderSuccessComponent },
];
