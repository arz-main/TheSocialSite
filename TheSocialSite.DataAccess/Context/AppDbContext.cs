using Microsoft.EntityFrameworkCore;
using TheSocialSite.Domain.Entities.Badge;
using TheSocialSite.Domain.Entities.Comment;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Entities.SocialMedia;
using TheSocialSite.Domain.Entities.User;

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
                .HasOne(u => u.SocialMedia)
                .WithOne(sl => sl.User)
                .HasForeignKey<SocialMediaData>(sl => sl.UserId)
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
                .OnDelete(DeleteBehavior.Cascade);

            // Comment → Post
            modelBuilder.Entity<CommentData>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // BadgeTemplate → UserBadge
            modelBuilder.Entity<BadgeTemplateData>()
                .HasMany(b => b.AwardedBadges)
                .WithOne(u => u.BadgeTemplate) // only one template per user badges
                .HasForeignKey(b => b.BadgeTemplateId)
                .OnDelete(DeleteBehavior.Cascade);

            // Composite unique constraint — prevents duplicate likes
            modelBuilder.Entity<PostLikeData>()
                .HasIndex(pl => new { pl.UserId, pl.PostId })
                .IsUnique();
        }

        // Single DbContext for everything
        public DbSet<UserData> Users { get; set; }
        public DbSet<SocialMediaData> SocialMedia { get; set; }
        public DbSet<PostData> Posts { get; set; }
        public DbSet<PostLikeData> PostLikes { get; set; }
        public DbSet<CommentData> Comments { get; set; }
        public DbSet<BadgeTemplateData> BadgeTemplates { get; set; }
        public DbSet<AwardedBadgeData> AwardedBadges { get; set; }
    }
}