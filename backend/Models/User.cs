namespace MyDotNetApi.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string Role { get; set; } = "User";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<CartItem> CartItems { get; set; }

        public List<Order> Orders { get; set; }
    }
}