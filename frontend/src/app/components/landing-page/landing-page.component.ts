import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  cartService = inject(CartService);
  features = [
    {
      title: 'Next-Gen Hardware',
      description: 'Hand-picked laptops featuring the latest Intel Core Ultra, Apple M3, and NVIDIA RTX graphics.',
      icon: 'polygon-outline'
    },
    {
      title: 'Swift Insured Shipping',
      description: 'Safe, global delivery network ensuring your premium machine arrives in record time.',
      icon: 'send-outline'
    },
    {
      title: 'Official Warranty',
      description: 'Comprehensive 2-year warranty and dedicated 24/7 hardware tech support.',
      icon: 'shield-checkmark-outline'
    }
  ];

  trendingProducts = [
    {
      id: 1,
      name: 'MacBook Pro 16" (M3 Max, 64GB)',
      price: '3,499.00',
      image: 'assets/images/macbook_pro.png',
      specs: 'M3 Max • 16" Liquid Retina XDR • 64GB Unified Memory • 1TB SSD'
    },
    {
      id: 2,
      name: 'ROG Zephyrus G16 (RTX 4090, OLED)',
      price: '2,999.00',
      image: 'assets/images/rog_zephyrus.png',
      specs: 'Intel Core Ultra 9 • 16" QHD+ OLED 240Hz • 32GB LPDDR5X • 2TB SSD'
    },
    {
      id: 3,
      name: 'Dell XPS 14 (Core Ultra 7, RTX 4050)',
      price: '1,999.00',
      image: 'assets/images/dell_xps.png',
      specs: 'Core Ultra 7 • 14.5" 3.2K OLED Touch • 16GB LPDDR5X • 512GB SSD'
    },
    {
      id: 4,
      name: 'ThinkPad X1 Carbon Gen 12',
      price: '1,799.00',
      image: 'assets/images/thinkpad_x1.png',
      specs: 'Intel Core Ultra 7 • 14" WUXGA IPS • 32GB LPDDR5X • 1TB SSD'
    }
  ];
}
