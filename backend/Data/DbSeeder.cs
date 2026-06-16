using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyDotNetApi.Models;

namespace MyDotNetApi.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            // Automatically apply any pending migrations
            context.Database.Migrate();

            // Seed Users if none exist
            if (!context.Users.Any())
            {
                var adminUser = new User
                {
                    Username = "admin",
                    Email = "admin@shopsphere.com",
                    Password = BCrypt.Net.BCrypt.HashPassword("AdminPassword123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };

                var customerUser = new User
                {
                    Username = "customer",
                    Email = "customer@shopsphere.com",
                    Password = BCrypt.Net.BCrypt.HashPassword("CustomerPassword123"),
                    Role = "User",
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.AddRange(adminUser, customerUser);
                context.SaveChanges();
                Console.WriteLine("Database seeding completed: Admin and Customer users created.");
            }
            else
            {
                Console.WriteLine("Database already has users. Seeding skipped.");
            }

            // Seed Categories if none exist
            if (!context.Categories.Any())
            {
                var laptops = new Category { Name = "Laptops" };
                var smartphones = new Category { Name = "Smartphones" };
                var audio = new Category { Name = "Audio" };
                var accessories = new Category { Name = "Accessories" };

                context.Categories.AddRange(laptops, smartphones, audio, accessories);
                context.SaveChanges();
                Console.WriteLine("Database seeding completed: Categories created.");
            }
            else
            {
                Console.WriteLine("Database already has categories. Seeding skipped.");
            }

            // Seed Products if none exist
            if (!context.Products.Any())
            {
                var laptopsCategory = context.Categories.FirstOrDefault(c => c.Name == "Laptops");
                if (laptopsCategory != null)
                {
                    var product1 = new Product
                    {
                        Name = "Apple MacBook Pro 16\"",
                        Description = "Apple MacBook Pro with M3 Max chip, 16.2\" Liquid Retina XDR display, 64GB Unified Memory, and 1TB SSD. Built for developers and creative professionals seeking ultimate performance.",
                        Price = 3499.00m,
                        StockQuantity = 15,
                        ImageUrl = "http://localhost:5006/uploads/macbook_pro.png",
                        Specifications = "{\"Processor\": \"Apple M3 Max (16-core CPU, 40-core GPU)\", \"Memory\": \"64GB Unified Memory\", \"Storage\": \"1TB NVMe SSD\", \"Display\": \"16.2-inch Liquid Retina XDR (3456 x 2234), 120Hz\", \"OS\": \"macOS Sonoma\"}",
                        CategoryId = laptopsCategory.Id
                    };

                    var product2 = new Product
                    {
                        Name = "ASUS ROG Zephyrus G16",
                        Description = "ASUS ROG Zephyrus G16 gaming laptop with Intel Core Ultra 9, 16\" OLED 240Hz screen, 32GB RAM, 2TB SSD, and NVIDIA RTX 4090. Extreme power in an ultra-sleek, premium chassis.",
                        Price = 2999.00m,
                        StockQuantity = 10,
                        ImageUrl = "http://localhost:5006/uploads/rog_zephyrus.png",
                        Specifications = "{\"Processor\": \"Intel Core Ultra 9 185H\", \"Memory\": \"32GB LPDDR5X\", \"Storage\": \"2TB NVMe SSD\", \"Graphics\": \"NVIDIA GeForce RTX 4090 16GB VRAM\", \"Display\": \"16-inch ROG Nebula OLED QHD+ (2560 x 1600), 240Hz\", \"OS\": \"Windows 11 Home\"}",
                        CategoryId = laptopsCategory.Id
                    };

                    var product3 = new Product
                    {
                        Name = "Dell XPS 14",
                        Description = "Dell XPS 14 featuring Intel Core Ultra 7, 14.5\" OLED Touch display, 16GB RAM, 512GB SSD, and NVIDIA RTX 4050. The ultimate thin-and-light productivity powerhouse for creators.",
                        Price = 1999.00m,
                        StockQuantity = 20,
                        ImageUrl = "http://localhost:5006/uploads/dell_xps.png",
                        Specifications = "{\"Processor\": \"Intel Core Ultra 7 155H\", \"Memory\": \"16GB LPDDR5X\", \"Storage\": \"512GB PCIe Gen4 SSD\", \"Graphics\": \"NVIDIA GeForce RTX 4050 6GB VRAM\", \"Display\": \"14.5-inch OLED InfinityEdge Touch (3200 x 2000)\", \"OS\": \"Windows 11 Pro\"}",
                        CategoryId = laptopsCategory.Id
                    };

                    var product4 = new Product
                    {
                        Name = "Lenovo ThinkPad X1 Carbon Gen 12",
                        Description = "Lenovo ThinkPad X1 Carbon Gen 12 enterprise laptop. Intel Core Ultra 7, 14\" WUXGA IPS anti-glare screen, 32GB RAM, 1TB SSD, and Intel Arc graphics. Uncompromised durability and security.",
                        Price = 1849.00m,
                        StockQuantity = 25,
                        ImageUrl = "http://localhost:5006/uploads/thinkpad_x1.png",
                        Specifications = "{\"Processor\": \"Intel Core Ultra 7 165U vPro\", \"Memory\": \"32GB LPDDR5X\", \"Storage\": \"1TB NVMe PCIe Gen4 SSD\", \"Graphics\": \"Intel Arc Graphics\", \"Display\": \"14-inch WUXGA (1920 x 1200) IPS, Anti-Glare\", \"OS\": \"Windows 11 Pro\"}",
                        CategoryId = laptopsCategory.Id
                    };

                    context.Products.AddRange(product1, product2, product3, product4);
                    context.SaveChanges();
                    Console.WriteLine("Database seeding completed: Products created.");
                }
            }
            else
            {
                Console.WriteLine("Database already has products. Seeding skipped.");
            }
        }
    }
}
