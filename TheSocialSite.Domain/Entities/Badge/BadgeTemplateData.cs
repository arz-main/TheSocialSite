using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TheSocialSite.Domain.Entities.Badge;
using TheSocialSite.Domain.Entities.User;

public enum BadgeTier
{
    Bronze = 1,
    Silver = 2,
    Gold = 3
};

public enum BadgeCategory
{
    Engagement = 1,
    ContentCreation = 2,
    CommunitySupport = 3,
    Milestone = 4
};

public class BadgeTemplateData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; }

    public string Title { get; set; }
    public string Description { get; set; }
    public string IconUrl { get; set; }
    public BadgeCategory Category { get; set; } = BadgeCategory.Engagement;
    public BadgeTier Tier { get; set; } = BadgeTier.Bronze;
    public int CriteriaTarget { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<UserBadgeData> UserBadges { get; set; }
}
