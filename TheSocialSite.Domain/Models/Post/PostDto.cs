using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Domain.Models.Post
{
    public class PostDto
    {
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public string AuthorUsername { get; set; } // flattened from Author navigation
        public string AuthorAvatarUrl { get; set; } // optional, from Author
        public PostStatus Status { get; set; }
        public int Likes { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string Category { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
