using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Interfaces
{
    public interface IAdminInteractAction
    {
        public DefaultActionResponse AdminUpdateUserAction(string userId, UpdateUserDto data);
        public DefaultActionResponse AdminDeleteUserAction(string userId);
        public DefaultActionResponse AdminDeletePostAction(string id);
    }
}
