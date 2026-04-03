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
        public DefaultActionResponse AdminUserUpdateAction(string userId, UpdateUserDto data)
        {
            return AdminUserUpdateActionExecution(userId, data);
        }

        public DefaultActionResponse AdminUserDeleteAction(string userId)
        {
            return AdminUserDeleteActionExecution(userId);
        }
    }
}
