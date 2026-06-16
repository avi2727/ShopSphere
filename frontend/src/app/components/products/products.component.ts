import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';


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
    private categoryService: CategoryService,
  ) { }

  // Angular Signals state variables:
  // products: Catalog page ke sabhi products ko array me store karta hai.
  products = signal<any[]>([]);
  // categoriesList: Form dropdown populate karne ke liye backend categories fetch karke isme set ki jati hain.
  categoriesList = signal<any[]>([]);
  // searchQuery: Real-time search query query input string track karta hai.
  searchQuery = signal<string>('');
  // isModalOpen: Add/Edit Product modal panel screen visibility toggle indicator.
  isModalOpen = signal<boolean>(false);
  // isEditing: true matlab edit mode active hai, false matlab new create product active hai.
  isEditing = signal<boolean>(false);
  // formError: Frontend custom validation alert message store karta hai jo dynamic screen banners me display hota hai.
  formError = signal<string>('');
  // isAdmin: true tab jab logged-in user admin role holder ho (ye edit/delete actions block permissions define karta hai).
  isAdmin = signal<boolean>(false);

  // isDeleteModalOpen: Safe double-confirm warning delete modal block trigger check.
  isDeleteModalOpen = signal<boolean>(false);
  // productIdToDelete: Selected element variable safe identity track karne ke liye.
  productIdToDelete = signal<number | null>(null);
  // productNameToDelete: Double-checking modal window dialog text display ke liye.
  productNameToDelete = signal<string>('');

  // Form mapping object: [(ngModel)] template state variables bindings handle karne ke liye interface representation.
  currentProduct = {
    id: 0,
    name: '',
    price: 0,
    description: '',
    stockQuantity: 0,
    imageUrl: '',
    specifications: '',
    categoryId: 1
  };

  // computed Signal: client search performance optimise karne ke liye. 
  // Jab search input text change ho, tab dynamic catalog real-time reload data updates list filter karta hai.
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

  // ngOnInit: Component boot up method. 
  // Backend database items pull karega aur login storage permissions parsing check verify karke admin signals validate karega.
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategoriesList();
    const email = localStorage.getItem('userEmail') || '';
    let role = localStorage.getItem('userRole') || '';

    // Auto role sync: default demo admin/user setup handle karne ke liye.
    if (!role && email) {
      role = email.toLowerCase().includes('admin') ? 'Admin' : 'User';
      localStorage.setItem('userRole', role);
    }

    this.isAdmin.set(role.toLowerCase() === 'admin');
  }

  // loadCategoriesList: Category service call karke, categories response data fetch karta hai.
  // Agar database me koi category na ho, to ye dynamic auto-heal logic execute karke "Laptops" category seed karega.
  loadCategoriesList() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        const list = [...(response.$values || response)];
        this.categoriesList.set(list);

        // Auto-heal empty categories list for demo support
        if (list.length === 0) {
          // Agar database me categories blank hain, to automatic base Category generate karke default list set karenge.
          this.categoryService.createCategory({ name: 'Laptops' }).subscribe({
            next: (newCat: any) => {
              this.categoriesList.set([newCat]);
              this.currentProduct.categoryId = newCat.id;
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Failed to load categories', error);
      }
    });
  }

  // getCategoryName: Product display list tiles me Category Id key ke against actual human readable Category Name lookup karne ke liye helper.
  getCategoryName(categoryId: number): string {
    const found = this.categoriesList().find(c => c.id === categoryId);
    return found ? found.name : `ID: ${categoryId}`;
  }

  // openAddModal: Naya Product catalog item create karne ke modal window open parameters init karta hai.
  openAddModal() {
    if (!this.isAdmin()) return;
    this.isEditing.set(false);
    const defaultCatId = this.categoriesList().length > 0 ? this.categoriesList()[0].id : 1;
    this.currentProduct = {
      id: 0,
      name: '',
      price: 0,
      description: '',
      stockQuantity: 0,
      imageUrl: '',
      specifications: '',
      categoryId: defaultCatId
    };
    this.formError.set('');
    this.isModalOpen.set(true);
  }

  // openEditModal: Catalog product editing dashboard form trigger.
  // Yeh selected product schema parameters copy karta hai.
  // Try-catch parser JSON string checking check lagata hai taaki specifications input area plain formatted visible rahe.
  openEditModal(product: any) {
    if (!this.isAdmin()) return;
    this.isEditing.set(true);
    this.currentProduct = { ...product }; // clone product

    // Specifications formatting cleaner: jsonb validation alerts filter out karne ke liye.
    if (this.currentProduct.specifications) {
      try {
        const parsed = JSON.parse(this.currentProduct.specifications);
        if (typeof parsed === 'string') {
          this.currentProduct.specifications = parsed;
        }
      } catch (e) {
        // dynamic error ignore - original as-is safe copy.
      }
    }

    this.formError.set('');
    this.isModalOpen.set(true);
  }

  // closeModal: Input dialog elements dynamically close settings update block.
  closeModal() {
    this.isModalOpen.set(false);
    this.formError.set('');
  }

  // displaySpecs: Product listing display specifications clean template view converter helper.
  // specifications json string ko readable key-value bullets pattern display form me printout karta hai.
  displaySpecs(specs: string): string {
    if (!specs) return 'No specifications';
    try {
      const parsed = JSON.parse(specs);
      if (typeof parsed === 'string') {
        return parsed;
      }
      if (typeof parsed === 'object' && parsed !== null) {
        return Object.entries(parsed).map(([key, val]) => `${key}: ${val}`).join(' • ');
      }
    } catch (e) {
      // JSON format check failed
    }
    return specs;
  }

  // isUploading signal: image server uploading state trigger track parameters representation helper.
  isUploading = signal<boolean>(false);

  // onFileSelected: Image drag-and-drop zone ya input picker change hone par hit hota hai.
  // Validation Checks:
  // 1. Extension Verification (Strictly PNG, JPG, JPEG, WEBP, GIF allow-list check) to prevent remote execution bypasses.
  // 2. Size Boundary checks (5MB limit verification) to prevent server side storage exhaustion.
  // 3. ProductService.uploadImage method trigger karke Form data publish karta hai.
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Allowed extensions security check
    const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedExtensions.includes(file.type)) {
      this.formError.set('Invalid image type. Please select PNG, JPG, JPEG, WEBP or GIF.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.formError.set('File size exceeds the 5MB limit.');
      return;
    }

    this.isUploading.set(true);
    this.formError.set('');

    this.productService.uploadImage(file).subscribe({
      next: (response: any) => {
        // Dynamic server uploaded path url client parameter me bind hoti hai preview frame load ke liye.
        this.currentProduct.imageUrl = response.imageUrl;
        this.isUploading.set(false);
        this.toastr.success('Image uploaded successfully');
      },
      error: (error: any) => {
        console.error('Upload failed', error);
        this.formError.set('Image upload failed. Please try again.');
        this.isUploading.set(false);
      }
    });
  }

  // saveProduct: Save/Create button submit validation.
  // 1. Title/Price validation checks.
  // 2. Specifications parsing validation checks: Agar Admin specifications text inputs plain text me rakhta hai,
  // to is text string ko `JSON.stringify` karke valid JSON model block standard payload build kiya jata hai.
  // Ye parsing PostgreSQL `jsonb` mapping errors ko dynamically solid status me protect karti hai.
  // 3. Mode Selection logic: index search verification updates ya new entry creations save action direct hit karega.
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

    // specifications database compatibility mapping validation - prevents crash on invalid JSON data.
    let specsJson = this.currentProduct.specifications ? this.currentProduct.specifications.trim() : '';
    if (!specsJson) {
      specsJson = '{}';
    } else {
      try {
        JSON.parse(specsJson);
      } catch (e) {
        // Plain text ko valid stringified dynamic JSON structure me transfer karte hain.
        specsJson = JSON.stringify(specsJson);
      }
    }

    const payload = {
      ...this.currentProduct,
      specifications: specsJson
    };

    // EDIT Mode Call: PUT request `api/products/{id}` endpoint par.
    if (this.isEditing()) {
      this.productService.updateProduct(payload.id, payload)
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
    // CREATE Mode Call: POST request `api/products` endpoint par.
    else {
      this.productService.createProduct(payload)
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

  // loadProducts: Products inventory service database se fresh list loading function trigger parameters handle karega.
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        // Catalog lists display updates.
        this.products.set([...(response.$values || response)]);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  // promptDelete: Delete action key warning banner populates parameter setting triggers.
  promptDelete(product: any) {
    if (!this.isAdmin()) return;
    this.productIdToDelete.set(product.id);
    this.productNameToDelete.set(product.name);
    this.isDeleteModalOpen.set(true);
  }

  // cancelDelete: Reset parameters.
  cancelDelete() {
    this.isDeleteModalOpen.set(false);
    this.productIdToDelete.set(null);
    this.productNameToDelete.set('');
  }

  // confirmDelete: Database elements permanent removal handler. 
  // HTTP DELETE `api/products/{id}` hit karega aur local component lists filter karke toast alerts verify karega.
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

  // getLaptopImage: Dynamic visual enhancements helper. 
  // Custom text name tracking matches check lagakar high premium asset visual layout render lookup map load karega.
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

  // getLaptopSpecs: Laptop details specs labels matching check parameters definition triggers dynamic bulletins returns.
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

  // quickAddToCart: Checkout processes direct redirection console trigger parameters.
  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.toastr.success('Product added to cart');
    // this.router.navigate(['/cart']);
  }
}
