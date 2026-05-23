import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate network latency of 800ms
    setTimeout(() => {
      this.isLoading = false;
      // Store a mock session token
      localStorage.setItem('token', 'mock-jwt-token-123456');
      localStorage.setItem('userEmail', this.email);
      // Route directly to dashboard
      this.router.navigate(['/dashboard']);
    }, 800);
  }
}
