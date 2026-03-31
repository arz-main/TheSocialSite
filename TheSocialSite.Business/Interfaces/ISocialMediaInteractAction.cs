using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Interfaces
{
    public interface ISocialMediaInteractAction
    {
        SocialMediaActionResponse GetSocialMediaAction(string userId);

        SocialMediaActionResponse CreateSocialMediaAction(SocialMediaDto links);

        SocialMediaActionResponse UpdateSocialMediaAction(SocialMediaDto links);

        SocialMediaActionResponse DeleteSocialMediaAction(string userId);
    }
}
