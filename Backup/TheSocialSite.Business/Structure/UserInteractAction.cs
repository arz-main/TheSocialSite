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
        public UserActionResponse GetAllUsersAction()
        {
            return GetAllUsersActionExecution();
        }
        public UserActionResponse CreateUserAction(CreateUserDto userData)
        {
            return CreateUserActionExecution(userData);
        }
        public UserActionResponse UpdateUserAction(string userId, UpdateUserDto data)
        {
            return UpdateUserActionExecution(userId, data);
        }
        public UserActionResponse GetUserByIdAction(string userId)
        {
            return GetUserByIdActionExecution(userId);
        }
        public UserActionResponse DeleteUserAction(string userId)
        {
            return DeleteUserActionExecution(userId);
        }
    }
}
