import { Component, OnInit, signal, computed } from '@angular/core';
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
  ) { }

  products = signal<any[]>([]);
  searchQuery = signal<string>('');
  isModalOpen = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  formError = signal<string>('');
  isAdmin = signal<boolean>(false);

  // Form mapping - standard object for clean ngModel bindings
  currentProduct = { id: 0, name: '', price: 0 };

  // Computed signal for real-time search filtration
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allProducts = this.products();
    if (!query) {
      return allProducts;
    }
    return allProducts.filter(
      (p) => p.name.toLowerCase().includes(query) || p.id.toString().includes(query),
    );
  });

  ngOnInit(): void {
    this.loadProducts();
    const storedEmail = localStorage.getItem('userEmail') || '';
    this.isAdmin.set(storedEmail.toLowerCase().includes('admin'));
  }

  openAddModal() {
    if (!this.isAdmin()) return;
    this.isEditing.set(false);
    this.currentProduct = { id: 0, name: '', price: 0 };
    this.formError.set('');
    this.isModalOpen.set(true);
  }

  openEditModal(product: any) {
    if (!this.isAdmin()) return;
    this.isEditing.set(true);
    this.currentProduct = { ...product }; // clone product
    this.formError.set('');
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.formError.set('');
  }

  saveProduct() {
    if (!this.isAdmin()) return;

    if (!this.currentProduct.name || this.currentProduct.name.trim().length < 3) {
      this.formError.set('Product name must be at least 3 characters long.');
      return;
    }

    if (this.currentProduct.price === null || this.currentProduct.price <= 0) {
      this.formError.set('Please enter a positive price value greater than 0.');
      return;
    }

    this.formError.set('');

    // EDIT
    if (this.isEditing()) {
      this.productService.updateProduct(this.currentProduct.id, this.currentProduct)
        .subscribe({
          next: (response: any) => {
            const index = this.products().findIndex(p => p.id === response.id);
            if (index !== -1) {
              const updatedList = [...this.products()];
              updatedList[index] = response;
              this.products.set(updatedList);
            }
            this.toastr.success('Product Updated Successfully');
            this.closeModal();
          },
          error: (error: any) => {
            console.log(error);
            this.formError.set('Update failed');
          }
        });
    }
    // CREATE
    else {
      this.productService.createProduct(this.currentProduct)
        .subscribe({
          next: (response: any) => {
            this.products.update(all => [...all, response]);
            this.toastr.success('Product Created Successfully');
            this.closeModal();
          },
          error: (error: any) => {
            console.log(error);
            this.formError.set('Creation failed');
          }
        });
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        // API data products array me store
        this.products.set([...(response.$values || response)]);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  deleteProduct(id: number) {
    if (!this.isAdmin()) return;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update(all => all.filter(p => p.id !== id));
        this.toastr.success('Deleted Successfully');
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}
