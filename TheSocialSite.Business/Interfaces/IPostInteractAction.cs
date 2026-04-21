using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Models.Post;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Interfaces
{
    public interface IPostInteractAction
    {
        public PostActionResponse GetAllPostsAction(string userId);
        public PostActionResponse GetPostByIdAction(string postId, string user);
        public PostActionResponse GetUserPostsAction(string id, string userId);
        public PostActionResponse CreatePostAction(CreatePostDto postData, string userId);
        public PostActionResponse DeletePostAction(string id);
        public PostActionResponse ToggleLikePostAction(string postId, string userId);

    }
}
