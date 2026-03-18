using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.User
{
    public class UserLoginDto
    {
        [Required]
        [MaxLength(150)]
        public string UserIdentifier { get; set; } // can be email or username

        [Required]
        [MaxLength(256)]
        public string Password { get; set; }
    }
}
