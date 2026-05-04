using TheSocialSite.Domain.Entities.Badge;

namespace TheSocialSite.Domain.Models.Badge
{
    public class CreateBadgeTemplateDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string IconUrl { get; set; }
        public BadgeTier Tier { get; set; }
        public BadgeCategory Category { get; set; }
        public int CriteriaTarget { get; set; }
    }
}