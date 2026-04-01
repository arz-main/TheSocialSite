using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Domain.Models.User
{
    public class UserUpdateDto
    {
        [MaxLength(50)] public string? Username { get; set; }
        [MaxLength(150)] public string? Email { get; set; }
        [MaxLength(100)] public string? Location { get; set; }
        [MaxLength(150)] public string? Website { get; set; }
        [MaxLength(500)] public string? Bio { get; set; }
        [MaxLength(250)] public string? Avatar { get; set; } // URL to image
        public string Role { get; set; }
        public SocialMediaDto? SocialLinks { get; set; }
    }
}