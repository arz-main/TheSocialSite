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
    public class BadgeInteractAction : BadgeActions, IBadgeInteractAction
    {
        public BadgeActionResponse GetBadgeByIdAction(string badgeId)
        {
            return GetBadgeByIdActionExecution(badgeId);
        }
        public BadgeActionResponse GetBadgesByUserIdAction(string userId)
        {
            return GetBadgesByUserIdActionExecution(userId);
        }
        public BadgeActionResponse CreateBadgeAction(CreateBadgeDto badgeData)
        {
            return CreateBadgeActionExecution(badgeData);
        }
        public BadgeActionResponse UpdateBadgeAction()
        {
            return UpdateBadgeActionExecution();
        }
        public BadgeActionResponse DeleteBadgeByIdAction(string badgeId)
        {
            return DeleteBadgeByIdActionExecution(badgeId);
        }
    }
}
