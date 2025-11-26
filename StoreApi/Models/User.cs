using System.Text.Json.Serialization;

namespace StoreApi.Models
{
    public class User
    {
        //[JsonIgnore]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        [JsonIgnore]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public Cart? Cart { get; set; }
    }
}