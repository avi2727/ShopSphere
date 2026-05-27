import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  // categories Signal: Database ki dynamic categories ko fetch karke local array me memory store hold karta hai.
  categories = signal<any[]>([]);
  // isModalOpen Signal: Add/Edit category dialog block visibility manage karne ke liye.
  isModalOpen = signal<boolean>(false);
  // isEditing Signal: Add mode (false) aur Edit mode (true) ke beech switch check indicator.
  isEditing = signal<boolean>(false);
  // isAdmin Signal: Admin identity authorize validations check trigger dynamically handle karega.
  isAdmin = signal<boolean>(false);
  // formError Signal: Custom validations screen feedback alerts print out storage parameter.
  formError = signal<string>('');

  // isDeleteModalOpen Signal: Safe warnings dialog box window trigger checking.
  isDeleteModalOpen = signal<boolean>(false);
  // categoryIdToDelete Signal: Selected element safe deletion lookup identifier track parameters.
  categoryIdToDelete = signal<number | null>(null);
  // categoryNameToDelete Signal: Double verification dialog parameters content setup.
  categoryNameToDelete = signal<string>('');

  // currentCategory Form Binding Model: template [(ngModel)] variables binding standard interface.
  currentCategory = {
    id: 0,
    name: ''
  };

  // Constructor: Categories core backend services, toaster notifications engine, aur route navigation console parameters dependency injection.
  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  // ngOnInit: Boot verification console. 
  // User login storage state checks se "Admin" permission verify karega. 
  // non-admin entities ko direct redirect out (Access Denied) path clear out block back to home page trigger karega.
  ngOnInit(): void {
    const email = localStorage.getItem('userEmail') || '';
    let role = localStorage.getItem('userRole') || '';
    
    if (!role && email) {
      role = email.toLowerCase().includes('admin') ? 'Admin' : 'User';
      localStorage.setItem('userRole', role);
    }
    
    const adminStatus = role.toLowerCase() === 'admin';
    this.isAdmin.set(adminStatus);

    if (!adminStatus) {
      this.toastr.error('Access Denied: Admins Only');
      this.router.navigate(['/']);
      return;
    }

    this.loadCategories();
  }

  // loadCategories: Category services database GET api run parameters initiate karke categories array load trigger.
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.categories.set([...(response.$values || response)]);
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Failed to load categories');
      }
    });
  }

  // openAddModal: Naya record creation parameters initialization.
  openAddModal() {
    this.isEditing.set(false);
    this.currentCategory = {
      id: 0,
      name: ''
    };
    this.formError.set('');
    this.isModalOpen.set(true);
  }

  // openEditModal: Selected item editing screen dialog values dynamic bindings copy triggers.
  openEditModal(category: any) {
    this.isEditing.set(true);
    this.currentCategory = { ...category };
    this.formError.set('');
    this.isModalOpen.set(true);
  }

  // closeModal: dialog settings visibility reset triggers.
  closeModal() {
    this.isModalOpen.set(false);
    this.formError.set('');
  }

  // saveCategory: Admin save validation handler.
  // 1. Minimum name text validation limit check.
  // 2. Editing (PUT api/categories/{id}) aur Creating (POST api/categories) switch control dynamically updates lists.
  saveCategory() {
    if (!this.currentCategory.name || this.currentCategory.name.trim().length < 3) {
      this.formError.set('Category name must be at least 3 characters long.');
      return;
    }

    this.formError.set('');

    // EDIT mode active check
    if (this.isEditing()) {
      this.categoryService.updateCategory(this.currentCategory.id, this.currentCategory).subscribe({
        next: (response: any) => {
          const index = this.categories().findIndex(c => c.id === response.id);
          if (index !== -1) {
            const updatedList = [...this.categories()];
            updatedList[index] = response;
            this.categories.set(updatedList);
          }
          this.toastr.success('Category Updated Successfully');
          this.closeModal();
        },
        error: (error: any) => {
          console.error(error);
          this.formError.set('Update failed');
        }
      });
    } 
    // CREATE mode active check
    else {
      this.categoryService.createCategory(this.currentCategory).subscribe({
        next: (response: any) => {
          this.categories.update(all => [...all, response]);
          this.toastr.success('Category Created Successfully');
          this.closeModal();
        },
        error: (error: any) => {
          console.error(error);
          this.formError.set('Creation failed');
        }
      });
    }
  }

  // promptDelete: Delete dynamic alert message target definitions setting setup parameters.
  promptDelete(category: any) {
    this.categoryIdToDelete.set(category.id);
    this.categoryNameToDelete.set(category.name);
    this.isDeleteModalOpen.set(true);
  }

  // cancelDelete: Delete parameters warnings dismiss trigger.
  cancelDelete() {
    this.isDeleteModalOpen.set(false);
    this.categoryIdToDelete.set(null);
    this.categoryNameToDelete.set('');
  }

  // confirmDelete: Database element deletion execute path triggers.
  // DELETE http request hits CategoryService, updates client signals array locally on completion.
  confirmDelete() {
    const id = this.categoryIdToDelete();
    if (id === null) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.categories.update(all => all.filter(c => c.id !== id));
        this.toastr.success('Category Deleted Successfully');
        this.cancelDelete();
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Failed to delete category');
        this.cancelDelete();
      }
    });
  }
}
