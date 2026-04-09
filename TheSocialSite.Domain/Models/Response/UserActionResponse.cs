using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Domain.Models.Response
{
    public class UserActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public UserDto? UserDto { get; set; }
        public List<UserDto>? UserDtos { get; set; } = [];
    }
}
