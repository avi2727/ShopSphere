import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
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
  orderService = inject(OrderService);
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
  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.cartSubtotal;
  shipping = this.cartService.shippingFee;
  tax = this.cartService.taxFee;
  total = this.cartService.cartTotal;

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.toastr.success('Item removed from cart');
  }

  onCheckout() {
    this.formError.set('');

    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.address.trim() ||
      !this.city.trim() ||
      !this.zip.trim() ||
      !this.cardNumber.trim() ||
      !this.cardExpiry.trim() ||
      !this.cardCvc.trim()
    ) {
      this.formError.set('Please fill out all shipping and payment details.');
      this.toastr.error('Please fill out all shipping and payment details.');
      return;
    }

    this.isSubmitting.set(true);

    const orderData = {
      items: this.cartItems().map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (res: any) => {

        const orderId = res.orderId;

        const trackingNumber = 'DHL-' + Math.floor(100000000 + Math.random() * 900000000);

        const invoiceData = {
          orderId: orderId,
          trackingNumber: trackingNumber,
          items: this.cartItems(),
          total: this.total()
        };

        localStorage.setItem('lastInvoice', JSON.stringify(invoiceData));

        this.cartService.clearCart();

        this.toastr.success('Order placed successfully!');

        this.router.navigate(['/order-success']);
      },

      error: (err) => {
        console.error(err);
        this.toastr.error('Order failed!');
      },

      complete: () => {
        this.isSubmitting.set(false);
      }
    });
  }
}
