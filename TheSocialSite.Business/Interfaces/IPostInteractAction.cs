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
        public PostActionResponse GetAllPostsAction();
        public PostActionResponse GetPostsByIdAction(string postId);
        public PostActionResponse GetUserPostsAction(string id);
        public DefaultActionResponse CreatePostAction(CreatePostDto postData, string userId);
        public DefaultActionResponse DeletePostAction(string id);
    }
}
