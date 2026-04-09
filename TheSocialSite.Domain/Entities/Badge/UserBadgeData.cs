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
    public class UserBadgeData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public UserData User { get; set; }

        public string BadgeTemplateId { get; set; }
        [ForeignKey("BadgeTemplateId")]
        public BadgeTemplateData BadgeTemplate { get; set; }

        public DateTime EarnedDate { get; set; } = DateTime.UtcNow;
    }
}
