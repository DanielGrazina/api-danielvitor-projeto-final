using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace StoreApi.Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal Total { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public ICollection<OrderItem> Items { get; set; }
    }
}