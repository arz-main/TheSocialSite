using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Domain.Models.Post
{
    public class PostCreationDto
    {
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string Author { get; set; }
        public string? Description { get; set; }
        public string? ReferenceUrl { get; set; }
        public string Category { get; set; }
        public int? Duration { get; set; }
        public bool? ShowWithReference { get; set; }
    }
}
