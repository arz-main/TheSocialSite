using Microsoft.EntityFrameworkCore;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Entities.Comment;

namespace TheSocialSite.DataAccess.Context
{
    public class AppDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlServer(DbSession.ConnectionString);

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User → SocialMedia (one-to-one)
            modelBuilder.Entity<UserData>()
                .HasOne(u => u.SocialLinks)
                .WithOne(sl => sl.User)
                .HasForeignKey<SocialMedia>(sl => sl.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Post → Author (User)
            modelBuilder.Entity<PostData>()
                .HasOne(p => p.Author)
                .WithMany() // User can have many posts
                .HasForeignKey(p => p.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Comment → Author (User)
            modelBuilder.Entity<CommentData>()
                .HasOne(c => c.Author)
                .WithMany() // User can have many comments
                .HasForeignKey(c => c.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Comment → Post
            modelBuilder.Entity<CommentData>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        // Single DbContext for everything
        public DbSet<UserData> Users { get; set; }
        public DbSet<SocialMedia> SocialMedia { get; set; }
        public DbSet<PostData> Posts { get; set; }
        public DbSet<CommentData> Comments { get; set; }
    }
}