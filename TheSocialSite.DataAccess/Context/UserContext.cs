using Microsoft.EntityFrameworkCore;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.DataAccess.Context
{
    public class UserContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }
        public DbSet<UserData> Users { get; set; }
    }
}