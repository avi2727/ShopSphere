import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5006/api/orders';

  createOrder(orderData: any) {

    const token = localStorage.getItem('token');
    return this.http.post(
      this.apiUrl,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}