using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Business.Structure
{
    public class JwtInteractAction : JwtActions, IJwtInteractAction
    {
        public string GenerateTokenAction(string id, string username, Role role)
        {
            return GenerateTokenActionExecution(id, username, role);
        }
    }
}
