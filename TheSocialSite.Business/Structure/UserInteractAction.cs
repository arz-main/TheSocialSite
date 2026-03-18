using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.User;


namespace TheSocialSite.Business.Structure
{
    public class UserInteractAction : UserActions, IUserInteractAction
    {
        public UserData[] GetAllUsersAction()
        {
            return GetAllUsersActionExecution();
        }
        public UserSignupValidationDto CreateUserAction(UserSignupDto userData)
        {
            return CreateUserActionExecution(userData);
        }
    }
}
