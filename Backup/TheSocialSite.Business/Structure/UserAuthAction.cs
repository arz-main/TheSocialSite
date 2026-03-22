using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Structure
{
    public class UserAuthAction : AuthActions, IUserAuthAction
    {
        public SignupActionResponse UserSignupValidation(UserSignupDto userData)
        {
            return UserSignupValidationExecution(userData);
        }
        public SignupActionResponse UserCreationAction(UserSignupDto userData)
        {
            return UserCreationExecution(userData);
        }
        public LoginActionResponse UserLoginDataValidation(UserLoginDto loginData)
        {
            return UserLoginDataValidationExecution(loginData);
        }
    }
}
