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
        [MaxLength(100)]
        public string? Twitter { get; set; }

        [MaxLength(100)]
        public string? Facebook { get; set; }

        [MaxLength(100)]
        public string? Instagram { get; set; }

        [MaxLength(100)]
        public string? LinkedIn { get; set; }
    }
}
