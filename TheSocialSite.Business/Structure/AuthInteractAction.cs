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
    public class AuthInteractAction : AuthActions, IAuthInteractAction
    {
        public SignupActionResponse UserSignupValidationAction(UserSignupDto userData)
        {
            return UserSignupValidationExecution(userData);
        }
        public LoginActionResponse UserLoginDataValidationAction(UserLoginDto loginData)
        {
            return UserLoginDataValidationExecution(loginData);
        }
        public LoginActionResponse RefreshTokenAction(string userId)
        {
            return RefreshTokenActionExecution(userId);
        }
    }
}
