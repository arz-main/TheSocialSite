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
        public List<UserDto> GetAllUsersAction()
        {
            return GetAllUsersActionExecution();
        }
        public SignupActionResponse CreateUserAction(UserSignupDto userData)
        {
            return CreateUserActionExecution(userData);
        }
        public DefaultActionResponse UpdateUserAction(string userId, UpdateUserDto data)
        {
            return UpdateUserActionExecution(userId, data);
        }
        public UserDto GetUserByIdAction(string userId)
        {
            return GetUserByIdActionExecution(userId);
        }
        public DefaultActionResponse DeleteUserAction(string userId)
        {
            return DeleteUserActionExecution(userId);
        }
    }
}
