import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
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
export class ProductsComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) { }


  products: any[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

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

    // EDIT
    if (this.isEditing) {

      this.productService.updateProduct(this.currentProduct.id, this.currentProduct)
        .subscribe({

          next: (response: any) => {

            const index = this.products.findIndex(
              p => p.id === response.id
            );

            if (index !== -1) {
              this.products[index] = response;
              this.products = [...this.products];
            }

            this.toastr.success('Product Updated Successfully');

            this.closeModal();
          },

          error: (error: any) => {
            console.log(error);
            this.formError = 'Update failed';
          }
        });

    }

    // CREATE
    else {

      this.productService.createProduct(this.currentProduct)
        .subscribe({

          next: (response: any) => {

            this.products = [...this.products, response];

            this.toastr.success('Product Created Successfully');

            this.closeModal();
          },

          error: (error: any) => {
            console.log(error);
            this.formError = 'Creation failed';
          }
        });
    }
  }


  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        // API data products array me store
        this.products = [...(response.$values || response)];
        this.cdr.detectChanges(); // Force Angular to detect changes and render the loaded data
      },

      error: (error: any) => {
        console.log(error);
      }
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.id !== id);
        this.toastr.success('Deleted Successfully');
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}
