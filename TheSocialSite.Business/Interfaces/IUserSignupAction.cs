using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Interfaces
{
    public interface IUserSignupAction
    {
        UserSignupValidationDto UserSignupValidation(UserSignupDto userData);
        UserSignupValidationDto UserCreation(UserSignupDto userData);
    }
}
