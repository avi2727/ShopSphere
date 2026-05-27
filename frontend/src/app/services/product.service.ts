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

  // updateProduct: Purane product ke features aur details ko modify karne ke liye.
  // Jab Admin "Save Product" click karta hai editing modal me, tab ye method call hota hai.
  // Ye PUT request bhejta hai `http://localhost:5006/api/products/{id}` par payload body ke sath.
  updateProduct(id: number, product: any) {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  // getProductById: Kisi single product ki dynamic detail fetch karne ke liye.
  // Jab user product card par click karta hai aur dynamic route `/products/:id` open hota hai,
  // tab ProductDetailComponent is service function ko hit karke backend se real-time specs fetch karta hai.
  getProductById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // uploadImage: local device se choose kiye image assets ko secure dynamic directory me post karne ke liye.
  // Multipart binary stream build karne ke liye FormData dynamic API object use kiya jata hai.
  // [FromForm] binder hit karne ke liye 'file' key me binary payload append karke POST request `api/products/upload` par dispatch hoti hai.
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  // getProducts: Catalog screen populate karne ke liye backend se sabhi products fetch karne ka primary function.
  // GET request dispatch hoti hai aur response list items component observable trigger karti hai.
  getProducts() {
    return this.http.get(this.apiUrl);
  }

  // deleteProduct: Kisi exist karne wale product ko dashboard se completely remove karne ke liye.
  // HTTP DELETE action bhejta hai product id parameter ke sath, jo direct backend `ProductsController.DeleteProduct` method par hit hoti hai.
  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}