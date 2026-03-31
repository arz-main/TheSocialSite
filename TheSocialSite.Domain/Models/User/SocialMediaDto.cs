using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.User
{
    public class SocialMediaDto
    {
        public string UserId { get; set; } = null!;
        public string? Pinterest { get; set; }
        public string? Twitter { get; set; }
        public string? DeviantArt { get; set; }
        public string? YouTube { get; set; }
        public string? Discord { get; set; }
    }
}
