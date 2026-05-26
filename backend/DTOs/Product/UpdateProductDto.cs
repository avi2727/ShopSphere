namespace ShopSphere.DTOs.Product
{
    public class UpdateProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public int StockQuantity { get; set; }
        public string ImageUrl { get; set; }
        public string Specifications { get; set; }
        public int CategoryId { get; set; }
    }
}