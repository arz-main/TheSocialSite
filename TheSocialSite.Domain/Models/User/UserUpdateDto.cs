using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.SocialMedia;

namespace TheSocialSite.Domain.Models.User
{
    public class UpdateUserDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Location { get; set; }
        public string? Website { get; set; }
        public string? Bio { get; set; }
        public string? Avatar { get; set; } // URL to image
        public Role? Role { get; set; }
        public SocialMediaDto? SocialMedia { get; set; }
    }
}