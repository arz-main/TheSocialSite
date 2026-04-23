using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.Badge
{
    public class UpdateBadgeTemplateDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string IconUrl { get; set; }
        public BadgeTier Tier { get; set; }
        public BadgeCategory Category { get; set; }
        public int CriteriaTarget { get; set; }
    }
}
