using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core.Badges;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Badge;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Structure
{
    public class AwardedBadgeInteractAction: AwardedBadgeActions, IAwardedBadgeInteractAction
    {
        public AwardedBadgeActionResponse GetAwardedBadgeByIdAction(string id)
        {
            return GetAwardedBadgeByIdActionExecution(id);
        }
        public AwardedBadgeActionResponse GetAwardedBadgeByUserIdAction(string userId)
        {
            return GetAwardedBadgeByUserIdActionExecution(userId);
        }
        public AwardedBadgeActionResponse CreateAwardedBadgeAction(CreateAwardedBadgeDto data)
        {
            return CreateAwardedBadgeActionExecution(data);
        }
        public AwardedBadgeActionResponse UpdateAwardedBadgeAction(UpdateAwardedBadgeDto data)
        {
            return UpdateAwardedBadgeActionExecution(data);
        }
        public AwardedBadgeActionResponse DeleteAwardedBadgeAction(string awardedBadgeId)
        {
            return DeleteAwardedBadgeActionExecution(awardedBadgeId);
        }
    }
}
