namespace ShopSphere.DTOs.Category
{
    // UpdateCategoryDto: Ye DTO tab hit hota hai jab admin dashboard me kisi category ka naam edit kiya jata hai.
    // Jab frontend `PUT /api/categories/{id}` endpoint par request bhejta hai, to server side binding ke liye ye model use hota hai.
    public class UpdateCategoryDto
    {
        // Id: Kis category ko modify karna hai, uski system identifier id jo validation ke liye body parameter se check ki jayegi.
        public int Id { get; set; }

        // Name: Category ka naya naam jo db me update karna hai.
        public string Name { get; set; }
    }
}
