using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using StoreApi.Data;

namespace StoreApi.Data
{
    public class StoreDbContextFactory : IDesignTimeDbContextFactory<StoreDbContext>
    {
        public StoreDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<StoreDbContext>();

            // Usa a connection string usada no docker-compose
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=projeto;Username=admin;Password=admin");

            return new StoreDbContext(optionsBuilder.Options);
        }
    }
}