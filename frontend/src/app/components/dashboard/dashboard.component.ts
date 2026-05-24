import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userEmail = signal<string>('admin@shopsphere.com');
  isAdmin = signal<boolean>(false);

  // Admin Mock metrics
  stats = [
    { label: 'Total Revenue', value: '$24,890.50', change: '+12.4%', isPositive: true, icon: '💰' },
    { label: 'Active Orders', value: '148', change: '+8.2%', isPositive: true, icon: '📦' },
    { label: 'Conversion Rate', value: '3.24%', change: '-1.5%', isPositive: false, icon: '📈' },
    { label: 'Active Customers', value: '1,280', change: '+18.3%', isPositive: true, icon: '👥' }
  ];

  recentOrders = [
    { id: '#ORD-9482', customer: 'Sarah Jenkins', product: 'Luna Smart Watch', amount: 199.99, status: 'Completed', date: '2 mins ago' },
    { id: '#ORD-9481', customer: 'David Miller', product: 'Aero Dynamic Buds', amount: 299.00, status: 'Processing', date: '10 mins ago' },
    { id: '#ORD-9480', customer: 'Elena Rostova', product: 'Vortex VR Headset', amount: 499.00, status: 'Pending', date: '1 hr ago' },
    { id: '#ORD-9479', customer: 'Marcus Brody', product: 'Zenith Peak Laptop', amount: 1299.99, status: 'Completed', date: '3 hrs ago' }
  ];

  // User/Customer Mock metrics
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
    const storedEmail = localStorage.getItem('userEmail') || 'admin@shopsphere.com';
    this.userEmail.set(storedEmail);
    this.isAdmin.set(storedEmail.toLowerCase().includes('admin'));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/']);
  }
}