using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Models.Post;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Structure
{
    public class PostInteractAction : PostActions, IPostInteractAction
    {
        public PostActionResponse GetAllPostsAction()
        {
            return GetAllPostsActionExecution();
        }
        public PostActionResponse GetUserPostsAction(string id)
        {
            return GetUserPostsActionExecution(id);
        }
        public DefaultActionResponse CreatePostAction(CreatePostDto postData, string userId)
        {
            return CreatePostActionExecution(postData, userId);
        }

    }
}
