using TheSocialSite.Business.Interfaces;
using TheSocialSite.Business.Structure;

namespace TheSocialSite.Business
{
    public class BusinessLogic
    {
        public BusinessLogic() { }
        public IUserAuthAction UserAuthAction()
        {
            return new UserAuthAction();
        }
        public IUserInteractAction UserInteractAction()
        {
            return new UserInteractAction();
        }
        public IPostInteractAction PostInteractAction()
        {
            return new PostInteractAction();
        }
        public IJwtServiceAction JwtService()
        {
            return new JwtServiceAction();
        }
    }
}
