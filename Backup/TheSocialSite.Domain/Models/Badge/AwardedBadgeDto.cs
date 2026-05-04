using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.Badge
{
    public class AwardedBadgeDto
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string BadgeTemplateId { get; set; }
        public DateTime EarnedDate { get; set; }
    }
}
