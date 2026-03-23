using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using TheSocialSite.DataAccess.Context;

namespace TheSocialSite.DataAccess
{
    public class UserContextFactory : IDesignTimeDbContextFactory<UserContext>
    {
        public UserContext CreateDbContext(string[] args)
        {
            var options = new DbContextOptionsBuilder<UserContext>()
                .UseSqlServer("Server=localhost;Database=TheSocialSiteDb;Trusted_Connection=True;TrustServerCertificate=True;")
                .Options;

            return new UserContext(options);
        }
    }
}