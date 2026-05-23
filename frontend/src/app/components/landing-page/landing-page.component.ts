import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
  trendingProducts: any[] = [];
}
