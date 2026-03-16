using TheSocialSite.Business.Interfaces;
using TheSocialSite.Business.Structure;

namespace TheSocialSite.Business
{
    public class BusinessLogic
    {
        public BusinessLogic() { }
        public IUserLoginAction UserLoginAction()
        {
            return new UserLoginAction();
        }
        public IUserSignupAction UserSignupAction()
        {
            return new UserSignupAction();
        }
    }
}
