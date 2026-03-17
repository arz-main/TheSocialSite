using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Business.Core;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Structure
{
    public class UserLoginAction : UserActions, IUserLoginAction
    {
        public UserLoginValidationDto UserLoginDataValidation(UserLoginDto loginData)
        {
            return UserLoginDataValidationExecution(loginData);
        }

    }
}
