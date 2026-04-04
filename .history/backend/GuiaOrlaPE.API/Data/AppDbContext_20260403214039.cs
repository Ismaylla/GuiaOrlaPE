using Microsoft.EntityFrameworkCore;
using GuiaOrlaPE.API.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ServiceProvider> ServiceProviders { get; set; }
}