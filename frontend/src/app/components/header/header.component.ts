import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
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
  isProfilePopupOpen = signal<boolean>(false);

  toggleProfilePopup(event: Event) {
    event.stopPropagation();
    this.isProfilePopupOpen.update(prev => !prev);
  }

  closeProfilePopup() {
    this.isProfilePopupOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeProfilePopup();
  }

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
    let role = localStorage.getItem('userRole') || '';
    
    // Self-healing: if role is empty but email is present, infer from email substring
    if (!role && email) {
      role = email.toLowerCase().includes('admin') ? 'Admin' : 'User';
      localStorage.setItem('userRole', role);
    }
    
    this.isLoggedIn.set(!!token);
    this.userEmail.set(email);
    this.isAdmin.set(role.toLowerCase() === 'admin');
    this.showHeader.set(true);
  }

  logout() {
    this.closeProfilePopup();
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
    this.userEmail.set('');
    this.router.navigate(['/login']);
  }
}
