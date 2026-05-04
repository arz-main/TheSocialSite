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
        public UserActionResponse GetAllUsersAction();
        public UserActionResponse GetUserByIdAction(string userId);
        public UserActionResponse CreateUserAction(CreateUserDto userData);
        public UserActionResponse UpdateUserAction(string userId, UpdateUserDto data);
        public UserActionResponse DeleteUserAction(string userId);

    }
}
