using System.Text.Json.Serialization;

namespace StoreApi.Models
{
    public class Cart
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

        public List<CartItem> Items { get; set; } = new();
    }
}