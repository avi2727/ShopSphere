using Microsoft.AspNetCore.Mvc;
using MyDotNetApi.Models;
using Microsoft.AspNetCore.Authorization;
using MyDotNetApi.Data;
using ShopSphere.DTOs.Order;
using System.Security.Claims;

namespace MyDotNetApi.Controllers
{
    // Protected endpoint for authenticated customers.
    // Async is used because order creation involves database operations
    // such as saving Order and OrderItem records using EF Core.

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            Console.WriteLine("CreateOrder API Hit");
            try
            {
                var totalAmount = dto.Items.Sum(x => x.Price * x.Quantity);

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized("User is not authenticated.");
                }
                var userId = int.Parse(userIdClaim);

                var order = new Order
                {
                    UserId = userId,
                    TotalAmount = totalAmount,
                    Status = "Pending",
                    OrderDate = DateTime.UtcNow
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                foreach (var item in dto.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);

                    if (product == null)
                    {
                        return BadRequest("Product not found");
                    }

                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest($"Insufficient stock for {product.Name}");
                    }

                    Console.WriteLine($"Before: {product.StockQuantity}");

                    product.StockQuantity -= item.Quantity;

                    Console.WriteLine($"After: {product.StockQuantity}");

                    _context.OrderItems.Add(new OrderItem
                    {
                        OrderId = order.Id, // not 1
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        Price = item.Price
                    });
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    OrderId = order.Id,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}