import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onLogin() {

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const user = {
      username: this.email,
      password: this.password
    };

    this.authService.login(user).subscribe({
      next: (response) => {

        // ✅ STORE JWT TOKEN
        localStorage.setItem('token', response.token);
        localStorage.setItem('userEmail', response.username);
        localStorage.setItem('userRole', response.role);

        this.isLoading = false;

        // redirect directly to role-based dashboard
        if (response.role && response.role.toLowerCase() === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },

      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Invalid credentials';
      }
    });
  }
}