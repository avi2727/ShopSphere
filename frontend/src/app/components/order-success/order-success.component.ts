import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {
  cartService = inject(CartService);
  invoice = signal<any>(null);
  estimatedDelivery = signal<string>('');
  isAdmin = signal<boolean>(false);

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail') || '';
    let role = localStorage.getItem('userRole') || '';
    
    if (!role && email) {
      role = email.toLowerCase().includes('admin') ? 'Admin' : 'User';
      localStorage.setItem('userRole', role);
    }
    
    this.isAdmin.set(role.toLowerCase() === 'admin');
    // Read invoice data from transaction session
    const savedInvoice = localStorage.getItem('lastInvoice');
    if (savedInvoice) {
      try {
        const data = JSON.parse(savedInvoice);
        this.invoice.set(data);
      } catch (e) {
        console.error('Failed to parse invoice data', e);
      }
    }

    // Generate estimated arrival date (e.g. 3 business days from now)
    const arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() + 3);
    this.estimatedDelivery.set(arrivalDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }
}
