using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.Response
{
    public class SignupActionResponse
    {
        public string Email { get; set; }
        public string? Username { get; set; }
        public bool IsValid { get; set; }
        public string? Message { get; set; }
    }
}
