namespace ShopSphere.DTOs.Category
{
    // CreateCategoryDto: Ye DTO tab hit hota hai jab admin console se new category banayi jati hai.
    // Jab frontend se `POST /api/categories` par payload bheja jata hai, to controller is DTO ko use karta hai validation ke liye.
    // Hum identity column 'Id' ko isme skip karte hain kyunki database use dynamically auto-generate karta hai.
    public class CreateCategoryDto
    {
        // Name: Nayi category ka naam jo save karna hai. model validation and mapping ke liye iska use hota hai.
        public string Name { get; set; }
    }
}
