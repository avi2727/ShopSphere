import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product = signal<any>(null);
  loading = signal<boolean>(true);
  isAdmin = signal<boolean>(false);
  cartService = inject(CartService);
  router = inject(Router);

  // High-fidelity details database for premium mock laptop listings
  private readonly laptopDatabase = [
    {
      id: 1,
      name: 'MacBook Pro 16" (M3 Max, 64GB)',
      price: '3,499.00',
      image: 'assets/images/macbook_pro.png',
      specs: 'M3 Max • 16" Liquid Retina XDR • 64GB Unified Memory • 1TB SSD',
      description: 'The ultimate professional powerhouse. Designed for developers, film editors, and 3D artists who require maximum computing throughput with unparalleled battery efficiency.',
      brand: 'Apple',
      rating: 4.9,
      reviewsCount: 142,
      inStock: true,
      features: [
        { label: 'Processor', value: 'Apple M3 Max (16-core CPU, 40-core GPU)' },
        { label: 'Memory', value: '64GB Unified LPDDR5 Memory' },
        { label: 'Storage', value: '1TB Ultra-Fast NVMe SSD' },
        { label: 'Display', value: '16.2" Liquid Retina XDR (3456 x 2234, 120Hz ProMotion)' },
        { label: 'Battery Life', value: 'Up to 22 hours wireless web' },
        { label: 'Operating System', value: 'macOS Sequoia' },
        { label: 'Weight', value: '4.8 lbs (2.16 kg)' },
        { label: 'Ports', value: '3x Thunderbolt 4 (USB-C), HDMI, SDXC, MagSafe 3, Jack' }
      ]
    },
    {
      id: 2,
      name: 'ROG Zephyrus G16 (RTX 4090, OLED)',
      price: '2,999.00',
      image: 'assets/images/rog_zephyrus.png',
      specs: 'Intel Core Ultra 9 • 16" QHD+ OLED 240Hz • 32GB LPDDR5X • 2TB SSD',
      description: 'A revolutionary fusion of high-end gaming performance and premium ultra-thin styling. Features a breathtaking 240Hz OLED display powered by a full-power NVIDIA RTX 4090.',
      brand: 'ASUS ROG',
      rating: 4.8,
      reviewsCount: 98,
      inStock: true,
      features: [
        { label: 'Processor', value: 'Intel Core Ultra 9 185H (16 Cores, up to 5.1GHz)' },
        { label: 'Memory', value: '32GB LPDDR5X-7467 Dual Channel' },
        { label: 'Storage', value: '2TB PCIe 4.0 NVMe M.2 SSD' },
        { label: 'Display', value: '16" QHD+ (2560 x 1600) OLED 240Hz, 0.2ms, G-Sync' },
        { label: 'Graphics Card', value: 'NVIDIA GeForce RTX 4090 Laptop GPU (16GB GDDR6)' },
        { label: 'Operating System', value: 'Windows 11 Home' },
        { label: 'Weight', value: '4.08 lbs (1.85 kg)' },
        { label: 'Ports', value: '1x Thunderbolt 4, 1x USB 3.2 Gen 2 Type-C, 2x USB Type-A, HDMI 2.1, SD' }
      ]
    },
    {
      id: 3,
      name: 'Dell XPS 14 (Core Ultra 7, RTX 4050)',
      price: '1,999.00',
      image: 'assets/images/dell_xps.png',
      specs: 'Core Ultra 7 • 14.5" 3.2K OLED Touch • 16GB LPDDR5X • 512GB SSD',
      description: 'Masterfully crafted from CNC aluminum and glass, the Dell XPS 14 represents the pinnacle of executive portable computing, featuring the iconic seamless glass haptic touchpad.',
      brand: 'Dell',
      rating: 4.6,
      reviewsCount: 64,
      inStock: true,
      features: [
        { label: 'Processor', value: 'Intel Core Ultra 7 155H (16 Cores, up to 4.8GHz)' },
        { label: 'Memory', value: '16GB LPDDR5X Dual Channel 6400MHz' },
        { label: 'Storage', value: '512GB PCIe 4.0 NVMe SSD' },
        { label: 'Display', value: '14.5" 3.2K (3200 x 2000) InfinityEdge OLED Touch 120Hz' },
        { label: 'Graphics Card', value: 'NVIDIA GeForce RTX 4050 Laptop GPU (6GB GDDR6)' },
        { label: 'Operating System', value: 'Windows 11 Pro' },
        { label: 'Weight', value: '3.7 lbs (1.68 kg)' },
        { label: 'Ports', value: '3x Thunderbolt 4 (USB-C) with Power Delivery, MicroSD Reader, Jack' }
      ]
    },
    {
      id: 4,
      name: 'ThinkPad X1 Carbon Gen 12',
      price: '1,799.00',
      image: 'assets/images/thinkpad_x1.png',
      specs: 'Intel Core Ultra 7 • 14" WUXGA IPS • 32GB LPDDR5X • 1TB SSD',
      description: 'The legendary premium business companion. Extremely durable carbon-fiber build, unmatched ergonomic keyboard, and highly comprehensive hardware-level corporate security features.',
      brand: 'Lenovo',
      rating: 4.7,
      reviewsCount: 112,
      inStock: true,
      features: [
        { label: 'Processor', value: 'Intel Core Ultra 7 165U vPro (12 Cores, up to 4.9GHz)' },
        { label: 'Memory', value: '32GB LPDDR5X 6400MHz Soldered' },
        { label: 'Storage', value: '1TB PCIe 4.0 Performance NVMe SSD' },
        { label: 'Display', value: '14" WUXGA (1920 x 1200) Anti-Glare IPS, 400 nits, 100% sRGB' },
        { label: 'Graphics Card', value: 'Intel Arc Graphics' },
        { label: 'Operating System', value: 'Windows 11 Pro' },
        { label: 'Weight', value: '2.42 lbs (1.09 kg)' },
        { label: 'Ports', value: '2x Thunderbolt 4, 2x USB 3.2 Gen 1 Type-A, HDMI 2.1, Jack' }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Role parameter reading
    const email = localStorage.getItem('userEmail') || '';
    let role = localStorage.getItem('userRole') || '';
    
    if (!role && email) {
      role = email.toLowerCase().includes('admin') ? 'Admin' : 'User';
      localStorage.setItem('userRole', role);
    }
    
    this.isAdmin.set(role.toLowerCase() === 'admin');

    // Route parameter reading
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const productId = idParam ? parseInt(idParam, 10) : 0;
      
      // Look up inside local laptop catalog
      const matched = this.laptopDatabase.find(p => p.id === productId);
      
      if (matched) {
        this.product.set(matched);
      } else {
        // Fallback default mockup values if custom ID
        this.product.set({
          id: productId,
          name: 'Premium Workstation Laptop',
          price: '1,999.00',
          image: 'assets/images/macbook_pro.png',
          specs: 'Core Ultra 7 • 16" IPS • 16GB RAM • 512GB SSD',
          description: 'A premium, high-tier configuration designed to maximize your development workflow and everyday productivity. Features dual-channel memory, expansive storage, and durable construction.',
          brand: 'ShopSphere Core',
          rating: 4.5,
          reviewsCount: 15,
          inStock: true,
          features: [
            { label: 'Processor', value: 'High-Performance Multicore CPU' },
            { label: 'Memory', value: '16GB High-Speed System RAM' },
            { label: 'Storage', value: '512GB Solid State Drive (SSD)' },
            { label: 'Display', value: '15.6" Full HD Anti-Glare Widescreen' },
            { label: 'Warranty', value: '1-Year Premium Store Protection' }
          ]
        });
      }
      this.loading.set(false);
    });
  }

  addToCart() {
    this.router.navigate(['/cart']);
  }
}
