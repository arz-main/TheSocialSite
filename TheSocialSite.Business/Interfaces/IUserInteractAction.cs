using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Interfaces
{
    public interface IUserInteractAction
    {
        public List<UserData> GetAllUsersAction();
        public UserData GetUserByIdAction(string userId);
        public SignupActionResponse UserCreationAction(UserSignupDto userData);
        ActionResponse UpdateProfileAction(string userId, UpdateProfileDto data);
    }
}
