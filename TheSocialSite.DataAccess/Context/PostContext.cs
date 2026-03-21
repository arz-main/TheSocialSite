using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Entities.User;
namespace TheSocialSite.DataAccess.Context
{
    public class PostContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }
        public DbSet<PostData> Posts { get; set; }
    }
}