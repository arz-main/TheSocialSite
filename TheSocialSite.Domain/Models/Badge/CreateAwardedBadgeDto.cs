using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.Badge
{
    public class CreateAwardedBadgeDto
    {
        public string UserId { get; set; }
        public string BadgeTemplateId { get; set; }
    }
}
