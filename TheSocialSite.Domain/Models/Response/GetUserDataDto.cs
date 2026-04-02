using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Domain.Models.Response
{
    public class GetUserDataDto
    {
        public string Id { get; set; }
        public string Email { get; set; } 
        public Role Role { get; set; } = Role.User;
        public string Username { get; set; }
        public string? Avatar { get; set; }
        public string? Bio { get; set; }
        public string? Location { get; set; }
        public string? Website { get; set; }
        public SocialMedia? SocialLinks { get; set; }
        public int? PostsCount { get; set; }
        public DateTime JoinedDate { get; set; }
    }
}
