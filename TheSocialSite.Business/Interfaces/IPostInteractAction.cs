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
        public List<PostData> GetAllPostsAction();
        public List<PostData> GetUserPostsAction(string id);
        public DefaultActionResponse PostCreationAction(PostCreationDto postData, string userId, string username);
    }
}
