using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Domain.Models.Response
{
    public class SocialMediaActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public SocialMediaDto? Links { get; set; }
    }
}
