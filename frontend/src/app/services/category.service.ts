// Injectable decorator import kar rahe hain jo dynamic dependency injection support register karega.
import { Injectable } from '@angular/core';
// HttpClient service backend controllers ke endpoints fetch karne ke liye import kiya hai.
import { HttpClient } from '@angular/common/http';

// @Injectable: Is decorator ke zariye Angular pure application block me ek hi single shared instance register karta hai (Singleton pattern).
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // api/categories backend Base URL endpoint.
  private apiUrl = 'http://localhost:5006/api/categories';

  // Constructor: dependency injection layer se Angular automatically HttpClient object init karta hai.
  constructor(private http: HttpClient) {}

  // getCategories: Categories listing console, products selector dropdowns, and dashboard filters compile karne ke liye.
  // Ye backend GET `/api/categories` trigger karta hai.
  getCategories() {
    return this.http.get(this.apiUrl);
  }

  // getCategoryById: Kisi specific category ki detail pull karne ke liye (GET request path variable backend route match karega).
  getCategoryById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // createCategory: Admin Console se nayi category name store karne ka handler.
  // POST request bhejta hai, jo backend server `CreateCategory` method ko trigger karti hai.
  createCategory(category: any) {
    return this.http.post(this.apiUrl, category);
  }

  // updateCategory: Existing Category entry modification logic trigger karne ke liye.
  // PUT request bhejta hai updated body schema structure ke sath server console endpoint par.
  updateCategory(id: number, category: any) {
    return this.http.put(`${this.apiUrl}/${id}`, category);
  }

  // deleteCategory: Product categories admin dashboard CRUD console se records clear out karne ke liye.
  // DELETE request trigger karta hai selected ID variable parameters target karke.
  deleteCategory(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
