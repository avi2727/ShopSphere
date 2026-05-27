using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyDotNetApi.Data;
using MyDotNetApi.Models;
using ShopSphere.DTOs.Category;

namespace MyDotNetApi.Controllers
{
    // [ApiController]: Ye decorator ASP.NET Core ko batata hai ki ye class ek Web API controller hai.
    // [Route("api/[controller]"): Isse API ka endpoint path define hota hai. 
    // Yahan [controller] ki jagah "Categories" aayega, yani is controller ka base path hoga: http://localhost:5006/api/categories
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Constructor: Dependency Injection ke zariye database context (_context) ko initialize kiya jata hai.
        // Jab bhi koi request is controller par aayegi, ASP.NET Core automatically DB connection context pass kar dega.
        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/categories
        // Jab frontend par categories load karni hon, tab Angular ka CategoryService is method ko hit karta hai (GET request).
        // Hum "CategoryResponseDto" use kar rahe hain taaki cyclic reference errors na aayein aur network par light-weight data transfer ho.
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToListAsync();
            return Ok(categories);
        }

        // GET: api/categories/{id}
        // Kisi single category ki details fetch karne ke liye (jaise api/categories/5).
        // Path parameter {id} automatically method ke 'int id' argument me bind ho jata hai.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                // Agar ID database me nahi mili, to 404 Not Found return hoga.
                return NotFound();
            }
            return Ok(new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name
            });
        }

        // POST: api/categories
        // Nayi Category create karne ke liye jab admin dashboard me save button dabata hai.
        // Frontend se "CreateCategoryDto" (sirf Category Name) aata hai.
        // Yahan try-catch block lagaya hai taaki database me auto-increment sequence agar purane manual entries ke kaaran mismatch (out of sync) ho jaye, 
        // to exception catch karke PostgreSQL sequence ko sync karke re-attempt kiya ja sake.
        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name
            };

            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                // Agar sequence mismatch ki wajah se duplicate key error aaya, to EF Core tracker se is entry ko detach (alag) karenge.
                _context.Entry(category).State = EntityState.Detached;

                // Raw SQL Query execute karke PostgreSQL sequence generator ko sync karte hain max ID ke sath.
                // pg_get_serial_sequence('Categories', 'Id') system sequence object ka naam nikalta hai.
                // setval() use sequence ki value ko MAX(Id) par set kar deta hai taaki naya auto-generated ID clash na kare.
                await _context.Database.ExecuteSqlRawAsync(
                    "SELECT setval(pg_get_serial_sequence('\"Categories\"', 'Id'), COALESCE(MAX(\"Id\"), 1)) FROM \"Categories\";"
                );

                // Dobara database me object insert kar ke successfully save karte hain.
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
            }

            // Client ko fresh saved category data transfer object format me return karte hain.
            return Ok(new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name
            });
        }

        // PUT: api/categories/{id}
        // Kisi existing Category ka naam edit/update karne ke liye.
        // Frontend dashboard par edit icon daba kar save karne par ye hit hota hai.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            category.Name = dto.Name;
            await _context.SaveChangesAsync();
            
            return Ok(new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name
            });
        }

        // DELETE: api/categories/{id}
        // Kisi Category ko database se permanently delete karne ke liye.
        // Admin ke delete icon daba kar "Confirm Delete" select karne par Angular se DELETE call yahan hit hoti hai.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Category deleted successfully" });
        }
    }
}
