using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MyDotNetApi.Models
{
    // Category Class: Ye humare database me "Categories" table ko map karti hai (Entity Framework Core Model).
    // Iska use products ko groups me categorise karne ke liye kiya jata hai (jaise: Laptops, Accessories, Electronics).
    public class Category
    {
        // Id: Ye primary key hai jo database me unique serial number (auto-increment) generate karti hai.
        // Jab hum naya product save ya load karte hain, to isi Id se mapping hoti hai.
        public int Id { get; set; }

        // Name: Category ka naam (jaise 'Laptops'). Ye user/admin ko dropdown ya filter consoles me dikhane ke liye use hota hai.
        public string Name { get; set; }

        // [JsonIgnore]: Ye decorator bahut zaroori hai!
        // Jab EF Core 'Category' aur 'Product' ke dynamic links ko fetch karta hai, 
        // to serialisation ke waqt infinite cyclic reference loop (Category -> Product -> Category -> ...) ban sakta hai.
        // Ye decorator serialization process ko batata hai ki API response return karte waqt Products relationship data serialize NA kare,
        // jisse serialization loop crash permanently prevent hota hai aur fast payload delivery hoti hai.
        [JsonIgnore]
        public List<Product>? Products { get; set; } = new();
    }
}