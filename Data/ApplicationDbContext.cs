using Microsoft.EntityFrameworkCore;
using NutriMind.API.Models;

namespace NutriMind.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<UserSettings> UserSettings { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Workout> Workouts { get; set; }
    public DbSet<NutritionLog> NutritionLogs { get; set; }
    public DbSet<SleepRecord> SleepRecords { get; set; }
    public DbSet<HydrationLog> HydrationLogs { get; set; }
    public DbSet<VitalRecord> VitalRecords { get; set; }
    public DbSet<Goal> Goals { get; set; }
    public DbSet<LoginLog> LoginLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Email).IsRequired();
        });

        // UserSettings - One to One with User
        modelBuilder.Entity<UserSettings>(entity =>
        {
            entity.HasIndex(us => us.UserId).IsUnique();
            entity.HasOne(us => us.User)
                  .WithOne(u => u.Settings)
                  .HasForeignKey<UserSettings>(us => us.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // UserProfile - One to One with User
        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasIndex(up => up.UserId).IsUnique();
            entity.HasOne(up => up.User)
                  .WithOne(u => u.Profile)
                  .HasForeignKey<UserProfile>(up => up.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Workout - Many to One with User
        modelBuilder.Entity<Workout>(entity =>
        {
            entity.HasOne(w => w.User)
                  .WithMany(u => u.Workouts)
                  .HasForeignKey(w => w.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // NutritionLog - Many to One with User
        modelBuilder.Entity<NutritionLog>(entity =>
        {
            entity.HasOne(n => n.User)
                  .WithMany(u => u.NutritionLogs)
                  .HasForeignKey(n => n.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // SleepRecord - Many to One with User
        modelBuilder.Entity<SleepRecord>(entity =>
        {
            entity.HasOne(s => s.User)
                  .WithMany(u => u.SleepRecords)
                  .HasForeignKey(s => s.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // HydrationLog - Many to One with User
        modelBuilder.Entity<HydrationLog>(entity =>
        {
            entity.HasOne(h => h.User)
                  .WithMany(u => u.HydrationLogs)
                  .HasForeignKey(h => h.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // VitalRecord - Many to One with User
        modelBuilder.Entity<VitalRecord>(entity =>
        {
            entity.HasOne(v => v.User)
                  .WithMany(u => u.VitalRecords)
                  .HasForeignKey(v => v.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Goal - Many to One with User
        modelBuilder.Entity<Goal>(entity =>
        {
            entity.HasOne(g => g.User)
                  .WithMany(u => u.Goals)
                  .HasForeignKey(g => g.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // LoginLog - No navigation property needed (stores user_id as nullable for logging)
    }
}
