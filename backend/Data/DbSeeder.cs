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
        }
    }
}
