using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Models.Badge;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Interfaces
{
    public interface IAwardedBadgeInteractAction
    {
        AwardedBadgeActionResponse GetAwardedBadgeByIdAction(string id);
        AwardedBadgeActionResponse GetAwardedBadgeByUserIdAction(string userId);
        AwardedBadgeActionResponse CreateAwardedBadgeAction(CreateAwardedBadgeDto data);
        AwardedBadgeActionResponse UpdateAwardedBadgeAction(UpdateAwardedBadgeDto data);
        AwardedBadgeActionResponse DeleteAwardedBadgeAction(string awardedBadgeId);
    }
}
