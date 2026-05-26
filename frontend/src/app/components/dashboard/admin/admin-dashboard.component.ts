import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  toastr = inject(ToastrService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  activeTab = signal<string>('dashboard');
  userEmail = signal<string>('admin@shopsphere.com');
  userName = signal<string>('Administrator');
  userPhone = signal<string>('+1 (555) 019-9999');
  userAddress = signal<string>('99 Enterprise Blvd');
  userCity = signal<string>('Silicon Valley');
  userZip = signal<string>('95014');

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

  ngOnInit() {
    this.loadProfile();
    
    // Dynamically toggle tab workspace based on query parameters
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'settings') {
        this.activeTab.set('settings');
      } else {
        this.activeTab.set('dashboard');
      }
    });
  }

  loadProfile() {
    const email = localStorage.getItem('userEmail') || 'admin@shopsphere.com';
    const name = localStorage.getItem('userName') || 'Administrator';
    const phone = localStorage.getItem('userPhone') || '+1 (555) 019-9999';
    const address = localStorage.getItem('userAddress') || '99 Enterprise Blvd';
    const city = localStorage.getItem('userCity') || 'Silicon Valley';
    const zip = localStorage.getItem('userZip') || '95014';

    this.userEmail.set(email);
    this.userName.set(name);
    this.userPhone.set(phone);
    this.userAddress.set(address);
    this.userCity.set(city);
    this.userZip.set(zip);
  }

  saveProfile() {
    if (!this.userEmail().trim() || !this.userName().trim()) {
      this.toastr.error('Full Name and Email Address are required!');
      return;
    }

    localStorage.setItem('userEmail', this.userEmail());
    localStorage.setItem('userName', this.userName());
    localStorage.setItem('userPhone', this.userPhone());
    localStorage.setItem('userAddress', this.userAddress());
    localStorage.setItem('userCity', this.userCity());
    localStorage.setItem('userZip', this.userZip());

    this.toastr.success('Admin Profile saved successfully!');
    
    // Auto-update dashboard sidebar active email reference
    this.loadProfile();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}
