using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Badge;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Structure
{
    public class BadgeTemplateInteractAction : BadgeTemplateActions, IBadgeTemplateInteractAction
    {
        public BadgeTemplateActionResponse GetBadgeTemplateByIdAction(string badgeId)
        {
            return GetBadgeTemplateByIdActionExecution(badgeId);
        }
        public BadgeTemplateActionResponse GetAllBadgeTemplatesAction()
        {
            return GetAllBadgeTemplatesActionExecution();
        }
        public BadgeTemplateActionResponse CreateBadgeTemplateAction(CreateBadgeTemplateDto badgeData)
        {
            return CreateBadgeTemplateActionExecution(badgeData);
        }
        public BadgeTemplateActionResponse UpdateBadgeTemplateAction(string badgeId, UpdateBadgeTemplateDto badgeData)
        {
            return UpdateBadgeTemplateActionExecution(badgeId, badgeData);
        }
        public BadgeTemplateActionResponse DeleteBadgeTemplateByIdAction(string badgeId)
        {
            return DeleteBadgeTemplateByIdActionExecution(badgeId);
        }
    }
}
