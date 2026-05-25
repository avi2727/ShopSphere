import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) { }

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
      this.errorMessage = 'You must agree to the Terms.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      username: this.email,   // IMPORTANT mapping
      password: this.password
    };

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.errorMessage = '';
        this.successMessage = res.message || 'Registration successful!';
        this.toastr.success(res.message || 'Registration successful!');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: any) => {
        this.isLoading = false;
        const msg = err?.error?.message || err?.error || 'Registration failed';
        this.errorMessage = msg;
        this.successMessage = '';
        this.toastr.error(msg);
      }
    });
  }
}
