import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.username === 'admin' && this.password === 'admin') {
      localStorage.setItem('isLoggedIn', 'true'); // mark user as logged in
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid username or password');
      localStorage.setItem('isLoggedIn', 'false');
    }
  }
}