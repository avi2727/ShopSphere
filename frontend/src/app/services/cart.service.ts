import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  specs: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Writable signal containing current items in cart
  cartItems = signal<CartItem[]>([]);

  // Computed signals for reactive UI calculations
  cartCount = computed(() => {
    return this.cartItems().reduce((count, item) => count + item.quantity, 0);
  });

  cartSubtotal = computed(() => {
    return this.cartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  shippingFee = computed(() => {
    return this.cartItems().length > 0 ? 15.00 : 0.00;
  });

  taxFee = computed(() => {
    return this.cartSubtotal() * 0.08; // 8% estimated VAT
  });

  cartTotal = computed(() => {
    return this.cartSubtotal() + this.shippingFee() + this.taxFee();
  });

  constructor() {
    // Load existing cart session if present
    const savedCart = localStorage.getItem('cartSession');
    if (savedCart) {
      try {
        this.cartItems.set(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart session', e);
      }
    }
  }

  addToCart(product: any) {
    const items = [...this.cartItems()];
    const existing = items.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
      this.cartItems.set(items);
    } else {
      const priceVal = typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/,/g, '')) 
        : product.price;

      this.cartItems.set([
        ...items,
        {
          id: product.id,
          name: product.name,
          price: priceVal,
          image: product.image || 'assets/images/macbook_pro.png',
          specs: product.specs || '',
          quantity: 1
        }
      ]);
    }
    this.saveSession();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const items = this.cartItems().map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.cartItems.set(items);
    this.saveSession();
  }

  removeFromCart(productId: number) {
    this.cartItems.set(this.cartItems().filter(item => item.id !== productId));
    this.saveSession();
  }

  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem('cartSession');
  }

  private saveSession() {
    localStorage.setItem('cartSession', JSON.stringify(this.cartItems()));
  }
}
