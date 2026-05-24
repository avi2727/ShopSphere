using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopSphere.DTOs.Product;
using MyDotNetApi.Data;
using MyDotNetApi.Models;

namespace MyDotNetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(CreateProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price
            };

            _context.Products.Add(product);

            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var response = await _context.Products
                .Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price
                })
                .ToListAsync();

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            product.Name = dto.Name;
            product.Price = dto.Price;

            await _context.SaveChangesAsync();

            return Ok(product);
        }

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