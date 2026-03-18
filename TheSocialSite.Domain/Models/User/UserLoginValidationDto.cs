using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.User
{
    public class UserLoginValidationDto
    {
        public string UserIdentifier { get; set; } // can be email or username

        [NotMapped] // this field is not stored in DB
        public bool IsValid { get; set; } = true;

        [NotMapped]
        public string? ErrorMessage { get; set; }

        [NotMapped]
        public string Token { get; set; }
    }
}
