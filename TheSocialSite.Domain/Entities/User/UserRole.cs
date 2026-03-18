using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Entities.User
{
    public enum UserRole
    {
        User,
        Admin,
        Moderator
    }
}
