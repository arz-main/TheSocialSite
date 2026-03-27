using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Structure
{
    public class SocialMediaInteractAction : SocialMediaActions, ISocialMediaInteractAction
    {
        public SocialMediaActionResponse GetSocialMediaAction(string userId)
        {
            return GetSocialMediaActionExecution(userId);
        }

        public SocialMediaActionResponse CreateSocialMediaAction(SocialMediaDto links)
        {
            return CreateSocialMediaActionExecution(links);
        }

        public SocialMediaActionResponse UpdateSocialMediaAction(SocialMediaDto links)
        {
            return UpdateSocialMediaActionExecution(links);
        }

        public SocialMediaActionResponse DeleteSocialMediaAction(string userId)
        {
            return DeleteSocialMediaActionExecution(userId);
        }
    }
}
