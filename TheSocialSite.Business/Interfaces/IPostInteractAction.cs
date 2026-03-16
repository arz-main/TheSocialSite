using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Models.Post;

namespace TheSocialSite.Business.Interfaces
{
    public interface IPostInteractAction
    {
        public PostData[] GetAllPostsAction();
        public PostValidationDto CreatePostAction(CreatePostDto postData);
    }
}
