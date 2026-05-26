import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  userEmail = signal<string>('customer@shopsphere.com');

  userStats = [
    { label: 'Total Spent', value: '$3,499.00', change: '1 Item', isPositive: true, icon: '💸' },
    { label: 'My Orders', value: '1 Active', change: 'Delivered: 1', isPositive: true, icon: '🛍️' },
    { label: 'Active Coupons', value: '1 Available', change: '10% Off', isPositive: true, icon: '🎟️' },
    { label: 'Store Credits', value: '$50.00', change: 'Valid 30d', isPositive: true, icon: '💳' }
  ];

  myOrders = [
    { id: '#ORD-1002', product: 'MacBook Pro 16" (M3 Max)', amount: 3499.00, status: 'Processing', date: '1 day ago' },
    { id: '#ORD-1001', product: 'Laptop Cooling Pad RGB', amount: 45.00, status: 'Completed', date: '5 days ago' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    const storedEmail = localStorage.getItem('userEmail') || 'customer@shopsphere.com';
    this.userEmail.set(storedEmail);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/']);
  }
}
