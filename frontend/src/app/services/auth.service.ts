import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5006/api/auth';

  constructor(private http: HttpClient) {}

  // 🔐 LOGIN
  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  // 🆕 REGISTER
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // 🚪 LOGOUT
  logout() {
    localStorage.removeItem('token');
  }

  // 🔍 GET TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ CHECK LOGIN STATUS
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}