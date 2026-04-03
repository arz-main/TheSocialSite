using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TheSocialSite.Domain.Entities.Comment;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Domain.Entities.Post
{
    public enum PostStatus
    {
        Published, // visible to everyone
        Draft,     // only visible to the author and admins, not shown in public feeds or search results
        Flagged    // marked by users for review, hidden from public until reviewed by admins
    }

    public class PostData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [Required]
        public string AuthorId { get; set; }             // foreign key to user

        [ForeignKey("AuthorId")]
        public UserData Author { get; set; }             // navigation property

        public PostStatus Status { get; set; } = PostStatus.Draft;
        public int Likes { get; set; } = 0;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        [MaxLength(500)]
        public string ImageUrl { get; set; }

        [Required]
        [MaxLength(50)]
        // later add categories in the db as entities
        public string Category { get; set; }

        // optional from user
        [MaxLength(1000)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // this does not make a separate table, but allows access to comments for a post
        public List<CommentData> Comments { get; set; } = [];   // reverse navigation
    }
}