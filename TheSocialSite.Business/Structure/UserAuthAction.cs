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
    public class UserAuthAction : AuthActions, IUserAuthAction
    {
        public UserSignupValidationDto UserSignupValidation(UserSignupDto userData)
        {
            return UserSignupValidationExecution(userData);
        }
        public UserSignupValidationDto CreateUserAction(UserSignupDto userData)
        {
            return UserCreationExecution(userData);
        }
        public UserLoginValidationDto UserLoginDataValidation(UserLoginDto loginData)
        {
            return UserLoginDataValidationExecution(loginData);
        }
    }
}
