using Microsoft.EntityFrameworkCore;
using TheSocialSite.Domain.Entities.Badge;
using TheSocialSite.Domain.Entities.Comment;
using TheSocialSite.Domain.Entities.Course;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Entities.SocialMedia;
using TheSocialSite.Domain.Entities.Friendship;
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

            // Course → Author (User)
            modelBuilder.Entity<CourseData>()
                .HasOne(c => c.Author)
                .WithMany()
                .HasForeignKey(c => c.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Course → Chapters
            modelBuilder.Entity<ChapterData>()
                .HasOne(ch => ch.Course)
                .WithMany(c => c.Chapters)
                .HasForeignKey(ch => ch.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Chapter → Lessons
            modelBuilder.Entity<LessonData>()
                .HasOne(l => l.Chapter)
                .WithMany(ch => ch.Lessons)
                .HasForeignKey(l => l.ChapterId)
                .OnDelete(DeleteBehavior.Cascade);

            // Lesson → Blocks
            modelBuilder.Entity<BlockData>()
                .HasOne(b => b.Lesson)
                .WithMany(l => l.Blocks)
                .HasForeignKey(b => b.LessonId)
                .OnDelete(DeleteBehavior.Cascade);

            // Friendship → Sender (User)
            modelBuilder.Entity<FriendshipData>()
                .HasOne(f => f.Sender)
                .WithMany()
                .HasForeignKey(f => f.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Friendship → Receiver (User)
            modelBuilder.Entity<FriendshipData>()
                .HasOne(f => f.Receiver)
                .WithMany()
                .HasForeignKey(f => f.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        // Single DbContext for everything
        public DbSet<UserData> Users { get; set; }
        public DbSet<SocialMediaData> SocialMedia { get; set; }
        public DbSet<PostData> Posts { get; set; }
        public DbSet<PostLikeData> PostLikes { get; set; }
        public DbSet<CommentData> Comments { get; set; }
        public DbSet<BadgeTemplateData> BadgeTemplates { get; set; }
        public DbSet<AwardedBadgeData> AwardedBadges { get; set; }
        public DbSet<CourseData> Courses { get; set; }
        public DbSet<ChapterData> Chapters { get; set; }
        public DbSet<LessonData> Lessons { get; set; }
        public DbSet<BlockData> Blocks { get; set; }
        public DbSet<FriendshipData> Friendships {get; set;}
    }
}