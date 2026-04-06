using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Domain.Entities.Badge
{
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
    public class BadgeData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string UserId { get; set; } // forward navigation to User who earned this badge

        [ForeignKey("UserId")]
        public UserData User { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string IconUrl { get; set; }

        public BadgeCategory Category { get; set; } = BadgeCategory.Engagement;

        public BadgeTier Tier { get; set; } = BadgeTier.Bronze; // e.g. 1 = Bronze, 2 = Silver, 3 = Gold

        public bool IsEarned { get; set; } = false;

        public DateTime? EarnedDate { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
