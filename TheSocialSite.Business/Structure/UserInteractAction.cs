using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;


namespace TheSocialSite.Business.Structure
{
    public class UserInteractAction : UserActions, IUserInteractAction
    {
        public UserData[] GetAllUsersAction()
        {
            return GetAllUsersActionExecution();
        }
        public SignupActionResponse UserCreationAction(UserSignupDto userData)
        {
            return UserCreationActionExecution(userData);
        }
        public ActionResponse UpdateProfileAction(string userId, UpdateProfileDto data)
        {
            return UpdateProfileExecution(userId, data);
        }
    }
}
