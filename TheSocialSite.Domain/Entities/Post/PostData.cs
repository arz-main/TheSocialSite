using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Entities.Post
{
    using global::TheSocialSite.Domain.Entities.User;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace TheSocialSite.Domain.Entities.Post
    {
        public class PostData
        {
            [Key]
            [Required]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public string Id { get; set; }

            [Required]
            public string UserId { get; set; }

            [ForeignKey("UserId")]
            public UserData? User { get; set; }

            [Required]
            [MaxLength(50)]
            public string Username { get; set; }

            [Required]
            [MaxLength(500)]
            public string ImageUrl { get; set; }

            [MaxLength(500)]
            public string? ReferenceUrl { get; set; }

            [Required]
            [MaxLength(50)]
            public string Category { get; set; }

            [Required]
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

            [Required]
            public int Likes { get; set; } = 0;

            [Required]
            public int Comments { get; set; } = 0;

            [Required]
            public bool MadeWithReference { get; set; } = false;

            [Required]
            public int? Duration { get; set; } // in seconds

        }
    }
}
