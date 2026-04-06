using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Domain.Entities.Comment
{
    public class CommentData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [Required]
        public string PostId { get; set; } // forward navigation to the Post that contains this comment
        [ForeignKey("PostId")]
        public PostData Post { get; set; }

        [Required]
        public string AuthorId { get; set; } // forward navigation to User for username, avatar, etc.
        [ForeignKey("AuthorId")]
        public UserData Author { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Content { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
