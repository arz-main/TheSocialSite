using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;


namespace TheSocialSite.Business.Structure
{
    public class UserInteractAction : UserActions, IUserInteractAction
    {
        public List<UserData> GetAllUsersAction()
        {
            return GetAllUsersActionExecution();
        }
        public SignupActionResponse UserCreationAction(UserSignupDto userData)
        {
            return UserCreationActionExecution(userData);
        }
        public DefaultActionResponse UserUpdateAction(string userId, UserUpdateDto data)
        {
            return UserUpdateActionExecution(userId, data);
        }
        public UserData GetUserByIdAction(string userId)
        {
            return GetUserByIdActionExecution(userId);
        }
        public DefaultActionResponse UserDeleteAction(string userId)
        {
            return UserDeleteActionExecution(userId);
        }
    }
}
