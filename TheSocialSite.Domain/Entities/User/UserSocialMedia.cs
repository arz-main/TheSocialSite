using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Entities.User
{
    public class UserSocialMedia
    {
        public bool HasSocialLinks { get; set; } = true;

        [MaxLength(200)] public string? Pinterest { get; set; }
        [MaxLength(200)] public string? Twitter { get; set; }
        [MaxLength(200)] public string? DeviantArt { get; set; }
        [MaxLength(200)] public string? YouTube { get; set; }
        [MaxLength(100)] public string? Discord { get; set; }
    }
}
