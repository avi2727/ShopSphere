import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  toastr = inject(ToastrService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  activeTab = signal<string>('dashboard');
  userEmail = signal<string>('customer@shopsphere.com');
  userName = signal<string>('Customer Account');
  userPhone = signal<string>('+1 (555) 019-2834');
  userAddress = signal<string>('123 Tech Lane');
  userCity = signal<string>('San Francisco');
  userZip = signal<string>('94107');

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
    const email = localStorage.getItem('userEmail') || 'customer@shopsphere.com';
    const name = localStorage.getItem('userName') || 'Customer Account';
    const phone = localStorage.getItem('userPhone') || '+1 (555) 019-2834';
    const address = localStorage.getItem('userAddress') || '123 Tech Lane';
    const city = localStorage.getItem('userCity') || 'San Francisco';
    const zip = localStorage.getItem('userZip') || '94107';

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

    this.toastr.success('User Profile saved successfully!');
    
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
