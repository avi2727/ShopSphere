import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  features = [
    {
      title: 'Premium Quality',
      description: 'Hand-picked products that meet our highest standards of excellence.',
      icon: 'polygon-outline'
    },
    {
      title: 'Swift Delivery',
      description: 'Global shipping network ensuring your orders arrive in record time.',
      icon: 'send-outline'
    },
    {
      title: 'Secure Shopping',
      description: 'Military-grade encryption for all your transactions and data.',
      icon: 'shield-checkmark-outline'
    }
  ];

  trendingProducts = [
    { id: 1, name: 'Luna Smart Watch', price: 199.99, image: 'assets/hero-bg.png' },
    { id: 2, name: 'Aero Dynamic Buds', price: 149.50, image: 'assets/hero-bg.png' },
    { id: 3, name: 'Vortex VR Headset', price: 499.00, image: 'assets/hero-bg.png' },
    { id: 4, name: 'Zenith Peak Laptop', price: 1299.99, image: 'assets/hero-bg.png' },
  ];
}
