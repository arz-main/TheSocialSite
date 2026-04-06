using TheSocialSite.Business.Interfaces;
using TheSocialSite.Business.Structure;

namespace TheSocialSite.Business
{
    public class BusinessLogic
    {
        public BusinessLogic() { }
        public IAuthInteractAction UserAuthAction()
        {
            return new AuthInteractAction();
        }
        public IUserInteractAction UserInteractAction()
        {
            return new UserInteractAction();
        }
        public IPostInteractAction PostInteractAction()
        {
            return new PostInteractAction();
        }
        public IJwtInteractAction JwtInteractAction()
        {
            return new JwtInteractAction();
        }
        public ISocialMediaInteractAction SocialMediaInteractAction()
        {
            return new SocialMediaInteractAction();
        }
        public IAdminInteractAction AdminInteractAction()
        {
            return new AdminInteractAction();
        }
        public ICommentInteractAction CommentInteractAction()
        {
            return new CommentInteractAction();
        }
        public IBadgeInteractAction BadgeInteractAction()
        {
            return new BadgeInteractAction();
        }
    }
}
