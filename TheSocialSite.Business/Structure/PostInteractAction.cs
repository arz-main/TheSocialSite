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
        public PostActionResponse GetAllPostsAction(string userId)
        {
            return GetAllPostsActionExecution(userId);
        }
        public PostActionResponse GetUserPostsAction(string id, string userId)
        {
            return GetUserPostsActionExecution(id, userId);
        }
        public PostActionResponse CreatePostAction(CreatePostDto postData, string userId)
        {
            return CreatePostActionExecution(postData, userId);
        }
        public PostActionResponse GetPostByIdAction(string postId, string userId)
        {
            return GetPostByIdActionExecution(postId, userId);
        }
        public PostActionResponse DeletePostAction(string id)
        {
            return DeletePostActionExecution(id);
        }
        public PostActionResponse ToggleLikePostAction(string postId, string userId)
        {
            return ToggleLikePostActionExecution(postId, userId); 
        }
    }
}
