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
        public UserActionResponse UserSignupValidationAction(CreateUserDto userData)
        {
            return UserSignupValidationExecution(userData);
        }
        public JwtActionResponse UserLoginDataValidationAction(UserLoginDto loginData)
        {
            return UserLoginDataValidationExecution(loginData);
        }
        public JwtActionResponse RefreshTokenAction(string userId)
        {
            return RefreshTokenActionExecution(userId);
        }
    }
}
