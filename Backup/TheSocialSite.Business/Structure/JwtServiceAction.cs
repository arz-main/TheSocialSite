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
    public class JwtServiceAction : JwtServiceActions, IJwtServiceAction
    {
        public string GenerateTokenAction(string username, string id)
        {
            return GenerateTokenActionExecution(username, id);
        }
    }
}
