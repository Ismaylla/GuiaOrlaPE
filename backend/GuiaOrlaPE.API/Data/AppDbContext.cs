using GuiaOrlaPE.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;
//using GuiaOrlaPE.API.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();

    public DbSet<Business> Businesses => Set<Business>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasMany(x => x.Businesses)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId);
    }
}