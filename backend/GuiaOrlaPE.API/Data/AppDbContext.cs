using GuiaOrlaPE.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;
//using GuiaOrlaPE.API.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();

    public DbSet<Business> Businesses => Set<Business>();

    public DbSet<BusinessPhoto> BusinessPhotos => Set<BusinessPhoto>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasMany(x => x.Businesses)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Mapeamento explícito para evitar erro de Case-Sensitive do Postgres
        modelBuilder.Entity<Business>(entity =>
    {
        entity.ToTable("businesses"); // Garante que a tabela é minúscula

        // Mapeamento forçado para minúsculas sem aspas duplas, 
        // assim o Postgres não vai exigir case-sensitivity
        entity.Property(b => b.Dinheiro).HasColumnName("dinheiro");
        entity.Property(b => b.Cartao).HasColumnName("cartao");
        entity.Property(b => b.Pix).HasColumnName("pix");
        entity.Property(b => b.Chuveiro).HasColumnName("chuveiro");
        entity.Property(b => b.Estacionamento).HasColumnName("estacionamento");
        entity.Property(b => b.Cadeira).HasColumnName("cadeira");
        entity.Property(b => b.PetFriendly).HasColumnName("petfriendly");
        entity.Property(b => b.Acessibilidade).HasColumnName("acessibilidade");
        entity.Property(b => b.Wifi).HasColumnName("wifi");
    });

    }
}