// UserContext.cs
using Microsoft.EntityFrameworkCore;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.DataAccess.Context
{
    public class UserContext : DbContext
    {
        public UserContext() { }

        public UserContext(DbContextOptions<UserContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Only use the static connection string if no options were passed in
            // (when called from business logic at runtime, not from migrations)
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(DbSession.ConnectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserData>().OwnsOne(u => u.SocialLinks);
        }

        public DbSet<UserData> Users { get; set; }
    }
}