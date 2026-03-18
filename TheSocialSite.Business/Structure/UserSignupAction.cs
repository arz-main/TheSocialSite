using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Structure
{
    public class UserSignupAction : UserActions, IUserSignupAction
    {
        public UserSignupValidationDto UserSignupValidation(UserSignupDto userData)
        {
            return UserSignupValidationExecution(userData);
        }
        public UserSignupValidationDto UserCreation(UserSignupDto userData)
        {
            return UserCreationExecution(userData);
        }
    }
}
