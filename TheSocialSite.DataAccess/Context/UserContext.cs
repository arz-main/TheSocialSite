// UserContext.cs
using Microsoft.EntityFrameworkCore;
using TheSocialSite.Domain.Entities.User;
namespace TheSocialSite.DataAccess.Context
{
    public class UserContext : DbContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserData>()
                .Property(u => u.Role)
                .HasConversion<string>();

            // One-to-one relationship between UserData and UserSocialLinks
            modelBuilder.Entity<UserData>()
                .HasOne(u => u.SocialLinks)
                .WithOne(sl => sl.User)
                .HasForeignKey<SocialMedia>(sl => sl.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }
        public DbSet<UserData> Users { get; set; }
        public DbSet<SocialMedia> SocialMedia { get; set; }

    }
}