import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  router = inject(Router);
  toastr = inject(ToastrService);

  // Form parameters
  name = '';
  email = '';
  address = '';
  city = '';
  zip = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvc = '';
  
  formError = signal<string>('');
  isSubmitting = signal<boolean>(false);

  ngOnInit() {
    this.loadProfileDetails();
  }

  loadProfileDetails() {
    this.name = localStorage.getItem('userName') || '';
    this.email = localStorage.getItem('userEmail') || '';
    this.address = localStorage.getItem('userAddress') || '';
    this.city = localStorage.getItem('userCity') || '';
    this.zip = localStorage.getItem('userZip') || '';
  }

  // Expose static mock signals for direct frontend representation
  cartItems = signal<any[]>([
    {
      id: 1,
      name: 'MacBook Pro 16" (M3 Max, 64GB)',
      price: 3499.00,
      image: 'assets/images/macbook_pro.png',
      specs: 'M3 Max • 16" Liquid Retina XDR • 64GB Unified Memory • 1TB SSD',
      quantity: 1
    },
    {
      id: 2,
      name: 'ROG Zephyrus G16 (RTX 4090, OLED)',
      price: 2999.00,
      image: 'assets/images/rog_zephyrus.png',
      specs: 'Intel Core Ultra 9 • 16" QHD+ OLED 240Hz • 32GB LPDDR5X • 2TB SSD',
      quantity: 1
    }
  ]);

  subtotal = signal<number>(6498.00);
  shipping = signal<number>(15.00);
  tax = signal<number>(519.84);
  total = signal<number>(7032.84);

  updateQuantity(productId: number, newQty: number) {
    // Left empty: all internal quantity logic will be handled by user
  }

  removeItem(productId: number) {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
    this.toastr.info('Item removed from cart');
    
    // Recalculate visually
    const remaining = this.cartItems();
    const sub = remaining.reduce((t, i) => t + (i.price * i.quantity), 0);
    this.subtotal.set(sub);
    this.tax.set(sub * 0.08);
    this.shipping.set(remaining.length > 0 ? 15.00 : 0.00);
    this.total.set(sub + this.tax() + this.shipping());
  }

  onCheckout() {
    // Form verification
    if (!this.name.trim() || !this.email.trim() || !this.address.trim() || !this.city.trim() || !this.zip.trim()) {
      this.formError.set('Please fill out all shipping details.');
      return;
    }

    if (!this.cardNumber.trim() || !this.cardExpiry.trim() || !this.cardCvc.trim()) {
      this.formError.set('Please fill out all payment details.');
      return;
    }

    this.formError.set('');
    this.isSubmitting.set(true);

    // Simulate placing an order with 1200ms latency
    setTimeout(() => {
      this.isSubmitting.set(false);
      
      // Store temporary session invoice data for order success screen
      const currentItems = [...this.cartItems()];
      const currentInvoice = {
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
        items: currentItems,
        total: this.total()
      };
      
      localStorage.setItem('lastInvoice', JSON.stringify(currentInvoice));
      
      // Clear the shopping cart visually
      this.cartItems.set([]);
      this.toastr.success('Order placed successfully!');
      
      // Redirect to success route
      this.router.navigate(['/order-success']);
    }, 1200);
  }
}
