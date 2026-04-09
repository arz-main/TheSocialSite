using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Models.Badge;

namespace TheSocialSite.Domain.Models.Response
{
    public class BadgeTemplateActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public BadgeTemplateDto? BadgeTemplate { get; set; }
        public List<BadgeTemplateDto>? BadgeTemplates { get; set; }
    }
}
