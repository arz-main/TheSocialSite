using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Interfaces
{
    public interface IAuthInteractAction
    {
        UserActionResponse UserSignupValidationAction(CreateUserDto userData);
        JwtActionResponse UserLoginDataValidationAction(UserLoginDto loginData);
        JwtActionResponse RefreshTokenAction(string userId);
    }
}
