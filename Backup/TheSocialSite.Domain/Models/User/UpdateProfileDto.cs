using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.Response
{
    public class UpdateProfileDto
    {
        [MaxLength(50)] public string? Username { get; set; }
        [MaxLength(150)] public string? Email { get; set; }
        [MaxLength(100)] public string? Location { get; set; }
        [MaxLength(150)] public string? Website { get; set; }
        [MaxLength(500)] public string? Bio { get; set; }
        [MaxLength(250)] public string? Avatar { get; set; } // URL to image
        public UserSocialMediaDto? SocialLinks { get; set; }
    }

    public class UserSocialMediaDto
    {
        public string? Pinterest { get; set; }
        public string? Twitter { get; set; }
        public string? DeviantArt { get; set; }
        public string? YouTube { get; set; }
        public string? Discord { get; set; }
    }
}