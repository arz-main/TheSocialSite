using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.User;

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
            [Key]
            [Required]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public string Id { get; set; }

            [Required]
        public UserData Author { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

            [Required]
        public PostStatus Status { get; set; } = PostStatus.Draft;

            [Required]
            [MaxLength(500)]
            public string ImageUrl { get; set; }

            [MaxLength(500)]
            public string? ReferenceUrl { get; set; }

            [Required]
            [MaxLength(50)]
            public string Category { get; set; }

            [Required]
        public int? Duration { get; set; } // in seconds

            [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

            [Required]
        public int? Likes { get; set; } = 0;

            [Required]
        public int? Comments { get; set; } = 0;

            [Required]
        public bool? ShowWithReference { get; set; } = false;
    }
}
