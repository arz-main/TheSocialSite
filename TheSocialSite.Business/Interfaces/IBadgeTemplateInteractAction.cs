using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Models.Badge;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Interfaces
{
    public interface IBadgeTemplateInteractAction
    {
        BadgeTemplateActionResponse GetBadgeTemplateByIdAction(string badgeId);
        BadgeTemplateActionResponse GetAllBadgeTemplatesAction();
        BadgeTemplateActionResponse CreateBadgeTemplateAction(CreateBadgeTemplateDto badgeData);
        BadgeTemplateActionResponse UpdateBadgeTemplateAction(string badgeId, UpdateBadgeTemplateDto badgeData);
        BadgeTemplateActionResponse DeleteBadgeTemplateByIdAction(string badgeId);
    }
}
