using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.Response
{
    public class LoginActionResponse
    {
        public string UserIdentifier { get; set; } // can be email or username
        public bool IsValid { get; set; } = true;
        public string? Message { get; set; }
        public string Token { get; set; }
    }
}
