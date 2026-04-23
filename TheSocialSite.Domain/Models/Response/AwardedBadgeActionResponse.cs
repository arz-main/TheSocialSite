using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.Badge;
using TheSocialSite.Domain.Models.Badge;

namespace TheSocialSite.Domain.Models.Response
{
    public class AwardedBadgeActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public AwardedBadgeDto? AwardedBadge { get; set; }
        public List<AwardedBadgeDto>? AwardedBadges { get; set; }
    }
}