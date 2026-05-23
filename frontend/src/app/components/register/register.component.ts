import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  agreeTerms = false;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private router: Router) {}

  onRegister() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long.';
      return;
    }

    if (!this.agreeTerms) {
      this.errorMessage = 'You must agree to the Terms of Service & Privacy Policy.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulate network registration delay of 1s
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Registration successful! Redirecting to login...';
      
      // Store registering user info locally to simulate sign-up persistence
      localStorage.setItem('registeredUser', JSON.stringify({ name: this.name, email: this.email }));

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }, 1000);
  }
}
