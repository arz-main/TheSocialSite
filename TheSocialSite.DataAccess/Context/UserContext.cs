using Microsoft.EntityFrameworkCore;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.DataAccess.Context
{
    public class UserContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(
                "Server=localhost;Database=TheSocialSiteDb;Trusted_Connection=True;TrustServerCertificate=True;"
            );
        }
        public DbSet<UserData> Users { get; set; }
    }
}