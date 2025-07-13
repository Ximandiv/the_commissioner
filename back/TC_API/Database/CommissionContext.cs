using Microsoft.EntityFrameworkCore;
using TC_API.Models;

namespace TC_API.Database;

public class CommissionContext : DbContext
{
    public DbSet<Commission> Commissions { get; set; } = null!;

    public CommissionContext(DbContextOptions<CommissionContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Commission>()
            .Property(c => c.Id)
            .ValueGeneratedOnAdd();
        modelBuilder.Entity<Commission>()
            .Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);
        modelBuilder.Entity<Commission>()
            .Property(c => c.State)
            .HasConversion<string>();
    }
}
