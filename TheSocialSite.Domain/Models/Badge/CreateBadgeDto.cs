using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.Badge;

namespace TheSocialSite.Domain.Models.Badge
{
    public class CreateBadgeDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string IconUrl { get; set; }
        public BadgeCategory Category { get; set; }
        public BadgeTier Tier { get; set; }
        public string UserId { get; set; }

    }
}
