using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopSphere.DTOs.Product;
using MyDotNetApi.Data;
using MyDotNetApi.Models;

namespace MyDotNetApi.Controllers
{
    // [ApiController]: Isse controller ko REST API capabilities (jaise automatic 400 Bad Request if validation fails) milti hain.
    // [Route("api/[controller]"): Route path define karta hai. Base url: http://localhost:5006/api/products
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        // Constructor Injection: Database context (_context) aur Web Host Environment (_env) dono ko inject kiya hai.
        // IWebHostEnvironment hamari help karta hai "wwwroot" folder ka physical disk path (WebRootPath) dynamic nikalne me,
        // jisse file upload ke time folders sahi jagah (misalignment ke bina) save hote hain.
        public ProductsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // POST: api/products
        // Naya Product create karne ke liye jab admin "Create Product" click karta hai.
        // Yahan "CreateProductDto" request payload ke roop me liya jata hai.
        [HttpPost]
        public async Task<IActionResult> CreateProduct(CreateProductDto dto)
        {
            // Security check aur dynamic fallback seeding:
            // Agar user ne koi Category ID input kiya hai aur wo Categories table me nahi hai,
            // to foreign key exception se bachne ke liye hum us Category ID ko database me dynamically create (seed) kar dete hain.
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
            {
                category = new Category
                {
                    Id = dto.CategoryId,
                    Name = "Category " + dto.CategoryId
                };
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
            }

            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                Description = dto.Description,
                StockQuantity = dto.StockQuantity,
                ImageUrl = dto.ImageUrl,
                Specifications = dto.Specifications,
                CategoryId = dto.CategoryId
            };

            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                // Agar manual explicit ID seed hone ki wajah se primary key index clash ho gaya,
                // to instance detach karenge aur PostgreSQL sequence generator update karenge.
                _context.Entry(product).State = EntityState.Detached;

                // Products table ki dynamic autoincrement ID sync SQL command:
                await _context.Database.ExecuteSqlRawAsync(
                    "SELECT setval(pg_get_serial_sequence('\"Products\"', 'Id'), COALESCE(MAX(\"Id\"), 1)) FROM \"Products\";"
                );

                _context.Products.Add(product);
                await _context.SaveChangesAsync();
            }

            return Ok(product);
        }

        // GET: api/products
        // Saral tarike se catalog ke saare products load karne ke liye.
        // Angular Catalog/Products Component is hit karta hai dashboard load hone par.
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var response = await _context.Products
                .Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Description = p.Description,
                    StockQuantity = p.StockQuantity,
                    ImageUrl = p.ImageUrl,
                    Specifications = p.Specifications,
                    CategoryId = p.CategoryId
                })
                .ToListAsync();

            return Ok(response);
        }

        // GET: api/products/{id}
        // Kisi single product ki dynamic detail dynamic routing path se load karne ke liye (jaise detail page load hone par).
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(new ProductResponseDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl,
                Specifications = product.Specifications,
                CategoryId = product.CategoryId
            });
        }

        // POST: api/products/upload
        // Multi-part Form Data ke roop me local computer se image upload karne ka endpoint.
        // [FromForm]: Model binder ko explicitly batata hai ki binary image data multi-part form payload se bind karna hai.
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Security check 1: File size restriction to 5MB (DoS protection)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest("File size exceeds 5MB limit.");
            }

            // Security check 2: Strict extension validation (Allow-list ONLY)
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
            {
                return BadRequest("Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF are allowed.");
            }

            // Security check 3: Cryptographically secure unique filename structure (mitigates RCE & directory traversal)
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            
            // Web Host Environment ki madad se server par wwwroot folder ka physical dynamic path read karte hain.
            var webRoot = _env.WebRootPath;
            if (string.IsNullOrEmpty(webRoot))
            {
                // Agar WebRoot path configuration missing hai, to Directory level fallback use karenge.
                webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }

            var uploadsFolder = Path.Combine(webRoot, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                // Agar uploads folder nahi bana, to dynamically directories tree generate ho jayegi.
                Directory.CreateDirectory(uploadsFolder);
            }

            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Server disk par files write karne ke liye FileStream use karte hain async block me.
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Client-side Angular application ko secure relative image URL return karte hain.
            var fileUrl = $"http://localhost:5006/uploads/{uniqueFileName}";
            return Ok(new { imageUrl = fileUrl });
        }

        // PUT: api/products/{id}
        // Admin dwara kisi Product ki details (specifications, price, description) modify karne ka controller method.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            // Ensure Category exists dynamically to prevent FK crash
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
            {
                category = new Category
                {
                    Id = dto.CategoryId,
                    Name = "Category " + dto.CategoryId
                };
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
            }

            product.Name = dto.Name;
            product.Price = dto.Price;
            product.Description = dto.Description;
            product.StockQuantity = dto.StockQuantity;
            product.ImageUrl = dto.ImageUrl;
            product.Specifications = dto.Specifications;
            product.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();

            return Ok(product);
        }

        // DELETE: api/products/{id}
        // Product Catalog inventory console se kisi product ko permanently drop/remove karne ke liye.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Product deleted successfully"
            });
        }
    }
}