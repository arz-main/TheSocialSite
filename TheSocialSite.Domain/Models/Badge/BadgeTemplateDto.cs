using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.Badge;

namespace TheSocialSite.Domain.Models.Badge
{
    public class BadgeTemplateDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string IconUrl { get; set; }
        public BadgeCategory Category { get; set; }
        public BadgeTier Tier { get; set; }
        public int CriteriaTarget { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
