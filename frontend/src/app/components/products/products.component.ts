import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  products: any[] = [];

  searchQuery = '';
  isModalOpen = false;
  isEditing = false;

  // Model mapping
  currentProduct = { id: 0, name: '', price: 0 };
  formError = '';

  // Getter for real-time search filtration
  get filteredProducts(): any[] {
    if (!this.searchQuery.trim()) {
      return this.products;
    }
    const query = this.searchQuery.toLowerCase();
    return this.products.filter(
      (p) => p.name.toLowerCase().includes(query) || p.id.toString().includes(query),
    );
  }

  openAddModal() {
    this.isEditing = false;
    this.currentProduct = { id: 0, name: '', price: 0 };
    this.formError = '';
    this.isModalOpen = true;
  }

  openEditModal(product: any) {
    this.isEditing = true;
    this.currentProduct = { ...product }; // clone product
    this.formError = '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.formError = '';
    this.cdr.detectChanges();
  }

  saveProduct() {
  
    if (!this.currentProduct.name || this.currentProduct.name.trim().length < 3) {
      this.formError = 'Product name must be at least 3 characters long.';
      return;
    }

    if (this.currentProduct.price === null || this.currentProduct.price <= 0) {
      this.formError = 'Please enter a positive price value greater than 0.';
      return;
    }

    this.formError = '';

    this.productService.createProduct(this.currentProduct).subscribe({
      next: (response: any) => {
        console.log('Product Created');
        console.log(response);

        // Close the modal first to prevent UI freezing
        this.closeModal();

        // Update state and show toastr in a new macro-task to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.products = [...this.products, response];
          this.toastr.success('Product Created Successfully');
          this.cdr.detectChanges();
        }, 0);
      },

      error: (error) => {
        console.log(error);
        this.formError = 'Something went wrong';
      },
    });
  }

  deleteProduct(id: number) {
    // Immediate reactive filtration
    this.products = this.products.filter((p) => p.id !== id);
  }
}
