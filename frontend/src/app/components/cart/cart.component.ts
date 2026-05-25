import { Component, signal, inject } from '@angular/core';
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
export class CartComponent {
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

  // Expose signals from CartService
  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.cartSubtotal;
  shipping = this.cartService.shippingFee;
  tax = this.cartService.taxFee;
  total = this.cartService.cartTotal;

  updateQuantity(productId: number, newQty: number) {
    this.cartService.updateQuantity(productId, newQty);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.toastr.info('Item removed from cart');
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
      
      // Clear the shopping cart
      this.cartService.clearCart();
      this.toastr.success('Order placed successfully!');
      
      // Redirect to success route
      this.router.navigate(['/order-success']);
    }, 1200);
  }
}
