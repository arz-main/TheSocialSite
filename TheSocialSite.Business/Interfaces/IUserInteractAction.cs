using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Interfaces
{
    public interface IUserInteractAction
    {
        public List<UserData> GetAllUsersAction();
        public UserData GetUserByIdAction(string userId);
        public SignupActionResponse UserCreationAction(UserSignupDto userData);
        DefaultActionResponse UserUpdateAction(string userId, UserUpdateDto data);
    }
}
