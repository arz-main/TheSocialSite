using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Structure
{
    public class AdminInteractAction : AdminActions, IAdminInteractAction
    {
        public DefaultActionResponse AdminUpdateUserAction(string userId, UpdateUserDto data)
        {
            return AdminUpdateUserActionExecution(userId, data);
        }
        public DefaultActionResponse AdminDeleteUserAction(string userId)
        {
            return AdminDeleteUserActionExecution(userId);
        }
        public DefaultActionResponse AdminDeletePostAction(string id)
        {
            return AdminDeletePostActionExecution(id);
        }
    }
}
