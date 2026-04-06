using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Models.Badge;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Interfaces
{
    public interface IBadgeInteractAction
    {
        BadgeActionResponse GetBadgeByIdAction(string badgeId);
        BadgeActionResponse GetBadgesByUserIdAction(string userId);
        BadgeActionResponse CreateBadgeAction(CreateBadgeDto badgeData);
        BadgeActionResponse UpdateBadgeAction();
        BadgeActionResponse DeleteBadgeByIdAction(string badgeId);
    }
}
