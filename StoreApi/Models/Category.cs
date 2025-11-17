using System.Text.Json.Serialization;

namespace StoreApi.Models
{
    public class Category
    {
        [JsonIgnore]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
