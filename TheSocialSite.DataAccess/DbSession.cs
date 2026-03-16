using TheSocialSite.DataAccess.Context;

namespace TheSocialSite.DataAccess
{
    public class DbSession
    {
        public UserContext UserContext()
        {
            return new UserContext();
        }
        public PostContext PostContext()
        {
            return new PostContext();
        }
    }
}