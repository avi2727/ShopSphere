import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = 'http://localhost:5006/api/products';

  constructor(private http: HttpClient) { }

  createProduct(product: any) {
    return this.http.post(this.apiUrl, product);
  }
}