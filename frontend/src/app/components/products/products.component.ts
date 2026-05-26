import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';

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
    public cartService: CartService,
    private router: Router,
  ) { }

  products = signal<any[]>([]);
  searchQuery = signal<string>('');
  isModalOpen = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  formError = signal<string>('');
  isAdmin = signal<boolean>(false);
  
  isDeleteModalOpen = signal<boolean>(false);
  productIdToDelete = signal<number | null>(null);
  productNameToDelete = signal<string>('');

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
    const email = localStorage.getItem('userEmail') || '';
    let role = localStorage.getItem('userRole') || '';
    
    if (!role && email) {
      role = email.toLowerCase().includes('admin') ? 'Admin' : 'User';
      localStorage.setItem('userRole', role);
    }
    
    this.isAdmin.set(role.toLowerCase() === 'admin');
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

  promptDelete(product: any) {
    if (!this.isAdmin()) return;
    this.productIdToDelete.set(product.id);
    this.productNameToDelete.set(product.name);
    this.isDeleteModalOpen.set(true);
  }

  cancelDelete() {
    this.isDeleteModalOpen.set(false);
    this.productIdToDelete.set(null);
    this.productNameToDelete.set('');
  }

  confirmDelete() {
    const id = this.productIdToDelete();
    if (id === null) return;
    
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update(all => all.filter(p => p.id !== id));
        this.toastr.success('Deleted Successfully');
        this.cancelDelete();
      },
      error: (error: any) => {
        console.log(error);
        this.toastr.error('Deletion failed');
        this.cancelDelete();
      }
    });
  }

  getLaptopImage(product: any): string {
    const name = product.name.toLowerCase();
    if (name.includes('macbook') || name.includes('apple')) {
      return 'assets/images/macbook_pro.png';
    } else if (name.includes('zephyrus') || name.includes('asus') || name.includes('rog')) {
      return 'assets/images/rog_zephyrus.png';
    } else if (name.includes('xps') || name.includes('dell')) {
      return 'assets/images/dell_xps.png';
    } else if (name.includes('thinkpad') || name.includes('lenovo')) {
      return 'assets/images/thinkpad_x1.png';
    }
    const images = [
      'assets/images/macbook_pro.png',
      'assets/images/rog_zephyrus.png',
      'assets/images/dell_xps.png',
      'assets/images/thinkpad_x1.png'
    ];
    return images[product.id % images.length];
  }

  getLaptopSpecs(product: any): string {
    const name = product.name.toLowerCase();
    if (name.includes('macbook')) {
      return 'M3 Max • 16" Liquid Retina XDR • 64GB Unified Memory • 1TB SSD';
    } else if (name.includes('zephyrus')) {
      return 'Intel Core Ultra 9 • 16" OLED 240Hz • 32GB RAM • 2TB SSD • RTX 4090';
    } else if (name.includes('xps')) {
      return 'Core Ultra 7 • 14.5" OLED Touch • 16GB RAM • 512GB SSD • RTX 4050';
    } else if (name.includes('thinkpad')) {
      return 'Intel Core Ultra 7 • 14" WUXGA IPS • 32GB RAM • 1TB SSD • Intel Arc';
    }
    return 'High Performance Workstation • Premium Multi-core CPU • Fast NVMe SSD';
  }

  quickAddToCart(product: any) {
    this.router.navigate(['/cart']);
  }
}
