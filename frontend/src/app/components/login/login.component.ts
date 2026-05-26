import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  onLogin() {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please enter both email and password.');

      return;
    }

    this.isLoading.set(true);

    this.errorMessage.set('');

    const user = {
      email: this.email(),
      password: this.password(),
    };

    this.authService.login(user).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);

        localStorage.setItem('userName', response.username);

        localStorage.setItem('userEmail', response.email);

        localStorage.setItem('userRole', response.role);

        this.isLoading.set(false);

        if (response.role && response.role.toLowerCase() === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },

      error: () => {
        this.isLoading.set(false);

        this.errorMessage.set('Invalid credentials');
      },
    });
  }
}
