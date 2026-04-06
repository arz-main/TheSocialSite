using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.Badge;

namespace TheSocialSite.Domain.Models.Badge
{
    public class BadgeDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string IconUrl { get; set; }
        public BadgeCategory Category { get; set; }
        public BadgeTier Tier { get; set; }
        public bool IsEarned { get; set; }
        public DateTime? EarnedDate { get; set; }
        public DateTime CreatedAt { get; set; }

        // Flattened user info, no overfething, no tight coupling to UserData
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string UserAvatarUrl { get; set; }
    }
}
