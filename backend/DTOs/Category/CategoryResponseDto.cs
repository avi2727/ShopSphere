namespace ShopSphere.DTOs.Category
{
    // CategoryResponseDto: Ye DTO (Data Transfer Object) hum tab use karte hain jab database se category data 
    // fetch karke frontend (Angular client) ko response ke roop me wapas bhejna ho.
    // DTO use karne se database ki internal entities secure rehti hain aur wahi fields transmit hoti hain jo zaroori hain.
    public class CategoryResponseDto
    {
        // Id: Client ko category ki identity dene ke liye use hoti hai taaki updates/deletes ke liye unique identification ho sake.
        public int Id { get; set; }
        
        // Name: Dashboard aur lists me Category ka actual human-readable naam represent karne ke liye use hota hai.
        public string Name { get; set; }
    }
}
