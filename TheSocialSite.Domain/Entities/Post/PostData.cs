using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheSocialSite.Domain.Entities.Post
{
    public enum PostStatus
    {
        Published,
        Draft,
        Flagged
    }

    public class PostData
    {
        // --- Server managed, never set by user ---
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string? Author { get; set; }      // set from JWT
        public string? AuthorId { get; set; }    // set from JWT

        public PostStatus Status { get; set; } = PostStatus.Draft;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int Likes { get; set; } = 0;
        public int Comments { get; set; } = 0;

        // --- Required from user ---
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        [MaxLength(500)]
        public string ImageUrl { get; set; }

        [Required]
        [MaxLength(50)]
        public string Category { get; set; }

        [Required]
        public int Duration { get; set; } // in seconds

        // --- Optional from user ---
        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(500)]
        public string? ReferenceUrl { get; set; }

        public bool ShowWithReference { get; set; } = false;
    }
}