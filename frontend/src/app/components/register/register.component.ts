import { Component, signal } from '@angular/core';
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
  name = signal('');
  email = signal('');
  password = signal('');
  agreeTerms = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  onRegister() {
    if (!this.name() || !this.email() || !this.password()) {
      this.errorMessage.set('All fields are required.');
      return;
    }

    if (this.password().length < 8) {
      this.errorMessage.set('Password must be at least 8 characters long.');
      return;
    }

    if (!this.agreeTerms()) {
      this.errorMessage.set('You must agree to the Terms.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = {
      username: this.name(),
      email: this.email(),
      password: this.password()
    };

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.errorMessage.set('');
        const successMsg = res.message || 'Registration successful!';
        this.successMessage.set(successMsg);
        this.toastr.success(successMsg);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || err?.error || 'Registration failed';
        this.errorMessage.set(msg);
        this.successMessage.set('');
        this.toastr.error(msg);
      }
    });
  }
}
