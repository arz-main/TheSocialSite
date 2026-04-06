using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Interfaces
{
    public interface IUserInteractAction
    {
        public List<UserDto> GetAllUsersAction();
        public UserDto GetUserByIdAction(string userId);
        public SignupActionResponse CreateUserAction(UserSignupDto userData);
        public DefaultActionResponse UpdateUserAction(string userId, UpdateUserDto data);
        public DefaultActionResponse DeleteUserAction(string userId);

    }
}
