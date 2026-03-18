using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Models.Post;

namespace TheSocialSite.Business.Structure
{
    public class PostInteractAction : PostActions, IPostInteractAction
    {
        public PostData[] GetAllPostsAction()
        {
            return GetAllPostsActionExecution();
        }
        public PostValidationDto CreatePostAction(CreatePostDto postData)
        {
            return CreatePostActionExecution(postData);
        }
    }
}
