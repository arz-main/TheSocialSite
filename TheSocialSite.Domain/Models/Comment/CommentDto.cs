using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.Comment
{
    public class CommentDto
    {
        public string Id { get; set; }

        [Required]
        public string PostId { get; set; }

        [Required]
        public string AuthorId { get; set; }

        public string AuthorUsername { get; set; } // flattened from Author navigation

        public string AuthorAvatarUrl { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Content { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }

}
