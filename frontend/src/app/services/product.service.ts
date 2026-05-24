// Angular ka Injectable decorator import kar rahe hain
// Isse Angular ko pata chalta hai ki ye class dependency injection me use hogi
import { Injectable } from '@angular/core';

// Angular ka HttpClient import kar rahe hain
// Iska use backend/API call karne ke liye hota hai
import { HttpClient } from '@angular/common/http';


// Injectable decorator
// providedIn: 'root' ka matlab:
// poore application me ProductService ka ek hi global object banega
@Injectable({
  providedIn: 'root',
})


// ProductService class start
// Ye service backend/API se communication karegi
export class ProductService {

  // API ka base URL store kiya hai
  // private ka matlab:
  // ye variable sirf isi class ke andar use hoga
  private apiUrl = 'http://localhost:5006/api/products';


  // Constructor me Angular automatically HttpClient ka object inject karega
  // Dependency Injection concept
  // Ab this.http use karke API calls kar sakte hain
  constructor(private http: HttpClient) { }


  // New product create karne ka method
  // product parameter me frontend ka data aayega
  createProduct(product: any) {

    // POST request backend ko bhej raha hai
    // this.apiUrl = endpoint
    // product = request body data

    // Ye actual response return nahi karta
    // Ye Observable return karta hai
    return this.http.post(this.apiUrl, product);
  }


  updateProduct(id: number, product: any) {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }


  // Products fetch karne ka method
  getProducts() {

    // GET request backend ko bhej raha hai

    // Ye bhi Observable return karega
    // Actual data subscribe() me milega
    return this.http.get(this.apiUrl);
  }

  deleteProduct(id: number) {
    // DELETE API call
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}