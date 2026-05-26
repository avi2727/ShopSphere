import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartService = inject(CartService);
  router = inject(Router);

  isLoggedIn = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  userEmail = signal<string>('');
  showHeader = signal<boolean>(true);

  ngOnInit() {
    this.checkAuthStatus();

    // Listen to routing events to refresh auth status
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkAuthStatus();
      }
    });
  }

  checkAuthStatus() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail') || '';
    
    this.isLoggedIn.set(!!token);
    this.userEmail.set(email);
    this.isAdmin.set(email.toLowerCase().includes('admin'));

    // Dynamically show/hide header on side-nav dashboards and auth screens
    const currentUrl = this.router.url;
    const hideOnRoutes = ['/admin-dashboard', '/user-dashboard', '/login', '/register'];
    const shouldHide = hideOnRoutes.some(route => currentUrl.includes(route));
    this.showHeader.set(!shouldHide);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
    this.userEmail.set('');
    this.router.navigate(['/login']);
  }
}
